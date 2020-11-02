const router = require("express").Router();
const multer = require('multer');
const addresController = require("./controller");

router.post("/delivery-addresses", multer().none(), addresController.store);
router.put("/delivery-adddresses/:id", multer().none(), addresController.update);
router.delete('/delivery-addresses/:id', addresController.destroy);
router.get("/delivery-addresess", addresController.index);

module.exports = router;