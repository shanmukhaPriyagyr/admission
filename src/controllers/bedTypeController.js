const bedTypeService = require('../services/bedTypeService');

const createBedType = async (req, res, next) => {
  try {
    const bedType = await bedTypeService.createBedType(req.body);
    res.status(201).json(bedType);
  } catch (error) {
    next(error);
  }
};

const getBedTypes = async (req, res, next) => {
  try {
    const bedTypes = await bedTypeService.getBedTypes();
    res.json(bedTypes);
  } catch (error) {
    next(error);
  }
};

const updateBedType = async (req, res, next) => {
  try {
    const bedType = await bedTypeService.updateBedType(req.params.id, req.body);
    res.json(bedType);
  } catch (error) {
    next(error);
  }
};

const deleteBedType = async (req, res, next) => {
  try {
    await bedTypeService.deleteBedType(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
    createBedType,
    getBedTypes,
    updateBedType,
    deleteBedType
  };
