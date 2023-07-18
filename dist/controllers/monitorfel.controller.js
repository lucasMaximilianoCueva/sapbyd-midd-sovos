"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSupplierInvoiceInMonitorFEL = void 0;
const byd_controller_1 = require("./byd.controller");
// Reviso si dado un username y password existe el usuario en la base o no
const PostSupplierInvoiceInMonitorFEL = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body || Object.keys(req.body).length === 0)
            return res.status(404).json({ "message": "Error receiving supplier invoice in body", "status": "400" });
        const usuario = req.query.usuario;
        const clave = req.query.clave;
        if (!usuario || !clave)
            return res.status(404).json({ "message": "Error receiving user and password", "status": "400" });
        const ambiente = req.query.target;
        if (!ambiente)
            return res.status(404).json({ "message": "Error receiving target in query (dev, test, prod)", "status": "400" });
        const xml2js = require('xml2js');
        const xml2jsBuilder = new xml2js.Builder();
        const supplierInvoice = Buffer.from(xml2jsBuilder.buildObject(req.body), 'utf8').toString('base64');
        if (ambiente !== "test" && ambiente !== "dev" && ambiente !== "prod")
            return res.status(404).json({ "message": "Error receiving target in query, must be: 'dev', 'test' or 'prod'", "status": "400" });
        // Ambiente de desarrollo
        let bydUsername = usuario || process.env.BYDUSERNAME || 'CLXT555';
        let bydPassword = clave || process.env.BYDPASSWORD || 'Inicio01';
        let oDataUrl = process.env.ODATAURL || 'https://my343967.sapbydesign.com/sap/byd/odata/cust/v1/zcl_managemonitorfel/ZBO_MonitorFELRootCollection';
        // Ambiente de test
        if (ambiente === "test") {
            bydUsername = usuario || "seidorfuncional";
            bydPassword = clave || "Welcome05";
            oDataUrl = "https://my356943.sapbydesign.com/sap/byd/odata/cust/v1/zcl_managemonitorfel/ZBO_MonitorFELRootCollection";
        }
        if (!supplierInvoice)
            return res.status(404).json({ "message": "Error receiving supplier invoice in body", "status": "400" });
        console.log(supplierInvoice);
        const { status, message, responseToken, responseCookies } = yield (0, byd_controller_1.GetTokenFromByD)(oDataUrl, bydUsername, bydPassword);
        if (status !== 200)
            return res.status(status).json({ message });
        const supplierInvoiceCreationResponse = yield (0, byd_controller_1.SendSupplierInvoiceInMonitorFEL)(oDataUrl, responseToken, responseCookies, bydUsername, bydPassword, supplierInvoice);
        if (supplierInvoiceCreationResponse.status !== 200)
            return res.status(supplierInvoiceCreationResponse.status).json(supplierInvoiceCreationResponse);
        return res.status(200).json(supplierInvoiceCreationResponse);
    }
    catch (error) {
        console.error(error);
        res.json(error);
    }
});
exports.PostSupplierInvoiceInMonitorFEL = PostSupplierInvoiceInMonitorFEL;
