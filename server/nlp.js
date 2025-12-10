const mongoose = require('mongoose');
const { Deal, Order, Payment } = require('./models');

// Deterministic NLP Logic
async function processIntent(message, userId) {
    const lowerMsg = message.toLowerCase();

    // 1. DEALS Intent
    if (lowerMsg.includes('deal') || lowerMsg.includes('offer') || lowerMsg.includes('discount')) {
        const deals = await Deal.find();
        return {
            type: 'DEALS',
            text: deals.length > 0 ? "Here are the latest deals for you!" : "I couldn't find any active deals at the moment.",
            data: deals
        };
    }

    // 2. ORDERS Intent
    if (lowerMsg.includes('order') || lowerMsg.includes('history')) {
        const orders = await Order.find({ userId }).sort({ date: -1 });
        return {
            type: 'ORDERS',
            text: orders.length ? "Here are your past orders:" : "You have no past orders.",
            data: orders
        };
    }

    // 3. PAYMENT Intent
    if (lowerMsg.includes('payment') || lowerMsg.includes('bill') || lowerMsg.includes('due')) {
        // Find user's orders first
        const userOrders = await Order.find({ userId });
        const orderIds = userOrders.map(o => o.orderId);
        // Find payments for those orders
        const payments = await Payment.find({ orderId: { $in: orderIds } });

        return {
            type: 'PAYMENT',
            text: payments.length ? "Here is your payment status:" : "No payment records found.",
            data: payments
        };
    }

    // 4. MENU / GREETING Intent
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('help') || lowerMsg.includes('menu')) {
        return {
            type: 'MENU',
            text: "Hello! How can I help you today?",
            data: [
                { label: "Show Deals", value: "deals" },
                { label: "My Orders", value: "orders" },
                { label: "Payment Status", value: "payment" }
            ]
        };
    }

    // 5. REGISTER Intent (Contextual)
    if (lowerMsg.includes('register') || lowerMsg.includes('new user') || lowerMsg.includes('signup')) {
        return {
            type: 'REGISTER',
            text: "You are already currently logged in and registered. If you'd like to register a new account, please logout and use the registration form."
        };
    }

    return {
        type: 'UNKNOWN',
        text: "I didn't understand that. Please choose an option below:",
        data: [
            { label: "Show Deals", value: "deals" },
            { label: "My Orders", value: "orders" },
            { label: "Payment Status", value: "payment" }
        ]
    };
}

module.exports = { processIntent };
