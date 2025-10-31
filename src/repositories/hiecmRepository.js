const { default: axios } = require("axios");
const { accessToken } = require("../utils/abha/rsaUtils");
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

// In-memory store for webhook records (replace with DB for production)
const webhookRecords = [];
const WEBHOOK_SITE_BASE = 'https://webhook.site';

exports.generateToken = async (req) => {
    try {
        let token = await accessToken(req);
        let data = JSON.stringify({
            "abhaNumber": req.body.abhaNumber,
            "abhaAddress": req.body.abhaAddress,
            "name": req.body.name,
            "gender": req.body.gender,
            "yearOfBirth": req.body.yearOfBirth
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.abdm.gov.in/api/hiecm/v3/token/generate-token',
            headers: {
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'X-HIP-ID': process.env.HIP_ID || 'IN2910001953',
                'X-CM-ID': process.env.CM_ID || 'sbx',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('HIECM Token Generation Response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('HIECM Token Generation Error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.handleWebhookResponse = async (req) => {
    try {
        const webhookData = req.body;
        console.log('HIECM Webhook Response Received: ', webhookData);
        
        // Store the linkToken and other data
        // You can implement database storage here
        const linkTokenData = {
            abhaAddress: webhookData.abhaAddress,
            linkToken: webhookData.linkToken,
            requestId: webhookData.response?.requestId,
            timestamp: new Date().toISOString()
        };
        
        // Push to in-memory store
        webhookRecords.push(linkTokenData);

        // Note: DB persistence is disabled; use manual create API instead
        
        return {
            status: 'success',
            message: 'Webhook response processed successfully',
            data: linkTokenData
        };
    } catch (error) {
        console.log('HIECM Webhook Error: ', error?.response?.data || error.message);
        return {
            status: 'error',
            message: error.message,
            data: null
        };
    }
};

exports.getLatestRecordByAbhaAddress = async (req) => {
    const abhaAddress = req.query.abhaAddress || req.body.abhaAddress;
    if (!abhaAddress) {
        return { status: 'error', message: 'abhaAddress is required', data: null };
    }
    const matches = webhookRecords
        .filter(r => r.abhaAddress === abhaAddress)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return { status: 'success', data: matches[0] || null };
};

exports.getAllWebhookRecords = async () => {
    // Return copy to avoid external mutation
    return { status: 'success', data: [...webhookRecords].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) };
};

exports.listAbhaLinkTokens = async () => {
    const { AbhaLinkToken } = require('../models');
    const rows = await AbhaLinkToken.findAll({ order: [['created_at', 'DESC']] });
    return { status: 'success', data: rows };
};

exports.latestAbhaLinkTokenByAddress = async (req) => {
    const abhaAddress = req.query.abhaAddress || req.body.abhaAddress;
    if (!abhaAddress) {
        return { status: 'error', message: 'abhaAddress is required', data: null };
    }
    const { AbhaLinkToken } = require('../models');
    const row = await AbhaLinkToken.findOne({
        where: { abha_address: abhaAddress },
        order: [['created_at', 'DESC']]
    });
    return { status: 'success', data: row };
};

exports.createAbhaLinkToken = async (req) => {
    const { AbhaLinkToken } = require('../models');
    const { abhaAddress, linkToken, requestId, source, rawPayload } = req.body || {};
    if (!abhaAddress || !linkToken) {
        return { status: 'error', message: 'abhaAddress and linkToken are required', data: null };
    }
    const row = await AbhaLinkToken.create({
        abha_address: abhaAddress,
        link_token: linkToken,
        request_id: requestId || null,
        source: source || 'manual',
        raw_payload: rawPayload || null
    });
    return { status: 'success', data: row };
};

exports.getWebhookSiteAll = async () => {
    try {
        const tokenId = process.env.WEBHOOK_TOKEN_ID;
        if (!tokenId) {
            return { status: 'error', message: 'WEBHOOK_TOKEN_ID is not configured', data: null };
        }
        const url = `${WEBHOOK_SITE_BASE}/token/${tokenId}/requests?page=1&sorting=newest`;
        const headers = {};
        if (process.env.WEBHOOK_API_KEY) {
            headers['Api-Key'] = process.env.WEBHOOK_API_KEY;
        } else if (process.env.WEBHOOK_COOKIE && process.env.WEBHOOK_XSRF_TOKEN) {
            headers['Cookie'] = process.env.WEBHOOK_COOKIE;
            headers['X-XSRF-TOKEN'] = process.env.WEBHOOK_XSRF_TOKEN;
            headers['Accept'] = 'application/json, text/plain, */*';
            headers['User-Agent'] = 'HMS-Server';
            headers['Referer'] = 'https://webhook.site/';
        }
        const response = await axios.get(url, { headers });
        return { status: 'success', data: response.data?.data || [] };
    } catch (error) {
        return { status: 'error', message: error?.response?.statusText || error.message, data: null };
    }
};

exports.consentRequestInit = async (req) => {
    try {
        const token = await accessToken(req);
        const requestId = uuidv4();
        const data = JSON.stringify(req.body);
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.abdm.gov.in/api/hiecm/consent/v3/request/init',
            headers: {
                'REQUEST-ID': requestId,
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'X-CM-ID': process.env.CM_ID || 'sbx',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('HIECM Consent Request Init Response: ', response.data);
        return { ...response.data, requestId };
    } catch (error) {
        console.log('HIECM Consent Request Init Error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.consentRequestStatus = async (req) => {
    try {
        const token = await accessToken(req);
        const requestId = uuidv4();
        const data = JSON.stringify(req.body);
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.abdm.gov.in/api/hiecm/consent/v3/request/status',
            headers: {
                'REQUEST-ID': requestId,
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'X-CM-ID': process.env.CM_ID || 'sbx',
                'X-HIU-ID': process.env.HIU_ID || 'IN2910001953',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('HIECM Consent Request Status Response: ', response.data);
        return { ...response.data, requestId };
    } catch (error) {
        console.log('HIECM Consent Request Status Error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.consentHiuNotify = async (req) => {
    try {
        const token = await accessToken(req);
        const requestId = uuidv4();
        const data = JSON.stringify(req.body);
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.abdm.gov.in/api/hiecm/consent/v3/request/hiu/on-notify',
            headers: {
                'REQUEST-ID': requestId,
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'X-CM-ID': process.env.CM_ID || 'sbx',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('HIECM Consent HIU Notify Response: ', response.data);
        return { ...response.data, requestId };
    } catch (error) {
        console.log('HIECM Consent HIU Notify Error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.consentFetch = async (req) => {
    try {
        const token = await accessToken(req);
        const requestId = uuidv4();
        const data = JSON.stringify(req.body);
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.abdm.gov.in/api/hiecm/consent/v3/fetch',
            headers: {
                'REQUEST-ID': requestId,
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'X-CM-ID': process.env.CM_ID || 'sbx',
                'X-HIU-ID': process.env.HIU_ID || 'IN2910001953',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('HIECM Consent Fetch Response: ', response.data);
        return { ...response.data, requestId };
    } catch (error) {
        console.log('HIECM Consent Fetch Error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.dataFlowHealthInfoRequest = async (req) => {
    try {
        const token = await accessToken(req);
        const requestId = uuidv4();
        const data = JSON.stringify(req.body);
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/request',
            headers: {
                'REQUEST-ID': requestId,
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'X-CM-ID': process.env.CM_ID || 'sbx',
                'X-HIU-ID': process.env.HIU_ID || 'IN2910001953',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: data
        };
        const response = await axios.request(config);
        console.log('HIECM Data Flow Health Info Request Response: ', response.data);
        return { ...response.data, requestId };
    } catch (error) {
        console.log('HIECM Data Flow Health Info Request Error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};

exports.linkCareContext = async (req) => {
    try {
        const token = await accessToken(req);
        const linkToken = req.headers['x-link-token'] || req.body.linkToken;
        const payload = JSON.stringify({
            "abhaNumber": req.body.abhaNumber,
            "abhaAddress": req.body.abhaAddress,
            "patient": req.body.patient
        });
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.abdm.gov.in/api/hiecm/hip/v3/link/carecontext',
            headers: {
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'X-HIP-ID': process.env.HIP_ID || 'IN2910001953',
                'X-LINK-TOKEN': linkToken,
                'X-CM-ID': process.env.CM_ID || 'sbx',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`
            },
            data: payload
        };
        const response = await axios.request(config);
        console.log('HIECM Link CareContext Response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('HIECM Link CareContext Error: ', error?.response?.data || error.message);
        return error?.response?.data || error;
    }
};
