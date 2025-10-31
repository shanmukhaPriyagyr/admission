const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Patient = require('./Patient');

const EmergencyContact = sequelize.define('EmergencyContact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'patients', // Use table name instead of the model to avoid circular dependency
      key: 'id',
    },
  },
  contact_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  relationship_to_patient: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  custom_relation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mobile_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  alt_mobile_no: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  pincode: {
    type: DataTypes.STRING,
  },
  area: {
    type: DataTypes.STRING,
  },
  house_no: {
    type: DataTypes.STRING,
  },
  contact_address_1: {
    type: DataTypes.STRING
  },
  contact_address_2: {
    type: DataTypes.STRING
  },
  contact_address_3: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'emergency_contacts',
  timestamps: true,
});

module.exports = EmergencyContact;
