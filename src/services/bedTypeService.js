const bedTypeRepository = require('../repositories/bedTypeRepository');

const createBedType = async (data) => {
  return await bedTypeRepository.createBedType(data);
};

const getBedTypes = async () => {
  return await bedTypeRepository.getBedTypes();
};

const updateBedType = async (id, data) => {
  return await bedTypeRepository.updateBedType(id, data);
};

const deleteBedType = async (id) => {
  return await bedTypeRepository.deleteBedType(id);
};

module.exports = { createBedType, getBedTypes, updateBedType, deleteBedType };
