const sequelize = require('../../config/database');
const Patient = require('../models/Patient');
const EmergencyContact = require('../models/EmergencyContact');
const Insurance = require('../models/Insurance');
const { Op, fn, col, where } = require('sequelize');
const jwt = require('jsonwebtoken');
const { fetchCharges, createBill, transferPatientToOT, pincode } = require('../utils/utils');
const IpdPatients = require('../models/IPDPatient');



const BabyDetail = require('../models/BabyDetail');

const createPatientWithRelations = async (patientData, emergencyContacts, insuranceDetails) => {
  return await sequelize.transaction(async (transaction) => {
    // Create the patient
    const patient = await Patient.create(patientData, { transaction });
    // if (patient) {
    //   const feeStatus = patientData.registration_fee_status;
    //   if (feeStatus == "Paid") {
    //     fetchCharges('IPD', 'Registration').then(fetch => {
    //       let postdata = {
    //         "patient_id": patient.dataValues.mrn,
    //         "department_name": "IPD-Admission",
    //         "case_id": "CASE0",
    //         "source": 'IPD-Admission',
    //         "status": "Final billing",
    //         "ipdbillings": [
    //           {
    //             "charge_code": fetch.charge_code,
    //             "charge_category": fetch.charge_category,
    //             "charge_type": fetch.charge_type,
    //             "service_code": "IPD-REG",
    //             "service_name": "IPD Registration",
    //             "service_category": "IPD REG",
    //             "procedure_code": "PC001",
    //             "procedure_name": "Procedure A",
    //             "qty": 1,
    //             "unit": fetch.unit,
    //             "standard_charges": fetch.standard_charges,
    //             "status": "completed"
    //           }
    //         ]
    //       }
    //       createBill(postdata).then(async bill => {
    //         console.log('bill: ', bill);
    //         let update = await Patient.update(
    //           { registration_fee_status: 'Paid' },
    //           { where: { mrn: patient.dataValues.mrn }, transaction }
    //         );
    //       }).catch(err => {
    //         console.error('Failed to create bill: ', err.message);
    //       });
    //     }).catch(err => {
    //       console.error('Failed to create bill: ', err.message);
    //     })
    //   } else if (feeStatus == "Un Paid") {
    //     let update = await Patient.update(
    //       { registration_fee_status: 'Un Paid' },
    //       { where: { mrn: patient.dataValues.mrn }, transaction }
    //     );
    //   }
    // }

    // Associate emergency contacts with the patient
    if (emergencyContacts?.length) {
      for (let contact of emergencyContacts) {
        contact.patient_id = patient.id; // Set the foreign key
      }
      await EmergencyContact.bulkCreate(emergencyContacts, { transaction });
    }

    // Associate insurance details with the patient
    if (insuranceDetails?.length) {
      for (let insurance of insuranceDetails) {
        insurance.patient_id = patient.id; // Set the foreign key
      }
      await Insurance.bulkCreate(insuranceDetails, { transaction });
    }

    return patient;
  });
};

const findLatestPatient = async () => {
  return await Patient.findOne({
    order: [['id', 'DESC']], // or [['createdAt', 'DESC']] if you prefer
  });
};

const updatePatientById = async (patientId, patientData, emergencyContacts, insuranceDetails) => {
  return await sequelize.transaction(async (transaction) => {
    // Update the patient information
    const patient = await Patient.findByPk(patientId, { transaction });

    if (!patient) {
      throw new Error('Patient not found');
    }

    await patient.update(patientData, { transaction });

    // Update or add emergency contacts
    if (emergencyContacts?.length) {
      for (let contact of emergencyContacts) {
        if (contact.id) {
          // Update existing contact by ID
          const existingContact = await EmergencyContact.findOne({
            where: {
              id: contact.id,
              patient_id: patientId // Security: ensure contact belongs to patient
            },
            transaction
          });

          if (existingContact) {
            await existingContact.update(contact, { transaction });
          }
        } else {
          // Create new contact (no ID provided)
          contact.patient_id = patientId; // Set the foreign key
          await EmergencyContact.create(contact, { transaction });
        }
      }
    }

    // Update or add insurance details
    if (insuranceDetails?.length) {
      for (let insurance of insuranceDetails) {
        const existingInsurance = await Insurance.findOne({
          where: {
            patient_id: patientId,
            policy_no: insurance.policy_no,
          },
          transaction
        });

        if (existingInsurance) {
          await existingInsurance.update(insurance, { transaction });
        } else {
          insurance.patient_id = patientId; // Set the foreign key
          await Insurance.create(insurance, { transaction });
        }
      }
    }

    return patient;
  });
};






const updateObgPatientById = async (patientId, patientData, babyDetails) => {
  return await sequelize.transaction(async (transaction) => {
    const patient = await Patient.findByPk(patientId, { transaction });

    if (!patient) {
      throw new Error('Patient not found');
    }

    await patient.update(patientData, { transaction });

    // Baby Details
    if (Array.isArray(babyDetails) && babyDetails.length) {
      // 1. Get latest baby MRN from DB
      const latestBaby = await BabyDetail.findOne({
        order: [['createdAt', 'DESC']],
        attributes: ['baby_mrn'],
        transaction,
      });

      // 2. Determine base MRN number
      let latestNumber = 0;

      if (latestBaby && latestBaby.baby_mrn) {
        const match = latestBaby.baby_mrn.match(/\d+$/); // Extract trailing number
        latestNumber = match ? parseInt(match[0], 10) : 0;
      }

      // 3. Generate new baby MRNs and create records
      for (let i = 0; i < babyDetails.length; i++) {
        const baby = babyDetails[i];
        const nextNumber = latestNumber + i + 1;
        const baby_mrn = `BABYMRN${String(nextNumber).padStart(4, '0')}`;

        await BabyDetail.create({
          patient_mrn: patient.mrn,
          baby_mrn,
          baby_age: baby.baby_age,
          gender: baby.gender,
          dob: baby.dob,
        }, { transaction });
      }
    }

    return patient;
  });
};

const searchPatients = async (searchParams) => {
  return await patientRepository.findPatients(searchParams);
};

const findPatients = async (searchParams) => {
  const { mrn, full_name, hospital_id, unit_id } = searchParams;

  const whereClause = {};
  if (mrn) whereClause.mrn = mrn;
  if (full_name) whereClause.full_name = { [Op.like]: `%${full_name}%` };
  if (hospital_id) whereClause.hospital_id = hospital_id;
  if (unit_id) whereClause.unit_id = unit_id;

  return await Patient.findAll({
    where: whereClause, include: [
      {
        model: EmergencyContact,
        as: 'emergency_contacts',
      },
    ],
  });
};

const Patients = async (page = 1, limit = 10, whereClause) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Patient.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
  });

  return {
    totalRecords: count,
    totalPages: Math.ceil(count / limit),
    patients: rows,
  };
};


const findPatient = async (patientId) => {
  const patient = await Patient.findByPk(patientId, {
    include: [
      {
        model: EmergencyContact,
        as: 'emergency_contacts',
      },
      {
        model: Insurance,
        as: 'insurance',
      },
    ],
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  const ipdPatient = await IpdPatients.findOne({
    where: { patient_mrn: patient.mrn },
    attributes: ['case_id'],
    order: [['createdAt', 'DESC']],
  });

  return {
    ...patient.toJSON(),
    case_id: ipdPatient ? ipdPatient.case_id : null,
  };
};

const transferPatToOT = async (req) => {
  return await transferPatientToOT(req.body);
};

const pincodeAddress = async (req) => {
  return await pincode(req.body);
};

const fetchPatients = async (req) => {
  const patients = await Patient.findAll()
  return patients;
};

const getLatestMRNByType = async (prefix) => {
  const fieldToCheck = prefix === 'TEMP' ? 'temp_mrn' : 'mrn'; // Determine the field to search by
  let pat = await Patient.findOne({ where: { temp_mrn: { [Op.ne]: null } }, order: [['temp_mrn', 'DESC']] });
  console.log('pat: ', pat);
  return await Patient.findOne({
    where: { [fieldToCheck]: { [Op.like]: `${prefix}%` } }, // Match only records with the specified prefix
    order: [[fieldToCheck, 'DESC']], // Sort by the respective field
  }).then((patient) => (patient ? patient[fieldToCheck] : null));
};

const updateMRN = async (mrn, patientData) => {
  let update = await Patient.update(patientData, { where: { mrn, mrn } });
  if (update[0] > 0) {
    let get = await Patient.findOne({ where: { mrn: patientData.mrn } });
    return get;
  } else {
    return "Failed To Update";
  }
}

const NewRegisteredPatients = async (req) => {
  try {
    const { year } = req.query;
    let whereCondition = {};
    if (year) {
      whereCondition = {
        ...whereCondition,
        [Op.and]: where(fn("YEAR", col("createdAt")), year),
      };
    }
    let getCount = await Patient.findAll({
      attributes: [
        [fn("YEAR", col("createdAt")), "year"],
        [fn("MONTH", col("createdAt")), "month"],
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
    console.log('error: ', error);
    return error;
  }
};

const patientByMobileNumber = async (req) => {
  try {
    const { mobileNo } = req.body;
    let isPatient = await Patient.findOne({ where: { mobile_no: mobileNo } });
    if (isPatient) {
      return isPatient;
    } else {
      return null;
    }
  } catch (error) {
    console.log('error: ', error);
    return error;
  }
};

const generateToken = async (req) => {
  try {
    const { mobileNo } = req.body;
    const staff = await Patient.findOne({ where: { mobile_no: mobileNo } });
    if (!staff) {
      return null;
    }
    const token = jwt.sign(
      {
        id: staff.id,
        email: staff.email,
        role_ids: [],
        type: 'patient'
      },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    return { data: staff, token };
  } catch (error) {
    console.log('error: ', error);
    return error;
  }
}





const getBabyDetail = async (patient_mrn) => {
  const babydetail = await BabyDetail.findAll({where: {
    patient_mrn : patient_mrn
}
  });

 
  return babydetail;
};

const updateMobileNumber = async (req) => {
  try {
    const { mobile_no: oldMobileNo, new_mobile_no: newMobileNo, mrns } = req.body;

    // Validate input
    if (!oldMobileNo || !newMobileNo || !Array.isArray(mrns) || mrns.length === 0) {
      return 'Invalid request data';
    }

    // Count existing users with new mobile number
    const existingWithNewMobile = await Patient.count({ where: { mobile_no: newMobileNo } });

    if (existingWithNewMobile >= 6) {
      return 'New mobile number already has 6 users';
    }

    // Count how many MRNs are valid and currently using the old mobile number
    const patientsToUpdate = await Patient.findAll({
      where: {
        mrn: mrns,
        mobile_no: oldMobileNo,
      },
    });

    if (patientsToUpdate.length === 0) {
      return 'No patients found with provided MRNs and old mobile number';
    }

    // Check if updating them will exceed the limit
    const totalAfterUpdate = existingWithNewMobile + patientsToUpdate.length;
    if (totalAfterUpdate > 6) {
      return `Updating would exceed 6 users for mobile number ${newMobileNo}`;
    }

    // Perform update
    await Patient.update(
      { mobile_no: newMobileNo },
      {
        where: {
          mrn: mrns,
          mobile_no: oldMobileNo,
        },
      }
    );

    return 'Mobile number updated successfully';

  } catch (error) {
    console.error('Error updating mobile number:', error);
    return error;
  }
};

module.exports = {
  createPatientWithRelations,
  findPatient,
  Patients,
  findLatestPatient,
  updatePatientById,
  searchPatients,
  findPatients,
  transferPatToOT,
  fetchPatients,
  getLatestMRNByType,
  updateMRN,
  pincodeAddress,
  NewRegisteredPatients,
  patientByMobileNumber,
  generateToken,
  updateObgPatientById,
  getBabyDetail,
  updateMobileNumber
};
