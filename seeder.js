import mongoose from 'mongoose';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from './models/Product.js';

const MONGO_URI ="mongodb+srv://raghavvohra375_db_user:Sz242ajTGAHkOQ5u@cluster0.0wsvotq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    const dataPath = join(__dirname, 'mockdata.json');
    let products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    products = products.map(p => ({
      ...p,
      brand: p.brand || '',
      model: p.model || '',
      tags: p.tags || [],
      location: p.location || 'Unknown'
    }));
    await Product.deleteMany({});
    for (const prod of products) {
      try {
        await Product.create(prod);
        console.log('Inserted product:', prod.title);
      } catch (e) {
        console.log(e);
        
      }
    }
    await mongoose.disconnect();
  } catch (err) {
    await mongoose.disconnect();
  }
}

seedProducts();
