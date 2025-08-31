import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  images: [String],
  specifications: { type: Object },
  tags: [String],
  location: { type: String, required: true },
  seller: {
    name: String,
    avatar: String,
    rating: Number,
    reviewCount: Number,
    joinedDate: String
  },
  shipping: {
    cost: String,
    protection: String
  },
  priceHistory: [
    {
      date: String,
      price: Number
    }
  ]
});

const Product = mongoose.model('Product', productSchema);
export default Product;
