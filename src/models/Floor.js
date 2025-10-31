const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Floor = sequelize.define('Floor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  block_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'blocks', key: 'id' } },
  description: { type: DataTypes.TEXT },
}, { tableName: 'floors', timestamps: true });

module.exports = Floor;
