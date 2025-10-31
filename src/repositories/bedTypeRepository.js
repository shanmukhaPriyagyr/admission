const BedType = require('../models/BedType');

const createBedType = async (data) => {
  return await BedType.create(data);
};

const getBedTypes = async () => {
  return await BedType.findAll();
};

const updateBedType = async (id, data) => {
  const bedType = await BedType.findByPk(id);
  if (bedType) return await bedType.update(data);
  throw new Error('Bed Type not found');
};

const deleteBedType = async (id) => {
  const bedType = await BedType.findByPk(id);
  if (bedType) return await bedType.destroy();
  throw new Error('Bed Type not found');
};

module.exports = { createBedType, getBedTypes, updateBedType, deleteBedType };
