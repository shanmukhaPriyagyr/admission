const hiecmRepository = require('../repositories/hiecmRepository');

exports.generateToken = async (req) => {
    return await hiecmRepository.generateToken(req);
};

exports.handleWebhookResponse = async (req) => {
    return await hiecmRepository.handleWebhookResponse(req);
};

exports.linkCareContext = async (req) => {
    return await hiecmRepository.linkCareContext(req);
};

exports.getLatestRecordByAbhaAddress = async (req) => {
    return await hiecmRepository.getLatestRecordByAbhaAddress(req);
};

exports.getAllWebhookRecords = async () => {
    return await hiecmRepository.getAllWebhookRecords();
};

exports.getWebhookSiteAll = async () => {
    return await hiecmRepository.getWebhookSiteAll();
};

exports.listAbhaLinkTokens = async () => {
    return await hiecmRepository.listAbhaLinkTokens();
};

exports.latestAbhaLinkTokenByAddress = async (req) => {
    return await hiecmRepository.latestAbhaLinkTokenByAddress(req);
};

exports.createAbhaLinkToken = async (req) => {
    return await hiecmRepository.createAbhaLinkToken(req);
};

exports.consentRequestInit = async (req) => {
    return await hiecmRepository.consentRequestInit(req);
};

exports.consentRequestStatus = async (req) => {
    return await hiecmRepository.consentRequestStatus(req);
};

exports.consentHiuNotify = async (req) => {
    return await hiecmRepository.consentHiuNotify(req);
};

exports.consentFetch = async (req) => {
    return await hiecmRepository.consentFetch(req);
};

exports.dataFlowHealthInfoRequest = async (req) => {
    return await hiecmRepository.dataFlowHealthInfoRequest(req);
};
