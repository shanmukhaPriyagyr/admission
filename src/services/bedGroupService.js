const bedGroupRepository = require('../repositories/bedGroupRepository');

const createBedGroup = async (data) => {
  return await bedGroupRepository.createBedGroup(data);
};

const getBedGroups = async () => {
  return await bedGroupRepository.getBedGroups();
};

const updateBedGroup = async (id, data) => {
  return await bedGroupRepository.updateBedGroup(id, data);
};

const deleteBedGroup = async (id) => {
  return await bedGroupRepository.deleteBedGroup(id);
};

module.exports = { createBedGroup, getBedGroups, updateBedGroup, deleteBedGroup };
