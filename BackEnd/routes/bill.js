var express = require('express');
var router = express.Router();
//connect db
const connectDb = require('../models/db');
require('dotenv').config();

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