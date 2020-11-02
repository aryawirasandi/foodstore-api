const router = require("express").Router();
const regionController = require("./controller");

router.get("/wilayah/provinsi", regionController.getProvince);
router.get("/wilayah/kabupaten", regionController.getRegencies);
router.get("/wilayah/kecamatan", regionController.getDistrict);
router.get("/wilayah/desa", regionController.getVillage);

module.exports = router;