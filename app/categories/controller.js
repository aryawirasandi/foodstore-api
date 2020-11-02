const Category = require("./model");

async function store(req, res, next) {
  try {
    let payload = req.body;
    let policy = policyFor(req.user);
    if (!policy.can("create", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki hak akses untuk membuat category",
      });
    }
    let category = new Category(payload);

    await category.save();

    return res.json(category);
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
    let policy = policyFor(req.user);
    if(!policy.can('update', 'Category')){
      return res.json({
        error : 1,
        message : 'Anda tidak memiliki hak akses untuk mengupdate category'
      })
    }
    let category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      { new: true, runValidators: true }
    );

    return res.json(category);
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
    let policy = policyFor(req.user);
    if(!policy.can('delete', 'Category')){
      return res.json({
        error : 1,
        message : 'Anda tidak memiliki hak akses untuk menghapus category'
      })
    }

    let deleted = await Category.findOneAndDelete({ _id: req.params.id });

    return res.json(deleted);
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

module.exports = {
  store,
  update,
  destroy,
};
