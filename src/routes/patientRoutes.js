const express = require('express');
const patientController = require('../controllers/patientController');
const abhaController = require('../controllers/abhaController');
const router = express.Router();
const { 
    validatePatient,
    validateEditPatient
} = require('../middlewares/validation');

router.post('/add/patient', validatePatient, patientController.createPatient);
router.get('/Patients', patientController.Patients);
router.put('/patients/:id', validateEditPatient, patientController.editPatient);
router.put('/editobgpatients/:id', patientController.editObgPatient);
router.get('/patients/search', patientController.searchPatients);
router.get('/patients/:patientId', patientController.getPatient);
router.post('/patients/transferPatToOT', patientController.transferPatToOT);
router.post('/pincodeAddress', patientController.pincodeAddress);
router.get('/fetchPatients', patientController.fetchPatients);
router.put('/updateMRN', patientController.updateMRN);
router.get('/patient/registeredpatients', patientController.NewRegisteredPatients);
router.post('/patient/patientByMobileNumber', patientController.patientByMobileNumber);
router.post('/patient/generateToken', patientController.generateToken);

router.get('/getBabyDetail', patientController.getBabyDetail);
router.put('/updateMobileNumber', patientController.updateMobileNumber);
router.post('/encrypt', abhaController.ecrypt);
router.post('/getAccessToken', abhaController.getAccessToken);
router.post('/abhaOtp', abhaController.abhaOtp);
router.post('/abhaVerifyOtp', abhaController.abhaVerifyOtp);
router.post('/abhaProfile', abhaController.abhaProfile);
router.post('/abhaEnrollmentOtp', abhaController.abhaEnrollmentOtp);
router.post('/createABHA', abhaController.createABHA);
router.post('/abhaQrCode', abhaController.abhaQrCode);
router.post('/abhaPhrQrCode', abhaController.abhaPhrQrCode);

module.exports = router;