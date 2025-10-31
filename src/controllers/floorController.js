const floorService = require('../services/floorService');

const createFloor = async (req, res, next) => {
  try {
    const floor = await floorService.createFloor(req.body);
    res.status(201).json(floor);
  } catch (error) {
    next(error);
  }
};

const getFloors = async (req, res, next) => {
  try {
    const floors = await floorService.getFloors();
    res.json(floors);
  } catch (error) {
    next(error);
  }
};

const updateFloor = async (req, res, next) => {
  try {
    const floor = await floorService.updateFloor(req.params.id, req.body);
    res.json(floor);
  } catch (error) {
    next(error);
  }
};

const deleteFloor = async (req, res, next) => {
  try {
    await floorService.deleteFloor(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = { createFloor, getFloors, updateFloor, deleteFloor };
