const hiecmService = require('../services/hiecmService');

exports.generateToken = async (req, res, next) => {
    try {
        const data = await hiecmService.generateToken(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.handleWebhookResponse = async (req, res, next) => {
    try {
        const data = await hiecmService.handleWebhookResponse(req);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.linkCareContext = async (req, res, next) => {
    try {
        const data = await hiecmService.linkCareContext(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.getLatestRecordByAbhaAddress = async (req, res, next) => {
    try {
        const result = await hiecmService.getLatestRecordByAbhaAddress(req);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.getAllWebhookRecords = async (req, res, next) => {
    try {
        const result = await hiecmService.getAllWebhookRecords();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.getWebhookSiteAll = async (req, res, next) => {
    try {
        const result = await hiecmService.getWebhookSiteAll();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.listAbhaLinkTokens = async (req, res, next) => {
    try {
        const result = await hiecmService.listAbhaLinkTokens();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.latestAbhaLinkTokenByAddress = async (req, res, next) => {
    try {
        const result = await hiecmService.latestAbhaLinkTokenByAddress(req);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.createAbhaLinkToken = async (req, res, next) => {
    try {
        const result = await hiecmService.createAbhaLinkToken(req);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.consentRequestInit = async (req, res, next) => {
    try {
        const data = await hiecmService.consentRequestInit(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.consentRequestStatus = async (req, res, next) => {
    try {
        const data = await hiecmService.consentRequestStatus(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.consentHiuNotify = async (req, res, next) => {
    try {
        const data = await hiecmService.consentHiuNotify(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.consentFetch = async (req, res, next) => {
    try {
        const data = await hiecmService.consentFetch(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};

exports.dataFlowHealthInfoRequest = async (req, res, next) => {
    try {
        const data = await hiecmService.dataFlowHealthInfoRequest(req);
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        next(error);
    }
};
