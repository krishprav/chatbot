const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatbot_db';

// --- Security Middleware ---
app.use(helmet()); // Adds security headers (XSS protection, etc.)
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'https://chatbot-ivory-xi.vercel.app',
            process.env.CORS_ORIGIN
        ].filter(Boolean);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// --- Logging ---
app.use(morgan('dev')); // Log HTTP requests

// --- Rate Limiting ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// --- Body Parsers ---
app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Chatbot API Production Ready' }));
app.use('/api', routes);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// --- Database Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit process on fatal DB error
    });

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Production Server running on http://localhost:${PORT}`);
    console.log(`Security headers enabled`);
    console.log(`Request logging enabled`);
});
