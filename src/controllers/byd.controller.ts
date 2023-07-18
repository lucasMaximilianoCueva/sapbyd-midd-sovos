import app from "..";

export const GetTokenFromByD = async (oDataUrl: string, bydUsername: string, bydPassword: string) => {
    try {
        const fetch = require('node-fetch');

        const auth = "Basic " + Buffer.from(bydUsername + ":" + bydPassword).toString('base64')

        const headers = {
            "Authorization": auth,
            "x-csrf-token": "fetch",
            "Accept-Encoding": "gzip, deflate, br"
        }

        const tokenResponse = await fetch(oDataUrl, {
            method: 'GET',
            headers
        })
            .then((response: any) => {
                const responseCookies = response.headers.get('set-cookie').replaceAll(', ', ';')

                //const responseCookies2 = responseCookies.join(';')
                //const responseCookies3 = responseCookies2.substring(0, responseCookies2.length - 15)
                //const responseCookies4 = responseCookies3.replace('HttpOnly;Secure','secure; HttpOnly;').replace('secure; HttpOnly;secure; HttpOnly;','secure; HttpOnly;')
                const responseToken = response.headers.get('x-csrf-token')

                //app.set('responseCookies', responseCookies)
                //app.set('responseToken', responseToken)

                return {
                    "message": "OK",
                    "status": 200,
                    responseToken,
                    responseCookies
                }
            })
            .catch((e: any) => {
                return {
                    "message": "Error sending invoice: " + (e.message || e.statusText),
                    "status": (e.status || 999)
                }
            })

        return tokenResponse
    } catch (e: any) {
        return {
            "message": "Error sending invoice: " + (e.message || e.statusText),
            "status": (e.status || 999)
        }
    }
}

export const SendSupplierInvoiceInMonitorFEL = async (oDataUrl: string, token: string, headersCookies: string, bydUsername: string, bydPassword: string, supplierInvoice: string) => {
    try {
        const fetch = require('node-fetch');
        
        const auth = "Basic " + Buffer.from(bydUsername + ":" + bydPassword).toString('base64')

        const headers = {
            "Authorization": auth,
            "cookie": headersCookies, //'MYSAPSSO2=AjQxMDMBABhLADkAOABQAFcANwBFAFgAOAA2AE0AIAACAAYxADIAMwADABBMAEkAOQAgACAAIAAgACAABAAYMgAwADIAMgAwADYAMQA4ADIAMgAxADcABQAEAAAACAYAAlgACQACUwD%2FAPowgfcGCSqGSIb3DQEHAqCB6TCB5gIBATELMAkGBSsOAwIaBQAwCwYJKoZIhvcNAQcBMYHGMIHDAgEBMBkwDjEMMAoGA1UEAxMDTEk5AgcgFAcxEkkWMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0yMjA2MTgyMjE3MzNaMCMGCSqGSIb3DQEJBDEWBBQmkwZAP9Qg9AFDX7Zc7F0Qw1dGUDAJBgcqhkjOOAQDBC4wLAIUGXT5jtxsjqnADp7z0DyR%2Ffo01ZsCFEz!ar1dg!9wBiDRqZ4vwtOj0JS8; SAP_SESSIONID_LI9_123=DViWBdBWG-N7K3zc7nbIg5RNvFPxexHsplL6Fj42ces%3D; sap-usercontext=sap-client%3D123',
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "x-csrf-token": token //'lk0JUAPh1EODAJHxkg5TpA==',
            //"User-Agent": "PostmanRuntime/7.29.0"
        }

        const tokenResponse = await fetch(oDataUrl, {
            method: 'POST',
            headers,
            body: '{"ZBO_MonitorFELText": [{"Text": "' + supplierInvoice + '"}]}'
        })
            .then((response: any) => {

                if(!response.ok) {
                    return {
                        "message": "Error sending supplier invoice to ByD: " + (response.message || response.statusText),
                        "status": (response.status || 999)
                    }
                }

                return {
                    "message": "OK",
                    "status": 200
                };
            })
            .catch((e: any) => {
                return {
                    "message": "Error sending supplier invoice to ByD: " + (e.message || e.statusText),
                    "status": (e.status || 999)
                }
            })

        return tokenResponse;
    } catch (e: any) {
        return {
            "message": "Error sending supplier invoice to ByD: " + (e.message || e.statusText),
            "status": (e.status || 999)
        }
    }
}