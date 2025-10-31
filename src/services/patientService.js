// src/services/patientService.js
const patientRepository = require('../repositories/patientRepository');

const createPatient = async (patientData, emergencyContacts, insuranceDetails) => {
    // Pass the patient data, emergency contacts, and insurance details to the repository
    return await patientRepository.createPatientWithRelations(patientData, emergencyContacts, insuranceDetails);
};

const getLatestPatient = async () => {
    return await patientRepository.findLatestPatient();
};

const Patients = async (page = 1, limit = 10, whereClause) => {
    return await patientRepository.Patients(page, limit, whereClause);
};

const editPatient = async (id, patientData, emergencyContacts, insuranceDetails) => {
    return await patientRepository.updatePatientById(id, patientData, emergencyContacts, insuranceDetails);
};
const editObgPatient = async (id, updateData) => {
    const { babyDetails, ...patientData } = updateData;
    return await patientRepository.updateObgPatientById(id, patientData, babyDetails);
};

const searchPatients = async (searchParams) => {
    return await patientRepository.findPatients(searchParams);
};

const getPatient = async (patientId) => {
    return await patientRepository.findPatient(patientId);
};

const transferPatToOT = async (req) => {
    return await patientRepository.transferPatToOT(req);
};

const pincodeAddress = async (req) => {
    return await patientRepository.pincodeAddress(req);
};

const fetchPatients = async (req) => {
    return await patientRepository.fetchPatients(req);
};

const getLatestMRNByType = async (prefix) => {
    return await patientRepository.getLatestMRNByType(prefix);
};

const updateMRN = async (mrn, patientData) => {
    return await patientRepository.updateMRN(mrn, patientData);
};

const NewRegisteredPatients = async (req) => {
    return await patientRepository.NewRegisteredPatients(req);
};

const patientByMobileNumber = async (req) => {
    return await patientRepository.patientByMobileNumber(req);
};

const generateToken = async (req) => {
    return await patientRepository.generateToken(req);
};

const getBabyDetail = async (patient_mrn) => {
    return await patientRepository.getBabyDetail(patient_mrn);
};

const updateMobileNumber = async (req) => {
    return await patientRepository.updateMobileNumber(req);
};

module.exports = {
    createPatient,
    Patients,
    getPatient,
    getLatestPatient,
    editPatient,
    searchPatients,
    transferPatToOT,
    fetchPatients,
    getLatestMRNByType,
    updateMRN,
    pincodeAddress,
    NewRegisteredPatients,
    patientByMobileNumber,
    generateToken,
    editObgPatient,
    getBabyDetail,
    updateMobileNumber
};

