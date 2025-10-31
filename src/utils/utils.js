const { default: axios } = require('axios');
require('dotenv').config();

exports.createBill = async (req) => {
    try {
        let postdata = req;
        let bill = await axios({
            method: "post",
            url: `${process.env.BILLING_ENDPOINT}/api/createIpdBilling`,
            data: postdata,
        });
        return new Promise((resolve, reject) => {
            resolve(bill.data);
        });
    } catch (error) {
        return error.message;
    }
};

exports.fetchCharges = async (charge_type, charge_code) => {
    try {
        let bill = await axios({
            method: "get",
            url: `${process.env.CHARGE_CODE_ENDPOINT}/api/fetchCharges?charge_type=${charge_type}&charge_category=${charge_code}`,
        });
        return new Promise((resolve, reject) => {
            resolve(bill.data);
        });
    } catch (error) {
        return error.message;
    }
};

exports.transferPatientToOT = async (req) => {
    try {
        let postdata = req;
        let patient = await axios({
            method: "post",
            url: `${process.env.OT_ENDPOINT}/api/createOtPatient`,
            data: postdata,
        });
        return new Promise((resolve, reject) => {
            resolve(patient.data);
        });
    } catch (error) {
        return error.message;
    }
};

exports.pincode = async (req) => {
    try {
        let patient = await axios({
            method: "get",
            url: `https://api.postalpincode.in/pincode/${req.pincode}`
        });
        return new Promise((resolve, reject) => {
            resolve(patient.data);
        });
    } catch (error) {
        return error.message;
    }
};