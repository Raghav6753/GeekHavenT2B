
import express from 'express';
import Product from '../models/Product.js';
import upload from '../multerConfig.js';
const router = express.Router();
router.post('/add', upload.array('images', 5), async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => 'uploads/' + file.filename) : [];
    const {
      title,
      description,
      category,
      price,
      originalPrice,
      condition,
      specifications,
      seller,
      shipping
    } = req.body;
    const product = new Product({
      title,
      description,
      category,
      price,
      originalPrice,
      condition,
      images,
      specifications: JSON.parse(specifications),
      seller: JSON.parse(seller),
      shipping: JSON.parse(shipping)
    });
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
