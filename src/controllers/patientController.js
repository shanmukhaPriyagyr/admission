const patientService = require('../services/patientService');

const createPatient = async (req, res, next) => {
  try {
    const { emergency_contacts, insurance_details, type, ...patientData } = req.body;

    // Fetch the latest MRN of the given type (TEMP or MRN)
    const prefix = type === 'temp' ? 'TEMP' : 'MRN';
    const latestMRN = await patientService.getLatestMRNByType(prefix);
    
    // Generate the next MRN
    const nextMRN = generateMRN(latestMRN, prefix);

    // Assign the generated MRN to the patient data
    patientData.mrn = nextMRN;
    patientData.temp_mrn = type == 'temp' ? nextMRN : null

    // Call the service layer to create the patient with related data
    const patient = await patientService.createPatient(patientData, emergency_contacts, insurance_details);
    res.status(201).json({ message: 'Patient created successfully', data: patient });
  } catch (error) {
    next(error);
  }
};
// Function to generate the next MRN based on the latest MRN
const generateMRN = (latestMRN, prefix) => {
  const startNumber = 1;

  // If no MRN exists yet, start with the initial MRN
  if (!latestMRN) {
    return `${prefix}${String(startNumber).padStart(6, '0')}`;
  }

  // Extract the numeric part from the latest MRN and increment it
  const latestNumber = parseInt(latestMRN.replace(prefix, ''), 10); // Remove the prefix
  const nextNumber = latestNumber + 1;

  // Return the new MRN with the appropriate prefix
  return `${prefix}${String(nextNumber).padStart(6, '0')}`;
};

const editPatient = async (req, res, next) => {
  const { id } = req.params;
  const { emergency_contacts, insurance_details, ...patientData } = req.body;

  try {
    const updatedPatient = await patientService.editPatient(id, patientData, emergency_contacts, insurance_details);
    res.status(200).json({ message: 'Patient updated successfully', data: updatedPatient });
  } catch (error) {
    next(error);
  }
};
const editObgPatient = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedPatient = await patientService.editObgPatient(id, updateData);
    res.status(200).json({ message: 'Patient updated successfully', data: updatedPatient });
  } catch (error) {
    next(error);
  }
};
const searchPatients = async (req, res, next) => {
  try {
    const searchParams = req.query; // Get search parameters from query string
    const data = await patientService.searchPatients(searchParams);
    res.status(200).json({ status: data.length > 0 ? true : false, data: data });
  } catch (error) {
    next(error);
  }
};

const Patients = async (req, res, next) => {
  try {
    // Extract query parameters for pagination
    const whereClause = {
      ...(req.query.hospital_id && { hospital_id: req.query.hospital_id }),
      ...(req.query.unit_id && { unit_id: req.query.unit_id }),
    }
    const { page = 1, limit = 10 } = req.query;

    // Fetch paginated data from the service
    const data = await patientService.Patients(Number(page), Number(limit), whereClause);

    // Respond with pagination metadata and data
    res.status(200).json({
      status: data.patients.length > 0,
      message: data.patients.length > 0 ? "Patients fetched successfully" : "No patients found",
      totalRecords: data.totalRecords,
      totalPages: data.totalPages,
      currentPage: page,
      data: data.patients,
    });
  } catch (error) {
    next(error);
  }
};

const getPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const data = await patientService.getPatient(patientId);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const transferPatToOT = async (req, res, next) => {
  try {
    const data = await patientService.transferPatToOT(req);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const pincodeAddress = async (req, res, next) => {
  try {
    const data = await patientService.pincodeAddress(req);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const fetchPatients = async (req, res, next) => {
  try {
    const data = await patientService.fetchPatients(req);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const updateMRN = async (req, res, next) => {
  try {
    let mrn = req.body.mrn;
    const latestMRN = await patientService.getLatestMRNByType("MRN");
    let patientData = req.body;
    // Generate the next MRN
    const nextMRN = generateMRN(latestMRN, "MRN");

    // Assign the generated MRN to the patient data
    patientData.mrn = nextMRN;
    const data = await patientService.updateMRN(mrn, patientData);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const NewRegisteredPatients = async (req, res, next) => {
  try {
    const data = await patientService.NewRegisteredPatients(req);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const patientByMobileNumber = async (req, res, next) => {
  try {
    const data = await patientService.patientByMobileNumber(req);
    res.status(200).json({ status: data ? true : false, data: data ? data : "Mobile Number Not Exists!!" });
  } catch (error) {
    next(error);
  }
};

const generateToken = async (req, res, next) => {
  try {
    const data = await patientService.generateToken(req);
    res.status(200).json({ status: data ? true : false, data: data ? data : "Mobile Number Not Exists!!" });
  } catch (error) {
    next(error);
  }
};

const getBabyDetail = async (req, res, next) => {
  try {
    const { patient_mrn } = req.query;
    const data = await patientService.getBabyDetail(patient_mrn);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const updateMobileNumber = async (req, res, next) => {
  try {
    const data = await patientService.updateMobileNumber(req);
    res.status(200).json({ status: true , data: data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  Patients,
  getPatient,
  editPatient,
  searchPatients,
  transferPatToOT,
  fetchPatients,
  updateMRN,
  pincodeAddress,
  NewRegisteredPatients,
  patientByMobileNumber,
  generateToken,
  editObgPatient,
  getBabyDetail,
  updateMobileNumber
};




