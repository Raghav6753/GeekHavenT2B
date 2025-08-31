import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.email;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.json({ items: [] });
    res.json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.email;
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    await cart.populate('items.productId');
    res.json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.email;
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: 'Item not found in cart' });
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    await cart.populate('items.productId');
    res.json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.email;
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    await cart.populate('items.productId');
    res.json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.email;
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
