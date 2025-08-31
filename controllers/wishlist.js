import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.email;
    const wishlist = await Wishlist.findOne({ userId }).populate('items');
    if (!wishlist) return res.json({ items: [] });
    res.json({ items: wishlist.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.email;
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }
    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId);
    }
    await wishlist.save();
    await wishlist.populate('items');
    res.json({ items: wishlist.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.email;
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter(item => item.toString() !== productId);
    await wishlist.save();
    await wishlist.populate('items');
    res.json({ items: wishlist.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.email;
    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.items = [];
      await wishlist.save();
    }
    res.json({ items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
