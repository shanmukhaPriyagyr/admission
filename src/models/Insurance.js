const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Insurance = sequelize.define('Insurance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'patients', // Name of the target table
      key: 'id',         // Key in the target table
    },
  },
  insurance_provider: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  policy_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  group_no: {
    type: DataTypes.STRING,
  },
  policy_holder_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  policy_holder_dob: {
    type: DataTypes.DATEONLY,
  },
  relationship_to_policy_holder: {
    type: DataTypes.STRING,
  },
  insurance_provider_mobile_no: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'insurance',
  timestamps: true,
});

module.exports = Insurance;
