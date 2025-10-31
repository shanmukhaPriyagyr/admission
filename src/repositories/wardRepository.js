const Ward = require('../models/Ward');

const createWard = async (data) => {
  return await Ward.create(data);
};

const getWards = async () => {
  return await Ward.findAll();
};

const updateWard = async (id, data) => {
  const ward = await Ward.findByPk(id);
  if (ward) return await ward.update(data);
  throw new Error('Ward not found');
};

const deleteWard = async (id) => {
  const ward = await Ward.findByPk(id);
  if (ward) return await ward.destroy();
  throw new Error('Ward not found');
};

module.exports = { createWard, getWards, updateWard, deleteWard };
