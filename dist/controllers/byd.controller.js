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
exports.SendSupplierInvoiceInMonitorFEL = exports.GetTokenFromByD = void 0;
const GetTokenFromByD = (oDataUrl, bydUsername, bydPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetch = require('node-fetch');
        const auth = "Basic " + Buffer.from(bydUsername + ":" + bydPassword).toString('base64');
        const headers = {
            "Authorization": auth,
            "x-csrf-token": "fetch",
            "Accept-Encoding": "gzip, deflate, br"
        };
        const tokenResponse = yield fetch(oDataUrl, {
            method: 'GET',
            headers
        })
            .then((response) => {
            const responseCookies = response.headers.get('set-cookie').replaceAll(', ', ';');
            //const responseCookies2 = responseCookies.join(';')
            //const responseCookies3 = responseCookies2.substring(0, responseCookies2.length - 15)
            //const responseCookies4 = responseCookies3.replace('HttpOnly;Secure','secure; HttpOnly;').replace('secure; HttpOnly;secure; HttpOnly;','secure; HttpOnly;')
            const responseToken = response.headers.get('x-csrf-token');
            //app.set('responseCookies', responseCookies)
            //app.set('responseToken', responseToken)
            return {
                "message": "OK",
                "status": 200,
                responseToken,
                responseCookies
            };
        })
            .catch((e) => {
            return {
                "message": "Error sending invoice: " + (e.message || e.statusText),
                "status": (e.status || 999)
            };
        });
        return tokenResponse;
    }
    catch (e) {
        return {
            "message": "Error sending invoice: " + (e.message || e.statusText),
            "status": (e.status || 999)
        };
    }
});
exports.GetTokenFromByD = GetTokenFromByD;
const SendSupplierInvoiceInMonitorFEL = (oDataUrl, token, headersCookies, bydUsername, bydPassword, supplierInvoice) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetch = require('node-fetch');
        const auth = "Basic " + Buffer.from(bydUsername + ":" + bydPassword).toString('base64');
        const headers = {
            "Authorization": auth,
            "cookie": headersCookies,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "x-csrf-token": token //'lk0JUAPh1EODAJHxkg5TpA==',
            //"User-Agent": "PostmanRuntime/7.29.0"
        };
        const tokenResponse = yield fetch(oDataUrl, {
            method: 'POST',
            headers,
            body: '{"ZBO_MonitorFELText": [{"Text": "' + supplierInvoice + '"}]}'
        })
            .then((response) => {
            if (!response.ok) {
                return {
                    "message": "Error sending supplier invoice to ByD: " + (response.message || response.statusText),
                    "status": (response.status || 999)
                };
            }
            return {
                "message": "OK",
                "status": 200
            };
        })
            .catch((e) => {
            return {
                "message": "Error sending supplier invoice to ByD: " + (e.message || e.statusText),
                "status": (e.status || 999)
            };
        });
        return tokenResponse;
    }
    catch (e) {
        return {
            "message": "Error sending supplier invoice to ByD: " + (e.message || e.statusText),
            "status": (e.status || 999)
        };
    }
});
exports.SendSupplierInvoiceInMonitorFEL = SendSupplierInvoiceInMonitorFEL;
