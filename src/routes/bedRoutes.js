const express = require('express');

// Import individual controllers for each group
const bedTypeController = require('../controllers/bedTypeController');
const floorController = require('../controllers/floorController');
const wardController = require('../controllers/wardController');
const bedGroupController = require('../controllers/bedGroupController');
const bedController = require('../controllers/bedController');
const bedAllocationController = require('../controllers/bedAllocationController');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

// Routes for Bed Types
router.post('/bed-types', bedTypeController.createBedType);
router.get('/bed-types', bedTypeController.getBedTypes);
router.put('/bed-types/:id', bedTypeController.updateBedType);
router.delete('/bed-types/:id', bedTypeController.deleteBedType);

// Routes for Floors
router.post('/floors', floorController.createFloor);
router.get('/floors', floorController.getFloors);
router.put('/floors/:id', floorController.updateFloor);
router.delete('/floors/:id', floorController.deleteFloor);

// Routes for Wards
router.post('/wards', wardController.createWard);
router.get('/wards', wardController.getWards);
router.put('/wards/:id', wardController.updateWard);
router.delete('/wards/:id', wardController.deleteWard);

// Routes for Bed Groups
router.post('/bed-groups', bedGroupController.createBedGroup);
router.get('/bed-groups', bedGroupController.getBedGroups);
router.put('/bed-groups/:id', bedGroupController.updateBedGroup);
router.delete('/bed-groups/:id', bedGroupController.deleteBedGroup);

// Routes for Beds
router.post('/beds', bedController.createBed);
router.get('/beds', bedController.getBeds);
router.get('/getAvailableBedsCount', bedController.getAvailableBedsCount);
router.get('/getBedsByGroup', bedController.getBedsByGroup);
router.put('/beds/:id', bedController.updateBed);
router.put('/updateBedStatus', bedController.updateBedStatus);
router.delete('/beds/:id', bedController.deleteBed);
router.get('/getEmergencyBeds', bedController.getEmergencyBeds);

//Routes for Bed Allocation
router.get('/getIPDPatientlist', bedAllocationController.getIPDPatientList);
router.get('/getIPDPatientlistByStatus', bedAllocationController.getIPDPatientListByStatus);
router.post('/bedAllocation', bedAllocationController.bedAllocation);
router.post('/bedDeallocation', bedAllocationController.bedDeallocation);
router.post('/bedTransfer', bedAllocationController.bedTransfer);
router.get('/getPatientData', bedAllocationController.getPatientData);
router.get('/getIPDPatientCaseId', bedAllocationController.getIPDPatientCaseId);
router.post('/updateIpdPatientStatus', bedAllocationController.updateIpdPatientStatus);

//Routes for Departments
router.get('/getDepartments', departmentController.getDepartments);

router.put('/updateAcknowledgePatient', bedAllocationController.updateAcknowledgePatient);
router.get('/admission', bedAllocationController.MonthlyAdmissions);
router.get('/averageStayDuration', bedAllocationController.AverageStayDuration);
router.get('/bedUtilization', bedAllocationController.BedUtilization);
router.get('/getDailyBedOccupancyReport', bedAllocationController.getDailyBedOccupancyReport);
router.get('/getDailyBedAvailabilityReport', bedAllocationController.getDailyBedAvailabilityReport);
router.get('/getDailyWardUtilizationReport', bedAllocationController.getDailyWardUtilizationReport);
router.get('/getAverageLengthOfStayReport', bedAllocationController.getAverageLengthOfStayReport);
router.get('/getAdmissionVsDischargeReport', bedAllocationController.getAdmissionVsDischargeReport);







module.exports = router;