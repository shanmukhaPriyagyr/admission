const bedService = require('../services/bedService');

const createBed = async (req, res, next) => {
  try {
    const bed = await bedService.createBed(req.body);
    res.status(201).json(bed);
  } catch (error) {
    next(error);
  }
};

const getBeds = async (req, res, next) => {
  try {
    const beds = await bedService.getBeds();
    res.json(beds);
  } catch (error) {
    next(error);
  }
};

const getAvailableBedsCount = async (req, res, next) => {
  try {
    const beds = await bedService.getAvailableBedsCount();
    res.json({ status: true, count: beds });
  } catch (error) {
    next(error);
  }
};

const getBedsByGroup = async (req, res, next) => {
  try {
    const beds = await bedService.getBedsByGroup(req.query.id);
    res.json({ status: beds.length > 0 ? true : false, data: beds });
  } catch (error) {
    next(error);
  }
};

const updateBed = async (req, res, next) => {
  try {
    const bed = await bedService.updateBed(req.params.id, req.body);
    res.json(bed);
  } catch (error) {
    next(error);
  }
};

const updateBedStatus = async (req, res, next) => {
  try {
    const bed = await bedService.updateBedStatus(req.query.id, req.query.is_available);
    res.json(bed);
  } catch (error) {
    next(error);
  }
};

const deleteBed = async (req, res, next) => {
  try {
    await bedService.deleteBed(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getEmergencyBeds = async (req, res, next) => {
  try {
    const beds = await bedService.getEmergencyBeds(req.query.hospital_id, req.query.unit_id);
    res.json({ status: beds.length > 0 ? true : false, data: beds });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBed, getBeds, updateBed, deleteBed, getBedsByGroup, getAvailableBedsCount, getEmergencyBeds, updateBedStatus };
