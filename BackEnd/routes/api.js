var express = require('express');
var router = express.Router();
//connect db
const connectDb = require('../models/db');
const bcrypt = require("bcrypt")
const multer = require('multer');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
const { log } = require('console');
require('dotenv').config();



//Thiết lập nơi lưu trữ và tên file
let storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
//Kiểm tra file upload
function checkFileUpLoad(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Bạn chỉ được upload file ảnh'));
  }
  cb(null, true);
}
//Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad })


//get hot pro
router.get('/products/hot', async (req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');

  const products = await productsCollection.find({ bestSeller: 1 }).toArray();
  if (products) {
    res.status(200).json(products);
    //res.render('productAPI', { products });
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm nào có trạng thái hot'
    });
  }
});
//show pro
router.get('/products', async (req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const products = await productsCollection.find().toArray();
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm hehe'
    })
  }
});
router.get('/products/:id', async (req, res, next) => {
  var id = req.params.id;
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const product = await productsCollection.findOne({ id: parseInt(id) });
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm nào cạ'
    })
  }
});
//add pro
router.post('/products/add', upload.single('img'), async (req, res, next) => {
  try {
    let db = await connectDb();
    let productsCollection = db.collection("products");

    let name = req.body.name;
    let price = req.body.price;
    let img = req.body.img;
    let description = req.body.description;
    let category_id = req.body.category_id;
    let lastProduct = await productsCollection.find().sort({ id: -1 }).limit(1).toArray();
    let bestSeller = req.body ? 0 : 1;
    let id = lastProduct[0] ? lastProduct[0].id + 1 : 1;
    let addProduct = { id, name, price, category_id: parseInt(category_id), img, description, bestSeller };
    await productsCollection.insertOne(addProduct);
    if (addProduct) {
      res.status(200).json(addProduct);
    } else {
      res.status(404).json({
        message: 'Không thêm được'
      })
    }
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào MongoDB:', error); // Thêm lệnh console.log để ghi lại lỗi
    res.status(500).json({
      message: 'Đã xảy ra lỗi khi thêm sản phẩm'
    });
  }
});

//edit pro
router.patch('/products/:id', upload.single('img'), async (req, res, next) => {
  let db = await connectDb();
  let productsCollection = db.collection("products");
  let id = req.params.id;
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description;
  let category_id = req.body.category_id;
  if (req.body) {
    var img = req.body.img;
  } else {
    let products = await productsCollection.findOne({ id: parseInt(id) });
    var img = products.img;
  }
  let editProduct = { name, price, category_id: parseInt(category_id), img, description };
  product = await productsCollection.updateOne({ id: parseInt(id) }, { $set: editProduct });
  if (editProduct) {
    res.status(200).json(editProduct);
  } else {
    res.status(404).json({
      message: 'Không thêm đc'
    })
  }
});
//delete pro
router.delete('/products/:id', async (req, res, next) => {
  let id = req.params.id;
  let db = await connectDb();
  let productsCollection = db.collection("products");
  let product = await productsCollection.deleteOne({ id: parseInt(id) });
  if (product) {
    res.status(200).json({ message: 'xóa ngon lành' });
  } else {
    res.status(404).json({ message: 'chịu chịu' });
  }
});
//------------------------------------------------------------------------
//show cate
router.get('/categories', async (req, res, next) => {
  const db = await connectDb();
  const categoriesCollection = db.collection('categories');
  const categories = await categoriesCollection.find().toArray();
  if (categories) {
    res.status(200).json(categories);
  } else {
    res.status(404).json({
      message: 'Không tìm thấy danh mục'
    })
  }
});
router.get('/categories/:id', async (req, res, next) => {
  var id = req.params.id;
  const db = await connectDb();
  const categoriesCollection = db.collection('categories');
  const category = await categoriesCollection.findOne({ id: parseInt(id) });
  if (category) {
    res.status(200).json(category);
  } else {
    res.status(404).json({
      message: 'Không tìm thấy danh mục'
    })
  }
});
//add cate
router.post('/categories/add', authenticateToken, upload.single('img'), async (req, res, next) => {
  let db = await connectDb();
  let categoriesCollection = db.collection("categories");

  let name = req.body.name;
  let img = req.body ? req.body.img : "";
  let status = req.body.status;
  let lastCategory = await categoriesCollection.find().sort({ id: -1 }).limit(1).toArray();
  let id = lastCategory[0] ? lastCategory[0].id + 1 : 1;
  let addCategory = { id, name, img, status };
  await categoriesCollection.insertOne(addCategory);
  if (addCategory) {
    res.status(200).json(addCategory);
  } else {
    res.status(404).json({
      message: 'Không thêm đc'
    })
  }
});
//edit cate
router.patch('/categories/:id', upload.single('img'), async (req, res, next) => {
  let db = await connectDb();
  let categoriesCollection = db.collection("categories");

  let id = req.params.id;
  let name = req.body.name;
  let status = req.body.status;
  if (req.body) {
    var img = req.body.img;
  } else {
    let categories = await categoriesCollection.findOne({ id: parseInt(id) });
    var img = categories.img;
  }
  let editCategories = { name, img, status };
  product = await categoriesCollection.updateOne({ id: parseInt(id) }, { $set: editCategories });
  if (editCategories) {
    res.status(200).json(editCategories);
  } else {
    res.status(404).json({
      message: 'Không sửa đc'
    })
  }
});
//delete cate
router.delete('/categories/:id', async (req, res, next) => {
  let id = req.params.id;
  let db = await connectDb();
  let categoriesCollection = db.collection("categories");
  let category = await categoriesCollection.deleteOne({ id: parseInt(id) });
  if (category) {
    res.status(200).json({ message: 'xóa ngon lành' });
  } else {
    res.status(404).json({ message: 'chịu chịu' });
  }
});
//-------------------------------------------------------
//show user
router.get('/users', async (req, res, next) => {
  const db = await connectDb();
  const usersCollection = db.collection('users');
  const users = await usersCollection.find().toArray();
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({
      message: 'Không tìm thấy người dùng'
    })
  }
});
router.get('/users/:id', async (req, res, next) => {
  var id = req.params.id;
  const db = await connectDb();
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ id: parseInt(id) });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({
      message: 'Không tìm thấy người dùng'
    })
  }
});
//add user
router.post('/users/add', upload.single('img'), async (req, res) => {
  try {
    let db = await connectDb();
    let usersCollection = db.collection("users");

    let { name, email, password, phone, address } = req.body;
    let img = req.file ? req.file.filename : "null";
    let isAdmin = req.body.isAdmin ? parseInt(req.body.isAdmin) : 0;

    // Check if the email already exists
    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Get the last user id and increment by 1
    let lastUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
    let id = lastUser.length > 0 ? lastUser[0].id + 1 : 1;

    let newUser = { id, name, email, password: hashedPassword, img, phone, address, isAdmin };

    // Insert the new user
    await usersCollection.insertOne(newUser);

    // Send the new user data as response
    return res.status(200).json(newUser);
  } catch (error) {
    console.error('Error during user registration', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

// Middleware kiểm tra token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log('error', err);
    console.log('user', user);
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Token hết hạn, làm mới token
        refreshToken(req, res, next);
      } else {
        return res.sendStatus(403);
      }
    } else {
      req.user = user;
      next();
    }
  });
}

function refreshToken(req, res, next) {
  const refreshToken = req.cookies['refreshToken'];
  console.log('refresh token cookie >>> ', refreshToken);
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    console.log('errorrrr', err);
    console.log('userrrrr', user);
    if (err) {
      console.log('Token verification error:', err);
      return res.sendStatus(403);
    } else {
      req.user = user;
      console.log('user:', req.user);
      // Tạo access token mới
      const accessToken = jwt.sign(
        { name: user.name, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
      );
      console.log('new access token:', accessToken);

      // Lưu access token mới vào localStorage
      res.locals.accessToken = accessToken;

      next();
    }
  });
}


//login

router.post('/users/login', upload.single('img'), async (req, res) => {
  try {
    const db = await connectDb();
    const usersCollection = db.collection("users");

    const { email, password } = req.body;

    // Check for missing email or password
    if (!email || !password) {
      return res.status(400).send('Email và mật khẩu là bắt buộc');
    }

    const existingUser = await usersCollection.findOne({ email });

    if (!existingUser) {
      return res.status(400).send('Email hoặc mật khẩu không chính xác');
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(400).send('Email hoặc mật khẩu không chính xác');
    }

    const userInfo = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      img: existingUser.img,
      isAdmin: existingUser.isAdmin
    };

    // Create access token
    const accessToken = jwt.sign(
      { name: userInfo.name, email: userInfo.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { name: userInfo.name },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    console.log('access:', accessToken);
    console.log('refresh:', refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ accessToken, user: userInfo });

  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).send('Đã xảy ra lỗi trong quá trình đăng nhập');
  }
});



//cấu hình nodemailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/forgotPass', async function (req, res, next) {
  try {
    const { forgot_email } = req.body;

    if (!forgot_email) {
      return res.status(400).json({ error: 'Email là bắt buộc' });
    }

    console.log('Email nhận được để đặt lại mật khẩu:', forgot_email);

    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log('Token đặt lại mật khẩu được tạo:', resetToken);

    const db = await connectDb();
    const result = await db.collection('users').updateOne(
      { email: forgot_email },
      { $set: { resetToken } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Không tìm thấy email' });
    }

    const mailOptions = {
      from: 'nam232004@gmail.com',
      to: forgot_email,
      subject: `Đặt lại mật khẩu cho ${forgot_email}`,
      text: 'Có cái mật khẩu cũng quên: http://localhost:4200/#/account/changePass/' + resetToken
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Lỗi khi gửi email:', error);
        res.status(500).json({ error: 'Lỗi khi gửi, thử lại sau' });
      } else {
        console.log('Email đã được gửi:', info.response);
        res.status(200).json({ message: 'Đã gửi, kiểm tra email của bạn' });
      }
    });
  } catch (error) {
    console.error('Lỗi máy chủ:', error.message);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});
// router.get('/forgotPass', async (req, res) => {
//   res.render('forgotPass');
// });

// router.get('/changePass/:token', async (req, res) => {
//   const resetToken = req.params.token;
//   try {
//     // Tìm user
//     const db = await connectDb();
//     const user = await db.collection('users').findOne({ resetToken: resetToken });

//     if (!user) {
//       return res.status(400).send('Người dùng không tồn tại');
//     }

//     res.render('resetPass', { token: resetToken });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server Error');
//   }
// });

router.post('/changePass/:token', async (req, res) => {
  const resetToken = req.params.token;
  const newPassword = req.body.new_password;
  try {
    // Kết nối tới cơ sở dữ liệu
    const db = await connectDb();
    // find user by token
    const user = await db.collection('users').findOne({ resetToken: resetToken });

    if (!user) {
      return res.status(400).send('Token không hợp lệ hoặc đã hết hạn');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update new pass and unset token in db
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword }, $unset: { resetToken: '' } }
    );

    // res.redirect('/');
  } catch (error) {
    console.error('Lỗi máy chủ:', error.message);
    res.status(500).send('Lỗi máy chủ');
  }
});

//edit users
router.put('/users/:id', upload.single('img'), async (req, res, next) => {
  let db = await connectDb();
  let usersCollection = db.collection("users");
  let id = req.params.id;
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let phone = req.body.phone;
  let address = req.body.address;
  let isAdmin = parseInt(req.body.isAdmin);
  if (req.file) {
    var img = req.file.originalname;
  } else {
    let users = await usersCollection.findOne({ id: parseInt(id) });
    var img = users.img;
  }
  let editUsers = { name, email, password, img, phone, address, isAdmin };
  user = await usersCollection.updateOne({ id: parseInt(id) }, { $set: editUsers });
  if (editUsers) {
    res.status(200).json(editUsers);
  } else {
    res.status(404).json({
      message: 'Không thêm đc'
    })
  }
});
//delete pro
router.delete('/users/:id', async (req, res, next) => {
  let id = req.params.id;
  let db = await connectDb();
  let usersCollection = db.collection("users");
  let user = await usersCollection.deleteOne({ id: parseInt(id) });
  if (user) {
    res.status(200).json({ message: 'xóa ngon lành' });
  } else {
    res.status(404).json({ message: 'chịu chịu' });
  }
});
//-------------------------------------------------------

//get pro by cata id
router.get('/products/categoryId/:id', async (req, res, next) => {
  var id = req.params.id;
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const products = await productsCollection.find({ category_id: parseInt(id) }).toArray();
  if (products) {
    res.status(200).json(products);
    //res.render('productAPI', { products });
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm'
    });
  }
});

//get pro by cata name
router.get('/products/categoryName/:name', async (req, res, next) => {
  const name = req.params.name;
  const db = await connectDb();
  const categoriesCollection = db.collection('categories');

  const category = await categoriesCollection.findOne({ name: name });

  if (!category) {
    res.status(404).json({
      message: 'Danh mục không tồn tại'
    });
    return;
  }

  const categoryId = category.id;

  const productsCollection = db.collection('products');
  const products = await productsCollection.find({ category_id: categoryId }).toArray();

  if (products.length > 0) {
    res.status(200).json(products);
    //res.render('productAPI', { products });
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm trong danh mục này'
    });
  }
});

//get pro by page and limit
router.get('/products/page/:page/limit/:limit', async (req, res, next) => {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const products = await productsCollection.find().skip((page - 1) * limit).limit(limit).toArray();
  if (products) {
    res.status(200).json(products);
    //res.render('productAPI', { products });
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm'
    });
  }
});

// search products by name
router.get('/products/search/:name', async (req, res, next) => {
  const name = req.params.name.toLowerCase(); // Chuyển tên về chữ thường
  const db = await connectDb();
  const productsCollection = db.collection('products');

  // Tìm kiếm sản phẩm bằng cách sử dụng $regex để tìm gần đúng
  const products = await productsCollection.find({
    name: { $regex: new RegExp(name, 'i') } // 'i' để tìm không phân biệt chữ hoa chữ thường
  }).toArray();

  if (products.length > 0) {
    res.status(200).json(products);
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm với tên này'
    });
  }
});


//get pro sort asc price and limit
router.get('/products/sort/asc/limit/:number', async (req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const number = parseInt(req.params.number);
  const products = await productsCollection.find().sort({ price: 1 }).limit(number).toArray();
  if (products) {
    res.status(200).json(products);
    //res.render('productAPI', { products });
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm'
    });
  }
});

//get pro sort desc price and limit
router.get('/products/sort/desc/limit/:number', async (req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const number = parseInt(req.params.number);
  const products = await productsCollection.find().sort({ price: -1 }).limit(number).toArray();
  if (products) {
    res.status(200).json(products);
    //res.render('productAPI', { products });
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm'
    });
  }
});
//filter by price
router.get('/products/filter/:price-:lastPrice', async (req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const price = parseInt(req.params.price);
  const lastPrice = parseInt(req.params.lastPrice);
  const products = await productsCollection.find({ price: { $gte: price, $lte: lastPrice } }).toArray();
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404).json({
      message: 'Không tìm thấy sản phẩm'
    });
  }
});


//get Bills
router.get('/bills', async (req, res, next) => {
  const db = await connectDb();
  const billsCollection = db.collection('bills');
  const bills = await billsCollection.find().toArray();
  if (bills) {
    res.status(200).json(bills);
    //res.render('productAPI', { bills });
  } else {
    res.status(404).json({
      message: 'Không tìm thấy bill'
    });
  }
});
//add Bills
// server.js or your backend file
router.post('/bills/add', async (req, res, next) => {
  try {
    let db = await connectDb();
    let billsCollection = db.collection("bills");

    let { id_bill, customer_name, customer_address, customer_phone, customer_email, method, status, totalCartMoney, order_date, goods } = req.body;

    let addBills = { id_bill, customer_name, customer_address, customer_phone, customer_email, method, status, totalCartMoney, order_date, goods };
    await billsCollection.insertOne(addBills);

    res.status(200).json(addBills);
  } catch (error) {
    console.error("Lỗi khi thêm đơn hàng:", error);
    res.status(500).json({ message: 'Lỗi khi thêm đơn hàng.' });
  }
});



module.exports = router;
