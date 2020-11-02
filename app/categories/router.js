const router = require("express").Router();
const multer = require("multer");
const CategoryController = require("./controller");

router.post("/categories", multer().none(), CategoryController.store);
router.put("/category/:id", multer().none(), CategoryController.update);
router.delete("/category/:id", multer().none(), CategoryController.destroy);

module.exports = router;