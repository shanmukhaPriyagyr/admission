const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BedType = sequelize.define('BedType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
}, { tableName: 'bed_types', timestamps: true });

module.exports = BedType;
