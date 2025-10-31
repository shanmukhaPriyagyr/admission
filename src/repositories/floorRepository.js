const Floor = require('../models/Floor');

const createFloor = async (data) => {
  return await Floor.create(data);
};

const getFloors = async () => {
  return await Floor.findAll();
};

const updateFloor = async (id, data) => {
  const floor = await Floor.findByPk(id);
  if (floor) return await floor.update(data);
  throw new Error('Floor not found');
};

const deleteFloor = async (id) => {
  const floor = await Floor.findByPk(id);
  if (floor) return await floor.destroy();
  throw new Error('Floor not found');
};

module.exports = { createFloor, getFloors, updateFloor, deleteFloor };
