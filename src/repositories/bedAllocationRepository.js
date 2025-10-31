const { where, fn, col, Op, literal } = require("sequelize");
const moment = require('moment-timezone');
const sequelize = require("../../config/database");
const Bed = require("../models/Bed");
const BedAllocation = require("../models/BedAllocations");
const BedGroup = require("../models/BedGroup");
const BedType = require("../models/BedType");
const Blocks = require("../models/Blocks");
const Floor = require("../models/Floor");
const IpdPatients = require("../models/IPDPatient");
const Ward = require("../models/Ward");
// const Department = require("../models/Department");
const Patient = require("../models/Patient");
const IPDPatient = require("../models/IPDPatient");
const { fetchCharges, createBill } = require("../utils/utils");

let Departments = [
    {
        "id": 1,
        "name": "Cardiology",
        "description": "Department specializing in heart-related treatments.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    },
    {
        "id": 2,
        "name": "Neurology",
        "description": "Department focusing on disorders of the nervous system.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    },
    {
        "id": 3,
        "name": "Orthopedics",
        "description": "Department dealing with musculoskeletal issues.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    },
    {
        "id": 4,
        "name": "Pediatrics",
        "description": "Department for medical care of infants, children, and adolescents.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    },
    {
        "id": 5,
        "name": "Emergency Medicine",
        "description": "Department handling urgent and emergency situations.",
        "hospital_id": 1,
        "unit_id": 1,
        "createdAt": "2024-11-13T11:04:22.000Z",
        "updatedAt": "2024-11-13T11:04:22.000Z"
    }
]

const bedAllocation = async (data) => {
    try {
        const case_id = data.case_id ? data.case_id : await generateCaseId();

        const transaction = await sequelize.transaction();

        try {
            const existingPatient = await IpdPatients.findOne({ where: { case_id } });

            if (existingPatient) {
                // ✅ Use existing admission_id for updates
                const admissionId = existingPatient.admission_id;

                // ✅ Update IpdPatients (with same admission_id)
                await IpdPatients.update(
                    {
                        admission_date: data.admission_date,
                        diagnosis: data.diagnosis,
                        doctor_id: data.doctor_id,
                        patient_mrn: data.patient_mrn,
                        status: 'Bed Allocated',
                        acknowledged_status: null
                    },
                    { where: { case_id }, transaction }
                );

                // ✅ Update BedAllocation (same admission_id)
                await BedAllocation.update(
                    {
                        bed_id: data.bed_id,
                        patient_mrn: data.patient_mrn,
                        admission_date: data.admission_date,
                        status: 'Bed Allocated',
                        hospital_id: data.hospital_id,
                        unit_id: data.unit_id,
                    },
                    { where: { case_id }, transaction }
                );

                // ✅ Set new bed as unavailable
                await Bed.update(
                    { is_available: false },
                    { where: { id: data.bed_id }, transaction }
                );

                await transaction.commit();
                return 'Bed allocation and admission updated successfully';
            } else {
                // ✅ Same old creation logic
                const lastRecord = await BedAllocation.findOne({
                    order: [['admission_id', 'DESC']],
                });
                const newAdmissionId = lastRecord ? lastRecord.admission_id + 1 : 1;

                const patientData = {
                    admission_date: data.admission_date,
                    diagnosis: data.diagnosis,
                    doctor_id: data.doctor_id,
                    patient_mrn: data.patient_mrn,
                    case_id: case_id,
                    status: 'Bed Allocated',
                    admission_id: newAdmissionId,
                };

                const bedData = {
                    case_id: case_id,
                    bed_id: data.bed_id,
                    patient_mrn: data.patient_mrn,
                    admission_date: data.admission_date,
                    status: 'Bed Allocated',
                    hospital_id: data.hospital_id,
                    unit_id: data.unit_id,
                    admission_id: newAdmissionId,
                };

                const patientRecord = await IpdPatients.create(patientData, { transaction });

                await BedAllocation.create(bedData, { transaction });

                await Bed.update(
                    { is_available: false },
                    { where: { id: data.bed_id }, transaction }
                );

                await transaction.commit();
                return 'Bed allocation and patient admission created successfully';
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const findLatestPatient = async () => {
    return await BedAllocation.findOne({
        order: [['admission_id', 'DESC']],
    });
};

const generateCaseId = async () => {
    try {
        const allCases = await IpdPatients.findAll({
            attributes: ['case_id'],
            raw: true,
        });

        const caseIds = allCases.map(c => c.case_id?.toString());

        const ipdCaseIds = caseIds
            .filter(id => id && /^IPD-\d{1,}$/.test(id)) // strict match for IPD-xxxx
            .map(id => parseInt(id.replace('IPD-', ''), 10));

        const maxNumber = ipdCaseIds.length > 0 ? Math.max(...ipdCaseIds) : 0;

        const nextNumber = maxNumber + 1;
        return `IPD-${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
        console.error('Error generating case_id:', error);
        throw new Error('Failed to generate case_id');
    }
};

const getIPDPatientList = async (data) => {
    try {
        const whereClause = {
            ...(data.case_id && { case_id: data.case_id }),
            ...(data.patient_id && { patient_mrn: data.patient_mrn }),
            ...(data.patient_mrn && { patient_mrn: data.patient_mrn }),
            ...(data.hospital_id && { hospital_id: data.hospital_id }),
            ...(data.unit_id && { unit_id: data.unit_id }),
        };
        const status = {
            ...(data.status && { status: data.status })
        }
        const getList = await BedAllocation.findAll({
            where: whereClause,
            include: [
                {
                    model: IpdPatients,
                    required: true,
                    where: status,
                    include: [
                        {
                            model: Patient,
                            as: 'patient'
                        }
                    ]
                },
                {
                    model: Bed,
                    required: true,
                    as: 'bed',
                    include: [
                        {
                            model: BedType,
                            as: 'bedType',
                        },
                        {
                            model: Floor,
                            as: 'floor',
                        },
                        {
                            model: Ward,
                            as: 'ward',
                        },
                        {
                            model: BedGroup,
                            as: 'bedGroup',
                        },
                        {
                            model: Blocks,
                            as: 'block',
                        },
                        // Removed Department model
                    ],
                },
            ],
            order: [['admission_id', 'DESC']],
        });

        // Now handle the department lookup from the Departments array
        const updatedList = getList.map(item => {
            // Convert item and nested bed to plain objects
            const plainItem = item.get({ plain: true });
            const bed = plainItem.bed;

            // Lookup department details from the provided array
            const departmentDetails = Departments.find(dep => dep.id === bed.bed_department_id) || {};

            // Add the department details to the bed object
            bed.department = departmentDetails;

            return plainItem;
        });

        return updatedList;
    } catch (error) {
        return error.message;
    }
};
const getIPDPatientListByStatus = async (data) => {
    try {
        // Build the where clause dynamically
        const whereClause = {
            ...(data.hospital_id && { hospital_id: data.hospital_id }),
            ...(data.unit_id && { unit_id: data.unit_id }),
            ...(data.case_id && { case_id: data.case_id }),
            ...(data.patient_id && { patient_mrn: data.patient_mrn }),
            ...(data.status && {
                status: Array.isArray(data.status)
                    ? { [Op.in]: data.status }
                    : data.status
            }),
            ...(!data.status && {
                status: { [Op.in]: ['Occupied', 'Bed Allocated', 'Transferred To OT', 'Bed Deallocated'] }
            })
        };

        const getList = await BedAllocation.findAll({
            where: whereClause,
            include: [
                {
                    model: IpdPatients,
                    required: true,
                    include: [
                        {
                            model: Patient,
                            as: 'patient'
                        }
                    ]
                },
                {
                    model: Bed,
                    required: true,
                    as: 'bed',
                    include: [
                        {
                            model: BedType,
                            as: 'bedType',
                        },
                        {
                            model: Floor,
                            as: 'floor',
                        },
                        {
                            model: Ward,
                            as: 'ward',
                        },
                        {
                            model: BedGroup,
                            as: 'bedGroup',
                        },
                        {
                            model: Blocks,
                            as: 'block',
                        },
                    ],
                },
            ],
            order: [['admission_id', 'DESC']],
        });

        // Handle department lookup from the Departments array
        const updatedList = getList.map(item => {
            const plainItem = item.get({ plain: true });
            const bed = plainItem.bed;

            // Lookup department details from the provided array
            const departmentDetails = Departments.find(dep => dep.id === bed.bed_department_id) || {};

            // Add the department details to the bed object
            bed.department = departmentDetails;

            return plainItem;
        });

        return updatedList;
    } catch (error) {
        return error.message;
    }
};

const bedTransfer = async (data) => {
    try {
        let admission_id = data.admission_id;
        let current_bed_id = data.current_bed_id;
        let upcoming_bed_id = data.upcoming_bed_id;
        let patient_mrn = data.patient_mrn;
        let doctor_id = data.doctor_id;
        let bedAllocation_update_data = {
            ...data.updateData,
            bed_id: upcoming_bed_id
        }
        let updatePatientData = {
            ...data.updateData,
            bed_id: upcoming_bed_id,
            doctor_id: doctor_id
        }
        let update = await BedAllocation.update(bedAllocation_update_data, { where: { admission_id: admission_id, patient_mrn: patient_mrn } });
        if (update > 0) {
            let updatePatient = await IpdPatients.update(updatePatientData, { where: { admission_id: admission_id, patient_mrn: patient_mrn } });
            let updateCurrentBed = await Bed.update({ is_available: true }, { where: { id: current_bed_id } })
            let updateUpcomingBed = await Bed.update({ is_available: false }, { where: { id: upcoming_bed_id } })
            if (updatePatient > 0) {
                return "Updated Successfully";
            } else {
                return "Failed To Update Data";
            }
        } else {
            return "Failed To Update Data";
        }
    } catch (error) {
        return error.message;
    }
}

const bedDeallocation = async (data) => {
    try {
        let admission_id = data.admission_id;
        let patient_mrn = data.patient_mrn;
        let bed_id = data.bed_id;
        let updateData = {
            ...data.updateData,
            status: 'Released'
        }
        let update = await BedAllocation.update(updateData, { where: { admission_id: admission_id, patient_mrn: patient_mrn } });
        if (update > 0) {
            let postData = {
                status: 'Discharged',
                ...data.updateData
            }
            let updatePatient = await IpdPatients.update(postData, { where: { admission_id: admission_id, patient_mrn: patient_mrn } });
            let updateBed = await Bed.update({ is_available: true }, { where: { id: bed_id } })
            if (updatePatient > 0) {
                return "Updated Successfully";
            } else {
                return "Failed To Update Data";
            }
        } else {
            return "Failed To Update Data";
        }
    } catch (error) {
        return error.message;
    }
}

const getPatientData = async (data) => {
    try {
        const whereClause = {
            ...(data.mobileNumber && { mobile_no: data.mobileNumber }),
            ...(data.email && { email: data.email })
        };
        let patient = await Patient.findAll({ where: whereClause });
        if (patient) {
            return patient;
        }
        return [];
    } catch (error) {
        return error.message;
    }
}

const getIPDPatientCaseId = async (data) => {
    try {
        const whereClause = {
            ...(data.patient_mrn && { patient_mrn: data.patient_mrn })
        };
        let patient = await BedAllocation.findAll({ where: whereClause });
        if (patient) {
            return patient;
        }
        return false;
    } catch (error) {
        return error.message;
    }
}

const updateAcknowledgePatient = async (req, callback) => {
    try {
        const { patient_mrn, case_id, acknowledged_status, acknowledged_nurse_id, acknowledged_nurse_name } = req.body;

        if (!patient_mrn || !case_id || !acknowledged_status || !acknowledged_nurse_id || !acknowledged_nurse_name) {
            return callback("Missing required fields", null);
        }

        const updatedPatient = await IPDPatient.update(
            {
                acknowledged_status: acknowledged_status,
                acknowledged_nurse_id: acknowledged_nurse_id,
                acknowledged_nurse_name: acknowledged_nurse_name,
                status: "Admitted"
            },
            { where: { patient_mrn: patient_mrn, case_id: case_id } }
        );

        let update = await BedAllocation.update({ status: "Occupied" }, { where: { case_id: case_id, patient_mrn: patient_mrn } });

        if (updatedPatient[0] === 0) {
            return callback("Patient not found or no update performed", null);
        }

        return callback(null, { patient_mrn, case_id, acknowledged_status, acknowledged_nurse_id, acknowledged_nurse_name });
    } catch (error) {
        return callback(error, null);
    }
};

const MonthlyAdmissions = async (req) => {
    try {
        const { year, status } = req.query;
        let whereCondition = {};

        if (year) {
            whereCondition = {
                ...whereCondition,
                [Op.and]: where(fn("YEAR", col("admission_date")), year),
            };
        }

        if (status) {
            whereCondition.status = status;
        }

        let getCount = await IpdPatients.findAll({
            attributes: [
                [fn("YEAR", col("admission_date")), "year"],
                [fn("MONTH", col("admission_date")), "month"],
                [fn("COUNT", "*"), "count"],
            ],
            where: whereCondition,
            group: ["year", "month"],
            raw: true,
            order: [[col("year"), "ASC"], [col("month"), "ASC"]],
        });

        const allMonths = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];

        let result = {};

        getCount.forEach(({ year }) => {
            if (!result[year]) {
                result[year] = { total: 0, months: {} };
                allMonths.forEach((month) => {
                    result[year].months[month] = 0;
                });
            }
        });

        getCount.forEach(({ year, month, count }) => {
            if (!result[year]) {
                result[year] = { total: 0, months: {} };
                allMonths.forEach((monthName) => {
                    result[year].months[monthName] = 0;
                });
            }
            result[year].months[allMonths[month - 1]] = count;
            result[year].total += count;
        });

        let formattedResult = Object.keys(result).map((year) => ({
            year: parseInt(year),
            total: result[year].total,
            months: result[year].months,
        }));

        return formattedResult;
    } catch (error) {
        console.log("error: ", error);
        return error;
    }
};

const AverageStayDuration = async (req) => {
    try {
        const { year } = req.query;
        let whereCondition = {};

        if (year) {
            whereCondition = {
                ...whereCondition,
                [Op.and]: where(fn("YEAR", col("admission_date")), year),
            };
        }

        let getAverageStay = await IpdPatients.findAll({
            attributes: [
                [fn("YEAR", col("admission_date")), "year"],
                [fn("MONTH", col("admission_date")), "month"],
                [
                    fn("AVG", literal("DATEDIFF(discharge_date, admission_date)")),
                    "average_days",
                ],
            ],
            where: {
                ...whereCondition,
                discharge_date: { [Op.ne]: null }, // Only discharged patients
            },
            group: ["year", "month"],
            raw: true,
            order: [[col("year"), "ASC"], [col("month"), "ASC"]],
        });

        const allMonths = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];

        let result = {};
        getAverageStay.forEach(({ year }) => {
            if (!result[year]) {
                result[year] = { total: 0, months: {} };
                allMonths.forEach((month) => {
                    result[year].months[month] = 0;
                });
            }
        });

        getAverageStay.forEach(({ year, month, average_days }) => {
            if (!result[year]) {
                result[year] = { total: 0, months: {} };
                allMonths.forEach((monthName) => {
                    result[year].months[monthName] = 0;
                });
            }
            result[year].months[allMonths[month - 1]] = parseFloat(average_days).toFixed(2);
            result[year].total += parseFloat(average_days);
        });

        let formattedResult = Object.keys(result).map((year) => ({
            year: parseInt(year),
            total: parseFloat(result[year].total.toFixed(2)),
            months: result[year].months,
        }));

        return formattedResult;
    } catch (error) {
        console.log("error: ", error);
        return error;
    }
};

const BedUtilization = async (req) => {
    try {
        const { year } = req.query;
        let whereCondition = {};

        if (year) {
            whereCondition = {
                ...whereCondition,
                [Op.and]: where(fn("YEAR", col("admission_date")), year),
            };
        }

        // Get total available beds
        const hospitalConfig = await Bed.count();
        const totalBeds = hospitalConfig

        if (!totalBeds) {
            return { error: "Total hospital beds not configured." };
        }

        // Get the sum of occupied bed days (Difference between admission & discharge)
        let getBedDaysUsed = await IpdPatients.findAll({
            attributes: [
                [fn("YEAR", col("admission_date")), "year"],
                [fn("MONTH", col("admission_date")), "month"],
                [
                    fn("SUM", literal("DATEDIFF(COALESCE(discharge_date, NOW()), admission_date)")),
                    "bed_days_used",
                ],
            ],
            where: whereCondition,
            group: ["year", "month"],
            raw: true,
            order: [[col("year"), "ASC"], [col("month"), "ASC"]],
        });

        const allMonths = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];

        let result = {};
        getBedDaysUsed.forEach(({ year }) => {
            if (!result[year]) {
                result[year] = { total: 0, months: {} };
                allMonths.forEach((month) => {
                    result[year].months[month] = 0;
                });
            }
        });

        getBedDaysUsed.forEach(({ year, month, bed_days_used }) => {
            if (!result[year]) {
                result[year] = { total: 0, months: {} };
                allMonths.forEach((monthName) => {
                    result[year].months[monthName] = 0;
                });
            }
            const daysInMonth = new Date(year, month, 0).getDate();
            const totalAvailableBedDays = totalBeds * daysInMonth;
            const utilization = ((bed_days_used / totalAvailableBedDays) * 100).toFixed(2);

            result[year].months[allMonths[month - 1]] = utilization;
            result[year].total += parseFloat(utilization);
        });

        let formattedResult = Object.keys(result).map((year) => ({
            year: parseInt(year),
            total: parseFloat(result[year].total.toFixed(2)),
            months: result[year].months,
        }));

        return formattedResult;
    } catch (error) {
        console.log("error: ", error);
        return error;
    }
};

const updateIpdPatientStatus = async (data) => {
    try {
        let admission_id = data.admission_id;
        let patient_mrn = data.patient_mrn;
        let bed_id = data.bed_id;
        let deallocate = data.deallocate;
        let updateData = {
            status: data.status,
            ...data
        }
        let update = await BedAllocation.update(updateData, { where: { admission_id: admission_id, patient_mrn: patient_mrn } });
        if (update > 0) {
            let postData = {
                status: data.status,
                ...data
            }
            let updatePatient = await IpdPatients.update(postData, { where: { admission_id: admission_id, patient_mrn: patient_mrn } });
            let updateBed = deallocate ? await Bed.update({ is_available: true }, { where: { id: bed_id } }) : null;
            if (updatePatient > 0) {
                return "Updated Successfully";
            } else {
                return "Failed To Update Data";
            }
        } else {
            return "Failed To Update Data";
        }
    } catch (error) {
        return error.message;
    }
};

/**
 * Get daily bed occupancy report from the earliest admission date to reportDate (inclusive)
 * @param {string|Date} [reportDate] - Optional. Default is today.
 * @returns {Promise<Array|Object>} - Array of daily ward-wise reports.
 */
const getDailyBedOccupancyReport = async (req) => {
    try {
        const reportDateInput = req.query.reportDate;
        const whereClause = {
            ...(req.query.hospital_id && { hospital_id: req.query.hospital_id }),
            ...(req.query.unit_id && { unit_id: req.query.unit_id }),
        };
        const endDate = moment.tz(reportDateInput || undefined, 'Asia/Kolkata').startOf('day');

        const earliestAllocation = await BedAllocation.findOne({
            where: whereClause,
            order: [['admission_date', 'ASC']],
            attributes: ['admission_date']
        });

        if (!earliestAllocation) {
            return [];
        }

        const startDate = moment.tz(earliestAllocation.admission_date, 'Asia/Kolkata').startOf('day');

        // Total beds in the hospital (not grouped by ward)
        const totalBedsCount = await Bed.count();

        const report = [];

        for (
            let currentDate = moment(startDate);
            currentDate.isSameOrBefore(endDate);
            currentDate.add(1, 'day')
        ) {
            const date = currentDate.clone(); // avoid mutation

            // Get count of occupied beds on this date
            const occupiedCount = await BedAllocation.count({
                where: {
                    admission_date: { [Op.lte]: date.toDate() },
                    [Op.or]: [
                        { discharge_date: null },
                        { discharge_date: { [Op.gte]: date.toDate() } }
                    ],
                    status: { [Op.not]: 'Released' },
                    ...whereClause
                }
            });

            const occupancyPercent = totalBedsCount === 0
                ? 0
                : (occupiedCount / totalBedsCount) * 100;

            report.push({
                total_beds: totalBedsCount,
                occupied_beds: occupiedCount,
                occupancy_rate_percent: occupancyPercent.toFixed(2),
                report_date: date.format('YYYY-MM-DD') // Asia/Kolkata local date
            });
        }

        return report;
    } catch (error) {
        console.error('Error generating daily occupancy report:', error);
        return [];
    }
};

/**
 * Get daily bed availability report from the earliest admission date to reportDate (inclusive)
 * @param {object} req - Express request object with optional query param `reportDate`
 * @returns {Promise<Array|Object>} - Array of daily availability reports
 */
const getDailyBedAvailabilityReport = async (req) => {
    try {
        const reportDateInput = req.query.reportDate;
        const endDate = moment.tz(reportDateInput || undefined, 'Asia/Kolkata').startOf('day');
        const whereClause = {
            ...(req.query.hospital_id && { hospital_id: req.query.hospital_id }),
            ...(req.query.unit_id && { unit_id: req.query.unit_id }),
        };
        // Get earliest admission_date in the DB
        const earliestAllocation = await BedAllocation.findOne({
            where: whereClause,
            order: [['admission_date', 'ASC']],
            attributes: ['admission_date']
        });

        if (!earliestAllocation) {
            return [];
        }

        const startDate = moment.tz(earliestAllocation.admission_date, 'Asia/Kolkata').startOf('day');

        // Get total number of beds (not grouped)
        const totalBedsCount = await Bed.count();

        const report = [];

        for (
            let currentDate = moment(startDate);
            currentDate.isSameOrBefore(endDate);
            currentDate.add(1, 'day')
        ) {
            const date = currentDate.toDate();

            const occupiedBeds = await BedAllocation.count({
                where: {
                    admission_date: { [Op.lte]: date },
                    [Op.or]: [
                        { discharge_date: null },
                        { discharge_date: { [Op.gte]: date } }
                    ],
                    status: { [Op.not]: 'Released' },
                    ...whereClause
                }
            });

            const availableBeds = totalBedsCount - occupiedBeds;
            const availabilityPercent = totalBedsCount === 0
                ? 0
                : (availableBeds / totalBedsCount) * 100;

            report.push({
                report_date: currentDate.format('YYYY-MM-DD'),
                total_beds: totalBedsCount,
                occupied_beds: occupiedBeds,
                available_beds: availableBeds,
                availability_rate_percent: availabilityPercent.toFixed(2)
            });
        }

        return report;
    } catch (error) {
        console.error('Error generating bed availability report:', error);
        return [];
    }
};

/**
 * Get daily ward-level bed utilization report from earliest admission date to reportDate (inclusive)
 * @param {string|Date} [reportDate] - Optional. Default is today.
 * @returns {Promise<Array>} - Array of daily ward-wise utilization entries
 */
const getDailyWardUtilizationReport = async (req) => {
    try {
        const reportDateInput = req.query.reportDate;
        const endDate = moment.tz(reportDateInput || undefined, 'Asia/Kolkata').startOf('day');
        const whereClause = {
            ...(req.query.hospital_id && { hospital_id: req.query.hospital_id }),
            ...(req.query.unit_id && { unit_id: req.query.unit_id }),
        };
        const earliestAllocation = await BedAllocation.findOne({
            where: whereClause,
            order: [['admission_date', 'ASC']],
            attributes: ['admission_date']
        });

        if (!earliestAllocation) {
            return { error: 'No bed allocation data available.' };
        }

        const startDate = moment.tz(earliestAllocation.admission_date, 'Asia/Kolkata').startOf('day');

        const wards = await Ward.findAll({
            attributes: ['id', 'name']
        });

        const allBeds = await Bed.findAll({
            attributes: ['id', 'ward_id']
        });

        // Group beds by ward
        const bedsByWard = {};
        for (const bed of allBeds) {
            if (!bedsByWard[bed.ward_id]) {
                bedsByWard[bed.ward_id] = [];
            }
            bedsByWard[bed.ward_id].push(bed.id);
        }

        // Fetch all allocations overlapping with the date range
        const allAllocations = await BedAllocation.findAll({
            where: {
                admission_date: { [Op.lte]: endDate.toDate() },
                [Op.or]: [
                    { discharge_date: null },
                    { discharge_date: { [Op.gte]: startDate.toDate() } }
                ],
                status: { [Op.not]: 'Released' },
                ...whereClause
            },
            attributes: ['bed_id', 'admission_date', 'discharge_date']
        });

        const report = [];

        for (
            let currentDate = moment(startDate);
            currentDate.isSameOrBefore(endDate);
            currentDate.add(1, 'day')
        ) {
            const dateStr = currentDate.format('YYYY-MM-DD');

            for (const ward of wards) {
                const bedIds = bedsByWard[ward.id] || [];
                const totalBeds = bedIds.length;
                if (totalBeds === 0) continue;

                // Filter allocations for beds in this ward and valid for this date
                const occupiedBeds = allAllocations.filter(allocation => {
                    const admission = moment.tz(allocation.admission_date, 'Asia/Kolkata').startOf('day');
                    const discharge = allocation.discharge_date
                        ? moment.tz(allocation.discharge_date, 'Asia/Kolkata').startOf('day')
                        : null;

                    return bedIds.includes(allocation.bed_id) &&
                        admission.isSameOrBefore(currentDate) &&
                        (!discharge || discharge.isSameOrAfter(currentDate));
                }).length;

                const occupancyRate = (occupiedBeds / totalBeds) * 100;

                report.push({
                    ward_name: ward.name,
                    report_date: dateStr,
                    total_beds: totalBeds,
                    occupied_beds: occupiedBeds,
                    occupancy_rate_percent: occupancyRate.toFixed(2)
                });
            }
        }

        return report;
    } catch (error) {
        console.error('Error generating ward utilization report:', error);
        return [];
    }
};

/**
 * Get average length of stay (in days) for all discharged patients up to a report date (inclusive).
 * @param {Object} req - Request object containing optional reportDate in query.
 * @returns {Promise<Object>} - Object containing average length of stay.
 */
const getAverageLengthOfStayReport = async (req) => {
    try {
        const reportDateInput = req.query.reportDate;
        const reportDate = moment.tz(reportDateInput || undefined, 'Asia/Kolkata').endOf('day');
        const whereClause = {
            ...(req.query.hospital_id && { hospital_id: req.query.hospital_id }),
            ...(req.query.unit_id && { unit_id: req.query.unit_id }),
        };
        // Find earliest admission date
        const earliestAllocation = await BedAllocation.findOne({
            where: whereClause,
            order: [['admission_date', 'ASC']],
            attributes: ['admission_date'],
            raw: true,
        });

        if (!earliestAllocation) {
            return [];
        }

        const startDate = moment.tz(earliestAllocation.admission_date, 'Asia/Kolkata').startOf('day');

        const dailyReports = [];

        for (
            let currentDate = moment(startDate);
            currentDate.isSameOrBefore(reportDate);
            currentDate.add(1, 'day')
        ) {
            const dayEnd = currentDate.clone().endOf('day').toDate();

            // Fetch discharged patients up to currentDate
            const dischargedAllocations = await BedAllocation.findAll({
                where: {
                    admission_date: { [Op.lte]: dayEnd },
                    discharge_date: {
                        [Op.and]: {
                            [Op.lte]: dayEnd,
                            [Op.ne]: null,
                        }
                    },
                    ...whereClause
                },
                attributes: ['admission_date', 'discharge_date'],
                raw: true
            });

            if (dischargedAllocations.length === 0) {
                dailyReports.push({
                    report_date: currentDate.format('YYYY-MM-DD'),
                    totalPatientsDischarged: 0,
                    averageLengthOfStayDays: null
                });
                continue;
            }

            const totalStayDays = dischargedAllocations.reduce((total, alloc) => {
                const admissionDate = moment.tz(alloc.admission_date, 'Asia/Kolkata');
                const dischargeDate = moment.tz(alloc.discharge_date, 'Asia/Kolkata');
                const diffDays = dischargeDate.diff(admissionDate, 'days', true); // fractional days
                return total + diffDays;
            }, 0);

            const averageLengthOfStay = totalStayDays / dischargedAllocations.length;

            dailyReports.push({
                report_date: currentDate.format('YYYY-MM-DD'),
                totalPatientsDischarged: dischargedAllocations.length,
                averageLengthOfStayDays: averageLengthOfStay.toFixed(2),
            });
        }

        return dailyReports;

    } catch (error) {
        console.error('Error generating daily Average Length of Stay report:', error);
        return { error: error.message };
    }
};

/**
 * Get daily Admission vs Discharge report from earliest admission date to reportDate (inclusive)
 * @param {Object} req - Request object with optional reportDate in query params
 * @returns {Promise<Array>} - Array of daily admission vs discharge counts
 */
const getAdmissionVsDischargeReport = async (req) => {
    try {
        const reportDateInput = req.query.reportDate;
        const reportDate = moment.tz(reportDateInput || undefined, 'Asia/Kolkata').endOf('day');
        const whereClause = {
            ...(req.query.hospital_id && { hospital_id: req.query.hospital_id }),
            ...(req.query.unit_id && { unit_id: req.query.unit_id }),
        };
        // Get earliest admission date to start report from
        const earliestAllocation = await BedAllocation.findOne({
            where: whereClause,
            order: [['admission_date', 'ASC']],
            attributes: ['admission_date'],
            raw: true
        });

        if (!earliestAllocation) {
            return [];
        }

        const startDate = moment.tz(earliestAllocation.admission_date, 'Asia/Kolkata').startOf('day');

        const dailyReport = [];

        for (
            let currentDate = moment(startDate);
            currentDate.isSameOrBefore(reportDate);
            currentDate.add(1, 'day')
        ) {
            const dayStart = currentDate.clone().startOf('day').toDate();
            const dayEnd = currentDate.clone().endOf('day').toDate();

            // Count admissions on currentDate
            const totalAdmissions = await BedAllocation.count({
                where: {
                    admission_date: {
                        [Op.gte]: dayStart,
                        [Op.lte]: dayEnd,
                    },
                    ...whereClause
                }
            });

            // Count discharges on currentDate
            const totalDischarges = await BedAllocation.count({
                where: {
                    discharge_date: {
                        [Op.gte]: dayStart,
                        [Op.lte]: dayEnd,
                        [Op.ne]: null,
                    },
                    ...whereClause
                }
            });

            dailyReport.push({
                report_date: currentDate.format('YYYY-MM-DD'),
                totalAdmissions,
                totalDischarges
            });
        }

        return dailyReport;

    } catch (error) {
        console.error('Error generating Admission vs Discharge report:', error);
        return [];
    }
};

module.exports = {
    bedAllocation,
    getIPDPatientList,
    bedTransfer,
    bedDeallocation,
    getPatientData,
    getIPDPatientCaseId,
    getIPDPatientListByStatus,
    updateAcknowledgePatient,
    MonthlyAdmissions,
    AverageStayDuration,
    BedUtilization,
    updateIpdPatientStatus,
    getDailyBedOccupancyReport,
    getDailyBedAvailabilityReport,
    getDailyWardUtilizationReport,
    getAverageLengthOfStayReport,
    getAdmissionVsDischargeReport
};
