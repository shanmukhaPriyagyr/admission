const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Ward = sequelize.define('Ward', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  floor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'floors', key: 'id' } },
  name: { type: DataTypes.STRING, allowNull: false },
  isEmergency: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  description: { type: DataTypes.TEXT },
}, { tableName: 'wards', timestamps: true });

module.exports = Ward;
