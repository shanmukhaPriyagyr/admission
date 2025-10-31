const bedRepository = require('../repositories/bedRepository');

const createBed = async (data) => {
  return await bedRepository.createBed(data);
};

const getBeds = async () => {
  return await bedRepository.getBeds();
};

const getAvailableBedsCount = async () => {
  return await bedRepository.getAvailableBedsCount();
};

const getBedsByGroup = async (id) => {
  return await bedRepository.getBedsByGroup(id);
};

const updateBed = async (id, data) => {
  return await bedRepository.updateBed(id, data);
};

const deleteBed = async (id) => {
  return await bedRepository.deleteBed(id);
};

const getEmergencyBeds = async (hospital_id, unit_id) => {
  return await bedRepository.getEmergencyBeds(hospital_id, unit_id);
};

const updateBedStatus = async (id, is_available) => {
  return await bedRepository.updateBedStatus(id, is_available);
};

module.exports = { createBed, getBeds, updateBed, deleteBed, getBedsByGroup, getAvailableBedsCount, getEmergencyBeds, updateBedStatus };
