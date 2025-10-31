const abhaRepository = require('../repositories/abhaRepository');

exports.ecrypt = async (req) => {
    return await abhaRepository.ecrypt(req);
};

exports.getAccessToken = async (req) => {
    return await abhaRepository.getAccessToken(req);
};

exports.abhaOtp = async (req) => {
    return await abhaRepository.abhaOtp(req);
};

exports.abhaVerifyOtp = async (req) => {
    return await abhaRepository.abhaVerifyOtp(req);
};

exports.abhaProfile = async (req) => {
    return await abhaRepository.abhaProfile(req);
};

exports.abhaEnrollmentOtp = async (req) => {
    return await abhaRepository.abhaEnrollmentOtp(req);
};

exports.createABHA = async (req) => {
    return await abhaRepository.createABHA(req);
};

exports.abhaQrCode = async (req) => {
    return await abhaRepository.abhaQrCode(req);
};

exports.abhaPhrQrCode = async (req) => {
    return await abhaRepository.abhaPhrQrCode(req);
};