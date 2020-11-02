const router = require("express").Router();
const TagController = require("./controller");
const multer = require("multer");

router.post("/tags", multer().none(), TagController.store);
router.put("/tag/:id", multer().none(), TagController.update);
router.delete("/tag/:id", multer().none(), TagController.destroy);

module.exports = router;