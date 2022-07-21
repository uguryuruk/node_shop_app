const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");
//MVC ye göre biraz daha detaylı
//route isteklerine göre gerekli controllerı döndürür.
//ürünleri listeleme
router.get("/products", adminController.getProducts);
//ürün ekleme ilk ekran
router.get("/add-product", adminController.getAddProduct);
//ürün ekleme kaydetme işlemi
router.post("/add-product", adminController.postAddProduct);
//belirli bir ürünün detayı
router.get("/products/:productid", adminController.getEditProduct);
//belirli bir ürün güncelleme
router.post("/products", adminController.postEditProduct);
//ürün silme
router.post("/delete-product", adminController.postDeleteProduct);

//kategori listeleme
router.get("/categories", adminController.getCategories);
//kategori ekleme ilk ekran
router.get("/add-category", adminController.getAddCategory);
//kategori ekleme kaydetme işlemi
router.post("/add-category", adminController.postAddCategory);
//belirli bir kategorinin detayı
router.get("/categories/:categoryid", adminController.getEditCategory);
// //belirli bir kategori güncelleme
// router.post("/categories", adminController.postEditCategory);
// //kategori silme
// router.post("/delete-category", adminController.postDeleteCategory);
module.exports = router;
