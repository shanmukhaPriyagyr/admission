const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const BedType = require('./BedType');
const Floor = require('./Floor');
const Ward = require('./Ward');
const BedGroup = require('./BedGroup');
const Blocks = require('./Blocks');
const Department = require('./Department');

const Bed = sequelize.define('Bed', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bed_type_id: { type: DataTypes.INTEGER, allowNull: false },
  bed_group_id: { type: DataTypes.INTEGER },
  ward_id: { type: DataTypes.INTEGER, allowNull: false },
  floor_id: { type: DataTypes.INTEGER, allowNull: false },
  bed_block_id: { type: DataTypes.INTEGER, allowNull: false },
  bed_department_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  name: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'beds',
  timestamps: true,
});

// Define associations
Bed.belongsTo(BedType, { foreignKey: 'bed_type_id', as: 'bedType' });
Bed.belongsTo(Floor, { foreignKey: 'floor_id', as: 'floor' });
Bed.belongsTo(Ward, { foreignKey: 'ward_id', as: 'ward' });
Bed.belongsTo(BedGroup, { foreignKey: 'bed_group_id', as: 'bedGroup' });
Bed.belongsTo(Blocks, { foreignKey: 'bed_block_id', as: 'block' });
// Bed.belongsTo(Department, { foreignKey: 'bed_department_id', as: 'department' });

module.exports = Bed;
