const Product = require("../models/product");
const Category = require("../models/category");

//list products
exports.getProducts = (req, res, next) => {
  //softDelete e göre şekillendir.
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        title: "Admin Products",
        products: products,
        path: "/admin/products",
        action: req.query.action,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
//add product open page
exports.getAddProduct = (req, res, next) => {
  Category.findAll().then((categories) => {
    res.render("admin/add-product", {
      title: "New Product",
      path: "/admin/add-product",
      categories: categories,
    });
  });
};
//add a new product
exports.postAddProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const categoryid = req.body.categoryid;
  const user = req.user;

  user
    .createProduct({
      name: name,
      price: price,
      imageUrl: imageUrl,
      description: description,
      categoryId: categoryid,
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
//edit product open page
exports.getEditProduct = (req, res, next) => {
  Product.findByPk(req.params.productid)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      Category.findAll()
        .then((categories) => {
          res.render("admin/edit-product", {
            title: "Edit Product",
            path: "/admin/products",
            product: product,
            categories: categories,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const categoryid = req.body.categoryid;

  Product.findByPk(id)
    .then((product) => {
      product.name = name;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      product.categoryId = categoryid;
      return product.save();
    })
    .then((result) => {
      console.log("updated");
      res.redirect("/admin/products?action=edit");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productid;
  //soft delete e dönüştür.
  Product.findByPk(id)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("product has been deleted.");
      res.redirect("/admin/products?action=delete");
    })
    .catch((err) => {
      console.log(err);
    });
};

//categories
//list categories

exports.getCategories = (req, res, next) => {
  Category.findAll()
    .then((categories) => {
      res.render("admin/categories", {
        title: "Admin Categories",
        categories: categories,
        path: "/admin/categories",
        action: req.query.action,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//add category open page
exports.getAddCategory = (req, res, next) => {
  res.render("admin/add-category", {
    title: "New Category",
    path: "/admin/add-category",
  });
};
//add a new category
//FIXED user.createCategory is not a function: user id eşleştirmesi yapıldı.
exports.postAddCategory = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const user = req.user;

  user
    .createCategory({
      name: name,
      description: description,
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

//edit category open page
exports.getEditCategory = (req, res, next) => {
  Category.findByPk(req.params.categoryid)
    .then((category) => {
      if (!category) {
        return res.redirect("/");
      }
      res
        .render("admin/edit-category", {
          title: "Edit Category",
          path: "/admin/edit-category",
          category: category,
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
