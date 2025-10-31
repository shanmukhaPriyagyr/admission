const bedAllocationRepository = require("../repositories/bedAllocationRepository");

const getIPDPatientList = async (data) => {
    return await bedAllocationRepository.getIPDPatientList(data);
};


const getIPDPatientListByStatus = async (data) => {
    return await bedAllocationRepository.getIPDPatientListByStatus(data);
};
const bedAllocation = async (data) => {
    return await bedAllocationRepository.bedAllocation(data);
};

const bedDeallocation = async (data) => {
    return await bedAllocationRepository.bedDeallocation(data);
};

const bedTransfer = async (data) => {
    return await bedAllocationRepository.bedTransfer(data);
};

const getPatientData = async (data) => {
    return await bedAllocationRepository.getPatientData(data);
};

const getIPDPatientCaseId = async (data) => {
    return await bedAllocationRepository.getIPDPatientCaseId(data);
};

const updateAcknowledgePatient = (req, callback) => {
    bedAllocationRepository.updateAcknowledgePatient(req, (err, result) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result);
        }
    });
};

const MonthlyAdmissions = async (req) => {
    return await bedAllocationRepository.MonthlyAdmissions(req);
};

const AverageStayDuration = async (req) => {
    return await bedAllocationRepository.AverageStayDuration(req);
};

const BedUtilization = async (req) => {
    return await bedAllocationRepository.BedUtilization(req);
};

const updateIpdPatientStatus = async (data) => {
    return await bedAllocationRepository.updateIpdPatientStatus(data);
};

const getDailyBedOccupancyReport = async (req) => {
    return await bedAllocationRepository.getDailyBedOccupancyReport(req);
};

const getDailyBedAvailabilityReport = async (req) => {
    return await bedAllocationRepository.getDailyBedAvailabilityReport(req);
};

const getDailyWardUtilizationReport = async (req) => {
    return await bedAllocationRepository.getDailyWardUtilizationReport(req);
};

const getAverageLengthOfStayReport = async (req) => {
    return await bedAllocationRepository.getAverageLengthOfStayReport(req);
};

const getAdmissionVsDischargeReport = async (req) => {
    return await bedAllocationRepository.getAdmissionVsDischargeReport(req);
};

module.exports = { getIPDPatientList, bedAllocation, bedDeallocation, bedTransfer, getPatientData, getIPDPatientCaseId, getIPDPatientListByStatus, updateAcknowledgePatient, MonthlyAdmissions, AverageStayDuration, BedUtilization, updateIpdPatientStatus, getDailyBedOccupancyReport, getDailyBedAvailabilityReport, getDailyWardUtilizationReport, getAverageLengthOfStayReport, getAdmissionVsDischargeReport };
