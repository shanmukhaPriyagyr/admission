const departmentService = require('../services/departmentService')

const getDepartments = async (req, res, next) => {
    try {
        let data = await departmentService.getDepartments(req.query);
        res.json({ status: data.length > 0 ? true : false, data: data });
    } catch (error) {
        next(error);
    }
};



module.exports = { getDepartments };
