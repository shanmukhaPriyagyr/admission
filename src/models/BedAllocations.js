const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const IpdPatients = require('./IPDPatient');
const Bed = require('./Bed');

const BedAllocation = sequelize.define('BedAllocation', {
  admission_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  case_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bed_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  patient_mrn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  admission_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  discharge_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Occupied', 'Released', 'Bed Allocated', 'Transferred To OT', 'Bed Deallocated'),
    allowNull: false,
  },
  bed_status_change_reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bed_status_change_remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ot_acknowledgement: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
}, {
  tableName: 'bed_allocations',
  timestamps: true,
});

BedAllocation.belongsTo(IpdPatients, { foreignKey: 'case_id', targetKey: 'case_id' });
BedAllocation.belongsTo(Bed, { foreignKey: 'bed_id', as: 'bed' });

module.exports = BedAllocation;