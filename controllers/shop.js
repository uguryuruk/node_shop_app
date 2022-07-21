const Product = require("../models/product");
const Category = require("../models/category");

exports.getIndex = (req, res, next) => {
  //tüm ürünleri ve kategorileri listeler:

  //shop/index sayfasını döndürür,
  Product.findAll({
    attributes: ["id", "name", "price", "imageUrl"], // önce veri tabanından ürünleri çeker
  })
    .then((products) => {
      //sonra bunları yakalar, kategorileri çeker.
      Category.findAll()
        .then((categories) => {
          res.render("shop/index", {
            //ürün ve kategorileri sayfaya aktarır.
            title: "Shopping",
            products: products,
            categories: categories,
            path: "/",
          });
        })
        .catch((err) => {
          console.log(err); //merkezi bir yerden olmuyor mu?
        });
    })
    .catch((err) => {
      console.log(err); //TODO logging dosyası veya tablosuna yazdır.
    });
};

exports.getProducts = (req, res, next) => {
  //ürün listeleme
  Product.findAll({
    attributes: ["id", "name", "price", "imageUrl"],
    //tüm ürünleri sorgular
  })
    .then((products) => {
      // ürünler gelince kategorileri alır.
      //yukarıdakinden farkı aşağıdak kategoriye göre filtrelemede kullanılıyor.
      Category.findAll()
        .then((categories) => {
          res.render("shop/products", {
            title: "Products",
            products: products,
            categories: categories,
            path: "/",
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

exports.getProductsByCategoryId = (req, res, next) => {
  const categoryid = req.params.categoryid; //urlden gelen id
  const model = [];

  Category.findAll()
    .then((categories) => {
      //önce gelen kategorileri yakaladı
      model.categories = categories;
      const category = categories.find((i) => i.id == categoryid); //istenen kategori
      return category.getProducts(); //burada kategoriye uygun ürün döndürüyor
    })
    .then((products) => {
      //gelen ürünleri yakalayıp sayfaya yansıtıyor.
      res.render("shop/products", {
        title: "Products",
        products: products,
        categories: model.categories,
        selectedCategory: categoryid,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  //belli bir ürün
  Product.findAll({
    attributes: ["id", "name", "price", "imageUrl", "description"],
    where: { id: req.params.productid }, //url den gelen id
  })
    .then((products) => {
      //tek bir tane dönmesi beklense de, gelenlerin ilkini almış.
      res.render("shop/product-detail", {
        title: products[0].name,
        product: products[0],
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  // önce kullanıcıyı buluyor.
  //anlamadım- kendi içinde kendini çağırıyor.
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          console.log(products);

          res.render("shop/cart", {
            title: "Cart",
            path: "/cart",
            products: products,
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

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let quantity = 1;
  let userCart;
  //gelen ürün id sine göre başta miktarı 1 alıyor.
  req.user
    .getCart()
    .then((cart) => {
      //sepette olan ürünleri getiriyor.
      userCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;

      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        //eklenen ürün zaten varsa, sayısını 1 arttırıyor.
        quantity += product.cartItem.quantity;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      //anlamadım
      userCart.addProduct(product, {
        through: {
          quantity: quantity,
        },
      });
    })
    .then(() => {
      //sepete yönlendiriyor.
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartItemDelete = (req, res, next) => {
  const productid = req.body.productid;

  req.user
    .getCart()
    .then((cart) => {
      //gelen ürünlerden seçili ürünü buluyor.
      return cart.getProducts({ where: { id: productid } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log(orders);
      //siparişleri listeliyor.
      res.render("shop/orders", {
        title: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let userCart;
  req.user
    .getCart()
    .then((cart) => {
      //sepetteki ürünleri getirir.
      userCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            //siparişe, sepetteki ürünleri ekliyor.
            products.map((product) => {
              product.orderItem = {
                quantity: product.cartItem.quantity,
                price: product.price,
              };
              return product;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => {
      userCart.setProducts(null);
      //sepeti boşaltıyor.
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
