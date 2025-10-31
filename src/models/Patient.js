const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const EmergencyContact = require('./EmergencyContact');
const Insurance = require('./Insurance');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mrn: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  // Personal Information
  full_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  middle_name: {
    type: DataTypes.STRING,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  marital_status: {
    type: DataTypes.ENUM('married', 'unmarried'),
  },
  pincode: {
    type: DataTypes.STRING,
  },
  nationality: {
    type: DataTypes.STRING,
  },
  area: {
    type: DataTypes.STRING,
  },
  house_no: {
    type: DataTypes.STRING,
  },
  mobile_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
    allowNull: true,
  },
  occupation: {
    type: DataTypes.STRING,
  },
  other_occupation: {
    type: DataTypes.STRING,
  },
  employer_name: {
    type: DataTypes.STRING,
  },
  other_employer_name: {
    type: DataTypes.STRING,
  },
  employer_pincode: {
    type: DataTypes.STRING,
  },
  employer_city: {
    type: DataTypes.STRING,
  },
  employer_state: {
    type: DataTypes.STRING,
  },
  employer_country: {
    type: DataTypes.STRING,
  },
  employer_area: {
    type: DataTypes.STRING,
  },
  employer_house_no: {
    type: DataTypes.STRING,
  },
  patient_income: {
    type: DataTypes.STRING,
  },
  passport_no: {
    type: DataTypes.STRING,
  },
  mother_tongue: {
    type: DataTypes.STRING,
  },
  religion: {
    type: DataTypes.STRING,
  },
  is_mlc: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_vvip: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ffro_form: {
    type: DataTypes.STRING,
  },

  // Government and Unique Identifiers
  abha_id: {
    type: DataTypes.STRING,
  },
  aadhar_number: {
    type: DataTypes.STRING,
  },

  // Lifestyle Information
  primary_care_physician: {
    type: DataTypes.STRING,
  },
  lifestyle_current_symptoms: {
    type: DataTypes.STRING,
  },
  lifestyle_current_medication: {
    type: DataTypes.STRING,
  },
  lifestyle_allergies: {
    type: DataTypes.STRING,
  },

  // Additional Information
  preferred_language: {
    type: DataTypes.STRING,
  },
  cultural_considerations: {
    type: DataTypes.TEXT,
  },
  special_needs: {
    type: DataTypes.STRING,
  },
  additional_requests: {
    type: DataTypes.STRING,
  },

  // Employment Details
  // is_employee: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false,
  // },
  // employment_id: {
  //   type: DataTypes.STRING,
  // },
  // employment_status: {
  //   type: DataTypes.STRING,
  // },
  // department_working_in: {
  //   type: DataTypes.STRING,
  // },

  // Medical History
  primary_care_doctor: {
    type: DataTypes.STRING,
  },
  referring_doctor: {
    type: DataTypes.STRING,
  },
  current_symptoms: {
    type: DataTypes.STRING,
  },
  past_medical_history: {
    type: DataTypes.STRING,
  },
  allergies: {
    type: DataTypes.STRING,
  },
  family_medical_history: {
    type: DataTypes.STRING,
  },
  current_medications: {
    type: DataTypes.STRING,
  },
  previous_surgeries: {
    type: DataTypes.STRING,
  },
  assigned_doctor: {
    type: DataTypes.STRING,
  },

  // Address Fields
  home_address: {
    type: DataTypes.STRING,
  },
  home_country: {
    type: DataTypes.STRING,
  },
  home_state: {
    type: DataTypes.STRING,
  },
  home_city: {
    type: DataTypes.STRING,
  },
  postal_address: {
    type: DataTypes.STRING,
  },
  postal_country: {
    type: DataTypes.STRING,
  },
  postal_state: {
    type: DataTypes.STRING,
  },
  postal_city: {
    type: DataTypes.STRING,
  },

  // Guardian Fields
  guardian_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  guardian_relationship: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  guardian_mobile_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  guardian_email: {
    type: DataTypes.STRING,
  },
  guardian_address: {
    type: DataTypes.STRING,
  },
  guardian_country: {
    type: DataTypes.STRING,
  },
  guardian_state: {
    type: DataTypes.STRING,
  },
  guardian_city: {
    type: DataTypes.STRING,
  },
  registration_fee_status: {
    type: DataTypes.STRING,
  },
  patient_state: {
    type: DataTypes.TEXT,
  },
  pan_no: {
    type: DataTypes.STRING
  },
  address_line_1: {
    type: DataTypes.TEXT
  },
  employer_address_1: {
    type: DataTypes.TEXT
  },
  temp_mrn: {
    type: DataTypes.TEXT
  },
  acknowledged_status: {
    type: DataTypes.TEXT
  },
  acknowledged_nurse_name: {
    type: DataTypes.TEXT
  },
  no_of_child: {
    type: DataTypes.TEXT
  },
  hospital_id: {
    type: DataTypes.STRING,
    defaultValue: "1"
  },
  unit_id: {
    type: DataTypes.STRING,
    defaultValue: "1"
  },
  is_mobile_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referral: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  payment_method: {
    type: DataTypes.STRING
  },
  tableName: 'patients',
  timestamps: true,
});

Patient.hasMany(EmergencyContact, {
  foreignKey: 'patient_id',
  constraints: false,
  as: 'emergency_contacts',
});

Patient.hasMany(Insurance, {
  foreignKey: 'patient_id',
  constraints: false,
  as: 'insurance',
});

module.exports = Patient;