const { default: axios } = require('axios');
const crypto = require('crypto');
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

exports.encrypt = async (req) => {
    try {
        const { plaintext } = req.body;
        let publicKeyBase64 = process.env.PUBLICKEY;
        const publicKeyPem =
            '-----BEGIN PUBLIC KEY-----\n' +
            publicKeyBase64.match(/.{1,64}/g).join('\n') +
            '\n-----END PUBLIC KEY-----';
        const encryptedBuffer = crypto.publicEncrypt(
            {
                key: publicKeyPem,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha1'
            },
            Buffer.from(plaintext, 'utf-8')
        );
        return new Promise((resolve, reject) => {
            resolve(encryptedBuffer.toString('base64'));
        });
    } catch (error) {
        return error.message;
    }
};

let cachedToken = null;
let tokenExpiryTime = 0;
exports.accessToken = async (req) => {
    const currentTime = Date.now();
    if (cachedToken && currentTime < tokenExpiryTime) {
        return new Promise((resolve, reject) => {
            resolve({ accessToken: cachedToken, tokenType: 'bearer' });
        });
    }
    try {
        let data = JSON.stringify({
            "clientId": process.env.ABHACLIENTID,
            "clientSecret": process.env.ABHACLIENTSECRET,
            "grantType": "client_credentials"
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.abdm.gov.in/gateway/v0.5/sessions',
            headers: {
                'Content-Type': 'application/json',
                'REQUEST-ID': uuidv4(),
                'TIMESTAMP': moment().tz('Asia/Kolkata').utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                'X-CM-ID': 'sbx',
                'Cookie': 'TS011c04bd=01445fed044178ce690dbdb269651d754d9d6ca03fd4b486ff59d85b199f0c38e8fb677ae18980eeac06b780f0a5c40119ea9946d4; TS011c04bd=01445fed04360500b529f0d52f4edd592272ae4a4f877a1aa0ffb54ad9721bfe50f412eecf9ef194a98e213929fee1717be579c407'
            },
            data: data
        };
        let token = await axios.request(config);
        const tokenData = token.data;
        cachedToken = tokenData.accessToken;
        tokenExpiryTime = Date.now() + tokenData.expiresIn * 1000;
        return new Promise((resolve, reject) => {
            resolve({ accessToken: cachedToken, tokenType: 'bearer' });
        });
    } catch (error) {
        return error;
    }
};