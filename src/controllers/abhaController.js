const abhaService = require('../services/abhaService');

exports.ecrypt = async (req, res, next) => {
    try {
        const data = await abhaService.ecrypt(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.getAccessToken = async (req, res, next) => {
    try {
        const data = await abhaService.getAccessToken(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.abhaOtp = async (req, res, next) => {
    try {
        const data = await abhaService.abhaOtp(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.abhaVerifyOtp = async (req, res, next) => {
    try {
        const data = await abhaService.abhaVerifyOtp(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.abhaProfile = async (req, res, next) => {
    try {
        const data = await abhaService.abhaProfile(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.abhaEnrollmentOtp = async (req, res, next) => {
    try {
        const data = await abhaService.abhaEnrollmentOtp(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.createABHA = async (req, res, next) => {
    try {
        const data = await abhaService.createABHA(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.abhaQrCode = async (req, res, next) => {
    try {
        const data = await abhaService.abhaQrCode(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.abhaPhrQrCode = async (req, res, next) => {
    try {
        const data = await abhaService.abhaPhrQrCode(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};