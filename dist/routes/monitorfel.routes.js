"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monitorfel_controller_1 = require("../controllers/monitorfel.controller");
const router = (0, express_1.Router)();
router.post('/api/byd/sendSupplierInvoice', monitorfel_controller_1.PostSupplierInvoiceInMonitorFEL);
exports.default = router;
