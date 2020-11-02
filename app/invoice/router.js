const router = require("express").Router();

const InvoiceController = require('../invoice/controller');

router.get("/invoices/:order_id", InvoiceController.show);

module.exports = router;