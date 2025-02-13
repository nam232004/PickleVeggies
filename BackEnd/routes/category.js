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

router.get('/', async (req, res, next) => {
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
router.get('/:id', async (req, res, next) => {
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
router.post('/add', upload.single('img'), async (req, res, next) => {
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
router.patch('/:id', upload.single('img'), async (req, res, next) => {
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
router.delete('/:id', async (req, res, next) => {
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

module.exports = router;