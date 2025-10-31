const { body, validationResult, query } = require('express-validator');
const Patient = require('../models/Patient'); // Import the Patient model

// Validation middleware for all patient registration fields
const validatePatient = [
    // Email validation allowing up to 6 users with the same email
    body('email').optional()
    .isEmail().withMessage('Valid email is required')
    .custom(async (email) => {
        const count = await Patient.count({ where: { email } });
        if (count >= 6) {
            throw new Error('Email cannot be used by more than 6 patients');
        }
    }),

    // Mobile number validation with uniqueness check
    body('mobile_no')
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 characters')
    .custom(async (mobile_no) => {
        const count = await Patient.count({ where: { mobile_no } });
        if (count >= 6) {
            throw new Error('Mobile number cannot be used by more than 6 patients');
        }
    }),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('title').optional().isString(),
    body('middle_name').optional().isString(),
    body('first_name').optional().notEmpty().withMessage('First name is required'),
    body('last_name').optional().notEmpty().withMessage('Last name is required'),
    body('dob').optional().isDate().withMessage('Date of Birth must be a valid date'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    body('marital_status').optional().isString(),
    body('pincode').optional().isString(),
    body('nationality').optional().isString(),
    body('area').optional().isString(),
    body('house_no').optional().isString(),
    body('mobile_no').isLength({ min: 10, max: 15 }).withMessage('Mobile number must be between 10 to 15 characters'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('occupation').optional().isString(),
    body('employer_name').optional().isString(),
    body('employer_pincode').optional().isString(),
    body('employer_city').optional().isString(),
    body('employer_area').optional().isString(),
    body('employer_house_no').optional().isString(),
    body('patient_income').optional().isFloat().withMessage('Income must be a valid number'),
    body('passport_no').optional().isString(),
    body('mother_tongue').optional().isString(),
    body('religion').optional().isString(),
    body('is_mlc').optional().isBoolean(),
    body('is_vvip').optional().isBoolean(),
    body('ffro_form').optional().isString(),
    body('abha_id').optional().isString(),
    body('aadhar_number').optional().isString(),
    body('primary_care_physician').optional().isString(),
    body('lifestyle_current_symptoms').optional().isString(),
    body('lifestyle_current_medication').optional().isString(),
    body('lifestyle_allergies').optional().isString(),
    body('preferred_language').optional().isString(),
    body('cultural_considerations').optional().isString(),
    body('special_needs').optional().isString(),
    body('additional_requests').optional().isString(),
    body('is_employee').optional().isBoolean(),
    body('employment_id').optional().isString(),
    body('employment_status').optional().isString(),
    body('department_working_in').optional().isString(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
                success: false,  
                message: 'Validation error', 
                errors: errors.array() 
            });
        }
        next();
    }
];

// Validation for editing patient data
const validateEditPatient = [
    body('full_name').optional().isString(),
    body('dob').optional().isDate().withMessage('Date of Birth must be a valid date'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('mobile_no').optional().isLength({ min: 10, max: 15 }).withMessage('Mobile number must be between 10 to 15 characters'),
    // Add other fields as necessary
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

const validateFetchBedGroups = [
    query('hospital_id').notEmpty().withMessage("Hospital ID is Required"),
    query('unit_id').notEmpty().withMessage("Unit ID is Required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
]

module.exports = { 
    validatePatient,
    validateEditPatient,
    validateFetchBedGroups
};
