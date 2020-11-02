const config = require("../config");
const Product = require("./model");
const Category = require("../categories/model");
const Tag = require("../tag/model");
const path = require("path");
const fs = require("fs");
const { policyFor } = require("../policy");


async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0, q = '', category = '', tags = [] } = req.query;
    let criteria = {};
    // check if there is value from query string q
    if(q.length){
      criteria = { ...criteria, name : { $regex : `${q}`, $options: 'i' } }
    }
    // check if there is value from category 
    if(category.length){
      category = await Category.findOne({name: {$regex: `${category}`, $options: 'i'}});
      
      if(category){
        criteria = { ...criteria, category : category._id }
      }
    }
    // check if there is tags 
    if(tags.length){
      tags = await Tag.find({name : { $in : tags }})
      criteria = { ...criteria, tags : { $in : tags.map(tag => tag._id) } }
    }

    let count = await Product.find(criteria).countDocuments();

    let products = await Product.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('category')
      .populate('tags');
    return res.json({
      products,
      count
    });
  } catch (error) {
    next(error);
  }
}

async function store(req, res, next) {
  try {
    let payload = req.body;
        // cek policy 
    let policy = policyFor(req.user);
    if(!policy.can('create', 'Product')){
      return res.json({
        error : 1,
        message : 'Anda tidak memiliki hak akses untuk membuat produk'
      })
    }
    
    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if(payload.tags && payload.tags.length){
      let tags = await Tag.find({ name : { $in: payload.tags }});
      if(tags.length){
        payload = {...payload, tags : tags.map(tag => tag._id)}
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/uploads/${filename}`
      );
      let src = fs.createReadStream(tmp_path);
      let dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on("end", async () => {
        let product = new Product({ ...payload, image_url: filename });
        await product.save();
        return res.json(product);
      });
      src.on("error", async (error) => {
        next(error);
      });
    } else {
      let product = new Product(payload);

      await product.save();

      return res.json(product);
    }
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

async function update(req, res, next) {
  try {
    let payload = req.body;

    // cek policy 
    let policy = policyFor(req.user);
    if(!policy.can('update', 'Product')){
      return res.json({
        error : 1,
        message : 'Anda tidak memiliki hak akses untuk mengupdate produk'
      })
    }

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if(payload.tags && payload.tags.length){
      let tags = await Tag.find({name : { $in : payload.tags }});
      if(tags.length){
        payload = {...payload, tags : tags.map(tag => tag._id)}
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/uploads/${filename}`
      );
      let src = fs.createReadStream(tmp_path);
      let dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on("end", async () => {
        let product = await Product.findOne({ _id: req.params.id });
        let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

        // is there current image ?
        if (fs.existsSync(currentImage)) {
          fs.unlink(currentImage);
        }

        // after remove then update product data
        product = await Product.findOneAndUpdate(
          { _id: req.params.id },
          { ...payload, image_url: filename },
          { new: true, runValidators: true }
        );
        return res.json(product);
      });
      src.on("error", async (error) => {
        next(error);
      });
    } else {
      product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true }
      );

      return res.json(product);
    }
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

async function destroy(req, res, next) {
  try {
    let product = await Product.findOne({ _id: req.params.id });
    // cek policy 
    let policy = policyFor(req.user);
    if(!policy.can('delete', 'Product')){
      return res.json({
        error : 1,
        message : 'Anda tidak memiliki hak akses untuk menghapus produk'
      })
    }
    if (product) {
      product = await Product.deleteOne({ _id: req.params.id });
      let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }
      return res.json({
        status: "success",
        data: product,
      });
    } else {
      return res.json({
        status: "failed",
        data: [],
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  store,
  update,
  destroy,
};
