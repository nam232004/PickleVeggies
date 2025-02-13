var express = require('express');
var router = express.Router();
//connect db
const connectDb = require('../models/db');
const multer = require('multer');
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
router.get('/hot', async (req, res, next) => {
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
router.get('/', async (req, res, next) => {
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
router.get('/:id', async (req, res, next) => {
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
router.post('/add', upload.single('img'), async (req, res, next) => {
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
router.patch('/:id', upload.single('img'), async (req, res, next) => {
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
router.delete('/:id', async (req, res, next) => {
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

//get pro by cata id
router.get('/categoryId/:id', async (req, res, next) => {
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
router.get('/categoryName/:name', async (req, res, next) => {
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
router.get('/page/:page/limit/:limit', async (req, res, next) => {
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
router.get('/search/:name', async (req, res, next) => {
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
router.get('/sort/asc/limit/:number', async (req, res, next) => {
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
router.get('/sort/desc/limit/:number', async (req, res, next) => {
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
router.get('/filter/:price-:lastPrice', async (req, res, next) => {
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

module.exports = router;
