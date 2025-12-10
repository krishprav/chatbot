const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String, // Explicit ID as per requirements
  name: String,
  phone: { type: String, unique: true, required: true },
  address: String,
  email: String,
});

const dealSchema = new mongoose.Schema({
  dealId: String, // Explicit ID
  title: String,
  description: String,
  price: String,
  imageURL: String,
});

const orderSchema = new mongoose.Schema({
  orderId: String, // Explicit ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productName: String,
  imageURL: String,
  status: String, // 'Delivered', 'Shipped', 'Processing'
  date: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  paymentId: String, // Explicit ID
  orderId: String,
  amountPaid: Number,
  pendingAmount: Number,
  status: String, // 'Paid', 'Pending'
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Deal: mongoose.model('Deal', dealSchema),
  Order: mongoose.model('Order', orderSchema),
  Payment: mongoose.model('Payment', paymentSchema),
};
