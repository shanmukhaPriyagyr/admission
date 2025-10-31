const Bed = require('../models/Bed');
const BedGroup = require('../models/BedGroup');

const createBedGroup = async (data) => {
  return await BedGroup.create(data);
};

const getBedGroups = async () => {
  return await BedGroup.findAll();
};

const updateBedGroup = async (id, data) => {
  const bedGroupBedGroup = await BedGroup.findByPk(id);
  if (bedGroupBedGroup) return await bedGroupBedGroup.update(data);
  throw new Error('Bed Type not found');
};

const deleteBedGroup = async (id) => {
  const bedGroupBedGroup = await BedGroup.findByPk(id);
  if (bedGroupBedGroup) return await bedGroupBedGroup.destroy();
  throw new Error('Bed Type not found');
};

module.exports = { createBedGroup, getBedGroups, updateBedGroup, deleteBedGroup };
