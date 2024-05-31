const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const userRoutes = require("../Routes/UserRouter");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dbConnect = require("../config/db");
const path = require('path');


app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
dbConnect();
app.use(express.static('public'))
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'Views'));

app.get("/admin", (req, res) => {
  res.render('index')
});

app.get("/admin/pos", (req, res) => {
  res.render('pos')
});

app.get("/admin/verify-offline-payment/pending", (req, res) => {
  res.render('verify-offline-payment_pending')
});
app.get("/admin/verify-offline-payment/denied", (req, res) => {
  res.render('verify-offline-payment_denied')
});

app.get("/admin/pos/orders", (req, res) => {
  res.render('posOrder')
});

app.get("/admin/orders/list/all", (req, res) => {
  res.render('Order/All_order')
});

app.get("/admin/orders/list/pending", (req, res) => {
  res.render('Order/Pending_order')
});

app.get("/admin/orders/list/confirmed", (req, res) => {
  res.render('Order/Confirmed_order')
});
app.get("/admin/orders/list/processing", (req, res) => {
  res.render('Order/Processing_order')
});

app.get("/admin/orders/list/processing", (req, res) => {
  res.render('Order/Processing_order')
});

app.get("/admin/orders/list/delivered", (req, res) => {
  res.render('Order/Delivered_order')
});

app.get("/admin/orders/list/returned", (req, res) => {
  res.render('Order/Returned_order')
});

app.get("/admin/orders/list/failed", (req, res) => {
  res.render('Order/Failed_order')
});

app.get("/admin/orders/list/canceled", (req, res) => {
  res.render('Order/Canceled_order')
});

app.get("/admin/orders/list/processing", (req, res) => {
  res.render('Order/Processing_order')
});

app.get("/admin/orders/list/out_for_delivery", (req, res) => {
  res.render('Order/Out_For_Delivered_order')
});

app.get("/admin/category/add", (req, res) => {
  res.render('Category/Category_add')
});

app.get("/admin/category/add-sub-category", (req, res) => {
  res.render('Category/Sub_category_add')
});
// Product

app.get("/admin/attribute/add-new", (req, res) => {
  res.render('Products/Add_product-Attributes')
});

app.get("/admin/product/list", (req, res) => {
  res.render('Products/List_product')
});
app.get("/admin/product/add-new", (req, res) => {
  res.render('Products/Add_product')
});
app.get("/admin/product/:id", (req, res) => {
  res.render('Products/Edit_product')
});
app.get("/admin/product/bulk-export-index", (req, res) => {
  res.render('Products/Bulk_Export_product')
});
app.get("/admin/product/bulk-import", (req, res) => {
  res.render('Products/Bulk_Upload_product')
});
app.get("/admin/product/limited-stock", (req, res) => {
  res.render('Products/Limited_Stock_products')
});
app.get("/admin/banner/add-new", (req, res) => {
  res.render('Banner/index')
});
app.get("/admin/category/edit/:id", (req, res) => {
  res.render('Category/Category_edit')
});
app.get("/admin/category/edit-sub/:id", (req, res) => {
  res.render('Category/Sub_category_edit')
});

app.get("/", (req, res) => {
  res.status(200).json([{"message":"Hii Vipin Nagar@",status:true}]); // Sending an empty JSON object
  // res.render('Auth/login')
});

app.get("/test", (req, res) => {
  res.render('test')
});
app.use("/api/v1", userRoutes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Increase timeout duration
server.timeout = 60000; // 60 seconds