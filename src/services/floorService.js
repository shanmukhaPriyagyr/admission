const floorRepository = require('../repositories/floorRepository');

const createFloor = async (data) => {
  return await floorRepository.createFloor(data);
};

const getFloors = async () => {
  return await floorRepository.getFloors();
};

const updateFloor = async (id, data) => {
  return await floorRepository.updateFloor(id, data);
};

const deleteFloor = async (id) => {
  return await floorRepository.deleteFloor(id);
};

module.exports = { createFloor, getFloors, updateFloor, deleteFloor };
