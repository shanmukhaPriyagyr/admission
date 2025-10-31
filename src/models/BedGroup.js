const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BedGroup = sequelize.define('BedGroup', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ward_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'wards', key: 'id' } },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
}, { tableName: 'bed_groups', timestamps: true });

module.exports = BedGroup;
