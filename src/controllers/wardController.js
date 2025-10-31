const wardService = require('../services/wardService');

// Ward Controllers
const createWard = async (req, res, next) => {
  try {
    const ward = await wardService.createWard(req.body);
    res.status(201).json(ward);
  } catch (error) {
    next(error);
  }
};

const getWards = async (req, res, next) => {
  try {
    const wards = await wardService.getWards();
    res.json(wards);
  } catch (error) {
    next(error);
  }
};

const updateWard = async (req, res, next) => {
  try {
    const ward = await wardService.updateWard(req.params.id, req.body);
    res.json(ward);
  } catch (error) {
    next(error);
  }
};

const deleteWard = async (req, res, next) => {
  try {
    await wardService.deleteWard(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWard,
  getWards,
  updateWard,
  deleteWard
};
