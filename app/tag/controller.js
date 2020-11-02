const Tag = require("./model");

async function store(req, res, next) {
  try {
    let payload = req.body;
    let policy = policyFor(req.user);
    if (!policy.can("create", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki hak akses untuk membuat tag",
      });
    }
    let tag = new Tag(payload);

    await tag.save();

    return res.json(tag);
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
    if(!policy.can('update', 'Tag')){
      return res.json({
        error : 1,
        message : 'Anda tidak memiliki hak akses untuk mengupdate tag'
      })
    }
    let tag = await Tag.findOneAndUpdate({ _id: req.params.id }, payload, {
      new: true,
      runValidators: true,
    });

    return res.json(tag);
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
    if(!policy.can('delete', 'Tag')){
      return res.json({
        error : 1,
        message : 'Anda tidak memiliki hak akses untuk menghapus tag'
      })
    }
    let deleted = await Tag.findOneAndDelete({ _id: req.params.id });

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
