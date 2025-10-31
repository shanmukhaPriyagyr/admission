const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Blocks = sequelize.define('Blocks', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ward_id: { type: DataTypes.INTEGER, allowNull: false },
    hospital_id: { type: DataTypes.INTEGER, allowNull: false },
    unit_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
}, { tableName: 'blocks', timestamps: true });

module.exports = Blocks;
