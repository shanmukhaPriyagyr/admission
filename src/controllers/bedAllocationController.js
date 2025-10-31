const bedAllocationService = require('../services/bedAllocationService');

const getIPDPatientList = async (req, res, next) => {
    try {
        const data = await bedAllocationService.getIPDPatientList(req.query);
        res.json({ status: data.length > 0 ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

const getIPDPatientListByStatus = async (req, res, next) => {
    try {
        const data = await bedAllocationService.getIPDPatientListByStatus(req.query);
        res.json({ status: data.length > 0 ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};
const bedAllocation = async (req, res, next) => {
    try {
        const data = await bedAllocationService.bedAllocation(req.body);
        res.json({ status: data == "Bed allocation and patient admission created successfully" ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

const bedDeallocation = async (req, res, next) => {
    try {
        const data = await bedAllocationService.bedDeallocation(req.body);
        res.json({ status: data == "Updated Successfully" ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

const bedTransfer = async (req, res, next) => {
    try {
        const data = await bedAllocationService.bedTransfer(req.body);
        res.json({ status: data == "Updated Successfully" ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

const getPatientData = async (req, res, next) => {
    try {
        const data = await bedAllocationService.getPatientData(req.query);
        res.json({ status: data == true ? false : true, data: data });
    } catch (error) {
        next(error);
    }
};

const getIPDPatientCaseId = async (req, res, next) => {
    try {
        const data = await bedAllocationService.getIPDPatientCaseId(req.query);
        res.json({ status: data.length > 0 ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};


const updateAcknowledgePatient = async (req, res) => {
    try {
        bedAllocationService.updateAcknowledgePatient(req, (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: "Patient acknowledgment updated successfully",
                data: result
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const MonthlyAdmissions = async (req, res, next) => {
    try {
        const data = await bedAllocationService.MonthlyAdmissions(req);
        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
};

const AverageStayDuration = async (req, res, next) => {
    try {
        const data = await bedAllocationService.AverageStayDuration(req);
        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
};

const BedUtilization = async (req, res, next) => {
    try {
        const data = await bedAllocationService.BedUtilization(req);
        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
};


const updateIpdPatientStatus = async (req, res, next) => {
    try {
        const data = await bedAllocationService.updateIpdPatientStatus(req.body);
        res.json({ status: data == "Updated Successfully" ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

const getDailyBedOccupancyReport = async (req, res, next) => {
    try {
        const data = await bedAllocationService.getDailyBedOccupancyReport(req);
        res.json({ status: data.length > 0 ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

const getDailyBedAvailabilityReport = async (req, res, next) => {
    try {
        const data = await bedAllocationService.getDailyBedAvailabilityReport(req);
        res.json({ status: data.length > 0 ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

const getDailyWardUtilizationReport = async (req, res, next) => {
    try {
        const data = await bedAllocationService.getDailyWardUtilizationReport(req);
        res.json({ status: data.length > 0 ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

const getAverageLengthOfStayReport = async (req, res, next) => {
    try {
        const data = await bedAllocationService.getAverageLengthOfStayReport(req);
        res.json({ status: data.length > 0 ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

const getAdmissionVsDischargeReport = async (req, res, next) => {
    try {
        const data = await bedAllocationService.getAdmissionVsDischargeReport(req);
        res.json({ status: data.length > 0 ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};

module.exports = { getIPDPatientList, bedAllocation, bedDeallocation, bedTransfer, getPatientData, getIPDPatientCaseId, getIPDPatientListByStatus, updateAcknowledgePatient, MonthlyAdmissions, AverageStayDuration, BedUtilization, updateIpdPatientStatus, getDailyBedOccupancyReport, getDailyBedAvailabilityReport, getDailyWardUtilizationReport, getAverageLengthOfStayReport, getAdmissionVsDischargeReport };