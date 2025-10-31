const departmentRepository = require('../repositories/departmentRepository');

const getDepartments = async (data) => {
    return await departmentRepository.getDepartments(data);
};









module.exports = { getDepartments };