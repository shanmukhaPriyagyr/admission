const wardRepository = require('../repositories/wardRepository');

const createWard = async (data) => {
  return await wardRepository.createWard(data);
};

const getWards = async () => {
  return await wardRepository.getWards();
};

const updateWard = async (id, data) => {
  return await wardRepository.updateWard(id, data);
};

const deleteWard = async (id) => {
  return await wardRepository.deleteWard(id);
};

module.exports = { createWard, getWards, updateWard, deleteWard };
