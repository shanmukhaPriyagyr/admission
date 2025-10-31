const { default: axios } = require("axios");
const { encrypt, accessToken } = require("../utils/abha/rsaUtils");
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

exports.ecrypt = async (req) => {
    try {
        let data = await encrypt(req);
        return data;
    } catch (error) {
        return error;
    }
};

exports.getAccessToken = async (req) => {
    try {
        let data = await accessToken(req);
        return data;
    } catch (error) {
        return error;
    }
};

exports.abhaOtp = async (req) => {
    try {
        let encryptedData = await encrypt(req);
        let token = await accessToken(req);
        let data = JSON.stringify({
            "scope": ["abha-login", "aadhaar-verify"],
            "loginHint": "abha-number",
            "loginId": encryptedData,
            "otpSystem": "aadhaar"
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp',
            headers: {
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.abhaVerifyOtp = async (req) => {
    try {
        let txnId = req.body.txnId;
        let encryptedData = await encrypt(req);
        let token = await accessToken(req);
        let data = JSON.stringify({
            "scope": [
                "abha-login",
                "aadhaar-verify"
            ],
            "authData": {
                "authMethods": [
                    "otp"
                ],
                "otp": {
                    "txnId": txnId,
                    "otpValue": encryptedData
                }
            }
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify',
            headers: {
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.abhaProfile = async (req) => {
    try {
        let profileToken = req.body.profileToken;
        let token = await accessToken(req);
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account',
            headers: {
                'X-token': `Bearer ${profileToken}`,
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'Authorization': `Bearer ${token.accessToken}`
            }
        };
        const response = await axios.request(config);
        console.log('response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.abhaEnrollmentOtp = async (req) => {
    try {
        let encryptedData = await encrypt(req);
        let token = await accessToken(req);
        let data = JSON.stringify({
            "scope": ["abha-enrol"],
            "loginHint": "aadhaar",
            "loginId": encryptedData,
            "otpSystem": "aadhaar"
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp',
            headers: {
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.createABHA = async (req) => {
    try {
        let txnId = req.body.txnId;
        let mobile = req.body.mobile;
        let encryptedData = await encrypt(req);
        let token = await accessToken(req);
        let data = JSON.stringify({
            "authData": {
                "authMethods": [
                    "otp"
                ],
                "otp": {
                    "txnId": txnId,
                    "otpValue": encryptedData,
                    "mobile": mobile
                }
            },
            "consent": {
                "code": "abha-enrollment",
                "version": "1.4"
            }
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar',
            headers: {
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.abhaQrCode = async (req) => {
    try {
        let profileToken = req.body.profileToken;
        let token = await accessToken(req);
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/qrCode',
            headers: {
                'X-token': `Bearer ${profileToken}`,
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'Authorization': `Bearer ${token.accessToken}`
            }
        };
        const response = await axios.request(config);
        console.log('response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.abhaPhrQrCode = async (req) => {
    try {
        let profileToken = req.body.profileToken;
        let token = await accessToken(req);
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/qr-code',
            headers: {
                'X-token': `Bearer ${profileToken}`,
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'Authorization': `Bearer ${token.accessToken}`
            }
        };
        const response = await axios.request(config);
        console.log('response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};