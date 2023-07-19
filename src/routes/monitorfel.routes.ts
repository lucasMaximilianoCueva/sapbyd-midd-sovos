import { Router } from "express"
import { PostSupplierInvoiceInMonitorFEL } from "../controllers/monitorfel.controller"

const router = Router()

router.post('/api/byd/sendSupplierInvoice', PostSupplierInvoiceInMonitorFEL)
router.get('/api/byd/sendSupplierInvoice', PostSupplierInvoiceInMonitorFEL)

export default router 