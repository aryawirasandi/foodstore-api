const mongoose = require("mongoose");
const Order = require("./model");
const OrderItem = require("../order-item/model");
const DeliveryStatus = require("../deliver-address/model");
const { policyFor } = require("../policy");
const { subject } = require("@casl/ability");
const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../deliver-address/model");

async function index(req, res, next){
  let policy = policyFor(req.user);
  if(!policy.can('view', 'Order')){
      return res.json({
        error : 1,
        message : 'Anda tidak memiliki hak akses untuk melihat produk'
      })
  }
  try {
    let { limit = 10, skip = 0 } = req.query;
    let count =  await Order
                      .find({user : req.user._id})
                      .countDocuments()
    let orders = await Order
                      .find({user : req.user._id})
                      .limit(parseInt(limit))
                      .skip(parseInt(skip))
                      .populate('order_items')
                      .sort('-createdAt')
    return res.json({
      data : orders.map(order => order.toJSON({ virtuals: true })),
      count
    })
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
async function store(req, res, next){
        // cek policy 
    let policy = policyFor(req.user);
    if(!policy.can('create', 'Product')){
      return res.json({
        error : 1,
        message : 'Anda tidak memiliki hak akses untuk membuat produk'
      })
    }

    try {
        // dapatka delivery fee dan delivery address
        let { delivery_fee, delivery_address } = req.body;
        let items = await CartItem
                          .find({ user : req.user._id })
                          .populate('product');
        if(!items.length){
          return res.json({
            error : 1,
            message : `Can't create order because you have no items in cart`
          });
        }

        let address = await DeliveryAddress.findOne({_id : delivery_address});
        let order = new Order({
          _id : new mongoose.Types.ObjectId(),
          status : 'waiting_payment',
          delivery_fee,
          delivery_address: {
            provinsi : address.provinsi,
            kabupaten : address.kabupaten,
            kecamatan : address.kecamatan,
            kelurahan : address.kelurahan,
            detail : address.detail
          },
          user : req.user._id
        });

        let orderItem = await OrderItem
                              .insertMany(
                                items.map(item => ({
                                  ...item,
                                  name : item.product.name,
                                  qty : parseInt(item.qty),
                                  price : parseInt(item.product.price),
                                  order : order._id,
                                  product : item.product._id
                                })
                              ))
        orderItem.forEach(item => order.order_item.push(item));
        await order.save();
        await CartItem.deleteMany({user : req.user._id});
        return res.json(order);
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
    index
}