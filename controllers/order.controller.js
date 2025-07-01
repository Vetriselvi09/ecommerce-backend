const Order = require('../models/order.model');
const User = require('../models/user.model');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      customerDetails,
      dispatchDate,
      dispatchTime,
      paymentMethod,
      paymentStatus,
      totalAmount
    } = req.body;

    const newOrder = new Order({
      userId,
      cartItems,
      paymentId,
      totalAmount,
      status: 'Placed',
      createdAt: new Date(),
    });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (Admin use)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username email phone');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// Get orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user orders' });
  }
};
