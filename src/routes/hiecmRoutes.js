const express = require('express');
const hiecmController = require('../controllers/hiecmController');
const router = express.Router();

// HIECM Token Generation Route
router.post('/generateToken', hiecmController.generateToken);

// HIECM Webhook Route for receiving token responses
router.post('/webhook/token-response', hiecmController.handleWebhookResponse);

// Link Care Context Route
router.post('/linkCareContext', hiecmController.linkCareContext);

// Query latest webhook record by abhaAddress
router.get('/webhook/latest', hiecmController.getLatestRecordByAbhaAddress);

// List all webhook records
router.get('/webhook/all', hiecmController.getAllWebhookRecords);

// Proxy: return all records from webhook.site
router.get('/webhooksite/all', hiecmController.getWebhookSiteAll);

// DB: list and latest from persisted AbhaLinkToken
router.get('/abha-links', hiecmController.listAbhaLinkTokens);
router.get('/abha-links/latest', hiecmController.latestAbhaLinkTokenByAddress);
router.post('/abha-links', hiecmController.createAbhaLinkToken);

// HIECM Consent Request Init
router.post('/consent/request/init', hiecmController.consentRequestInit);

// HIECM Consent Request Status
router.post('/consent/request/status', hiecmController.consentRequestStatus);

// HIECM Consent HIU Notify
router.post('/consent/request/hiu/on-notify', hiecmController.consentHiuNotify);

// HIECM Consent Fetch
router.post('/consent/fetch', hiecmController.consentFetch);

// HIECM Data Flow Health Information Request
router.post('/data-flow/health-information/request', hiecmController.dataFlowHealthInfoRequest);

module.exports = router;
