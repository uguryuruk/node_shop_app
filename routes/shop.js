const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

//ana sayfa
router.get("/", shopController.getIndex);
//ürünler
router.get("/products", shopController.getProducts);
//belirli bir ürün detayı
router.get("/products/:productid", shopController.getProduct);
//belirli bir kategori detayı
router.get("/categories/:categoryid", shopController.getProductsByCategoryId);
//sepet
router.get("/cart", shopController.getCart);
//sepete ekleme
router.post("/cart", shopController.postCart);
//sepetten silme
router.post("/delete-cartitem", shopController.postCartItemDelete);
//siparişler
router.get("/orders", shopController.getOrders);
//sipariş oluşturma
router.post("/create-order", shopController.postOrder);

module.exports = router;
