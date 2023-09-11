import { RequestHandler } from "express"
import app from ".."
import { GetTokenFromByD, SendSupplierInvoiceInMonitorFEL } from "./byd.controller"

// Reviso si dado un username y password existe el usuario en la base o no
export const PostSupplierInvoiceInMonitorFEL : RequestHandler = async (req:any, res:any) => {
    try {
        if(!req.body || Object.keys(req.body).length === 0)
            return res.status(404).json({"message": "Error receiving supplier invoice in body", "status": "400"})

        const usuario = req.query.usuario as string
        const clave = req.query.clave as string

        if(!usuario || !clave)
            return res.status(404).json({"message": "Error receiving user and password", "status": "400"})

        const ambiente = req.query.target as string
        if(!ambiente)
            return res.status(404).json({"message": "Error receiving target in query (dev, test, prod)", "status": "400"})

        const xml2js = require('xml2js');
        const xml2jsBuilder = new xml2js.Builder();
        const supplierInvoice = Buffer.from(xml2jsBuilder.buildObject(req.body), 'utf8').toString('base64')

        if(ambiente !== "test" && ambiente !== "dev" && ambiente !== "prod")
            return res.status(404).json({"message": "Error receiving target in query, must be: 'dev', 'test' or 'prod'", "status": "400"})

        // Ambiente de desarrollo
        let bydUsername = usuario || process.env.BYDUSERNAME || 'CLXT555'
        let bydPassword = clave || process.env.BYDPASSWORD || 'Inicio01'
        let oDataUrl = process.env.ODATAURL || 'https://my343967.sapbydesign.com/sap/byd/odata/cust/v1/zcl_managemonitorfel/ZBO_MonitorFELRootCollection'

        // Ambiente de test
        if(ambiente === "test") {
            bydUsername = usuario || "SEIDORFUNCIONAL"
            bydPassword = clave || "Seidor2022"
            oDataUrl = process.env.ODATAURL || "https://my356943.sapbydesign.com/sap/byd/odata/cust/v1/zcl_managemonitorfel/ZBO_MonitorFELRootCollection"
        }

        if(ambiente === "prod") {
            bydUsername = usuario || "SEIDORFUNCIONAL"
            bydPassword = clave || "EUW/K4HAlTCil1"
            oDataUrl = process.env.ODATAURL || "https://my428579.businessbydesign.cloud.sap/sap/byd/odata/cust/v1/zcl_managemonitorfel/ZBO_MonitorFELRootCollection"
        }

        if(!supplierInvoice)
            return res.status(404).json({"message": "Error receiving supplier invoice in body", "status": "400"})

        console.log(supplierInvoice)

        const { status, message, responseToken, responseCookies } = await GetTokenFromByD(oDataUrl, bydUsername, bydPassword)

        if(status !== 200)
            return res.status(status).json({message})
    
        const supplierInvoiceCreationResponse = await SendSupplierInvoiceInMonitorFEL(oDataUrl, responseToken, responseCookies, bydUsername, bydPassword, supplierInvoice)

        if(supplierInvoiceCreationResponse.status !== 200)
            return res.status(supplierInvoiceCreationResponse.status).json(supplierInvoiceCreationResponse)

        return res.status(200).json(supplierInvoiceCreationResponse)
    } catch (error) {   
        console.error(error)
        res.json(error)
    }
}