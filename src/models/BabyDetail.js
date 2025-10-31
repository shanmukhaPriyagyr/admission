const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BabyDetail = sequelize.define('BabyDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patient_mrn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  baby_mrn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  baby_age: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'baby_details',
  timestamps: true,
});

module.exports = BabyDetail;