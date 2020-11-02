const router = require('express').Router();
const multer = require("multer");
const productController = require('./controller');
const os = require('os');

router.post('/products', multer({dest : os.tmpdir()}).single('image'),productController.store);
router.get('/products', productController.index);
router.put('/product/:id', multer({dest : os.tmpdir()}).single('image'), productController.update);
router.delete('/product/:id', productController.destroy);

module.exports = router;