const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Deal, Order, Payment } = require('./models');
const { processIntent } = require('./nlp');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

// 1. Auth: Check if user exists
router.post('/auth/check-user', async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone });

        if (user) {
            const token = jwt.sign({ userId: user._id }, JWT_SECRET);
            return res.json({ exists: true, token, user });
        }
        return res.json({ exists: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Auth: Register new user
router.post('/auth/register', async (req, res) => {
    try {
        const { name, phone, address, email } = req.body;
        const userId = 'U-' + Date.now().toString().slice(-4);

        const newUser = new User({ userId, name, phone, address, email });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
        res.json({ token, user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Chat: Process Message
router.post('/chat/message', async (req, res) => {
    try {
        const { message, userId } = req.body;
        const response = await processIntent(message, userId);
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Explicit REST APIs (as per requirements) ---

// GET /deals
router.get('/deals', async (req, res) => {
    try {
        const deals = await Deal.find();
        res.json(deals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /orders
router.get('/orders', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: "userId required" });

        const orders = await Order.find({ userId });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /payments
router.get('/payments', async (req, res) => {
    try {
        const { userId } = req.query;

        let filter = {};
        if (userId) {
            const orders = await Order.find({ userId });
            const orderIds = orders.map(o => o.orderId);
            filter = { orderId: { $in: orderIds } };
        }

        const payments = await Payment.find(filter);
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Seed Data
router.get('/seed', async (req, res) => {
    try {
        // Clear existing
        await Deal.deleteMany({});
        await Order.deleteMany({});
        await Payment.deleteMany({});
        await User.deleteMany({});

        // Seed Deals
        await Deal.insertMany([
            {
                dealId: "D-101",
                title: "Summer Sale",
                description: "50% off on all summer wear.",
                price: "₹20",
                imageURL: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60"
            },
            {
                dealId: "D-102",
                title: "New Gadgets",
                description: "Latest tech at best prices.",
                price: "₹199",
                imageURL: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60"
            },
            {
                dealId: "D-103",
                title: "Combo Meal",
                description: "Burger + Fries + Coke.",
                price: "₹15",
                imageURL: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=60"
            }
        ]);

        // Seed Demo User
        const demoUser = new User({
            userId: "U-DEMO-1",
            name: "Krish",
            phone: "9999999999",
            address: "123 Tech Park, Bangalore",
            email: "krish@example.com"
        });
        await demoUser.save();

        // Seed Orders for Demo User
        await Order.insertMany([
            {
                orderId: "ORD-101",
                userId: demoUser._id,
                productName: "Wireless Headphones",
                imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
                status: "Delivered",
                date: new Date('2023-12-01')
            },
            {
                orderId: "ORD-102",
                userId: demoUser._id,
                productName: "Smart Watch",
                imageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
                status: "Shipped",
                date: new Date('2023-12-10')
            }
        ]);

        // Seed Payments
        await Payment.insertMany([
            {
                paymentId: "PAY-101",
                orderId: "ORD-101",
                amountPaid: 2000,
                pendingAmount: 0,
                status: "Paid"
            },
            {
                paymentId: "PAY-102",
                orderId: "ORD-102",
                amountPaid: 0,
                pendingAmount: 5000,
                status: "Pending"
            }
        ]);

        res.json({ message: "Database seeded successfully! (Deals, Orders, Payments, and Demo User: 9999999999)" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
