
const bedGroupService = require('../services/bedGroupService');

// Bed Group Controllers
const createBedGroup = async (req, res, next) => {
  try {
    const bedGroup = await bedGroupService.createBedGroup(req.body);
    res.status(201).json(bedGroup);
  } catch (error) {
    next(error);
  }
};

const getBedGroups = async (req, res, next) => {
  try {
    const bedGroups = await bedGroupService.getBedGroups();
    res.json({ status: bedGroups.length > 0 ? true : false, data: bedGroups });
  } catch (error) {
    next(error);
  }
};

const updateBedGroup = async (req, res, next) => {
  try {
    const bedGroup = await bedGroupService.updateBedGroup(req.params.id, req.body);
    res.json(bedGroup);
  } catch (error) {
    next(error);
  }
};

const deleteBedGroup = async (req, res, next) => {
  try {
    await bedGroupService.deleteBedGroup(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};



module.exports = {
  createBedGroup,
  getBedGroups,
  updateBedGroup,
  deleteBedGroup
};
