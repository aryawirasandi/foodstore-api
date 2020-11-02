var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const productRouter = require("./app/products/router");
const categoryRouter = require("./app/categories/router");
const tagRouter = require("./app/tag/router")
const authRouter = require("./app/auth/router");
const regionRouter = require("./app/regions/router");
const deliveryRouter = require("./app/deliver-address/router");
const cartRouter = require("./app/cart/router");
const orderRouter = require("./app/order/router");
const invoiceRouter = require("./app/invoice/router");
const cors = require("cors");
const { decodeToken } = require("./app/auth/middleware");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(decodeToken());
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", tagRouter);


// authentication
app.use('/auth', authRouter);

// api for regions 
app.use("/api", regionRouter);

// api for carts 
app.use("/api", cartRouter);

// api for deliver address
app.use("/api", deliveryRouter);

// api for order
app.use("/api", orderRouter);

// api for invoice router
app.use("/api", invoiceRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
