const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const cartStore = require('../models/cartStore');

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    let items = [];

    if (db) {

      items = await db.collection('carts').find({}).toArray();
    } else {

      items = cartStore.getAllItems();
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({ items, total });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const db = getDB();
    const { productId, productName, price, quantity = 1, image } = req.body;

    if (!productId || !productName || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (db) {

      const existingItem = await db.collection('carts').findOne({ productId });

      if (existingItem) {

        await db.collection('carts').updateOne(
          { productId },
          { $set: { quantity: existingItem.quantity + quantity } }
        );
      } else {

        await db.collection('carts').insertOne({
          productId,
          productName,
          price: parseFloat(price),
          quantity,
          image,
          createdAt: new Date()
        });
      }
    } else {

      cartStore.addItem({
        productId,
        productName,
        price,
        quantity,
        image
      });
    }

    res.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

router.put('/update', async (req, res) => {
  try {
    const db = getDB();
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (db) {

      if (quantity <= 0) {

        await db.collection('carts').deleteOne({ productId });
      } else {
        await db.collection('carts').updateOne(
          { productId },
          { $set: { quantity } }
        );
      }
    } else {

      cartStore.updateQuantity(productId, quantity);
    }

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/remove/:productId', async (req, res) => {
  try {
    const db = getDB();
    const { productId } = req.params;

    if (db) {

      await db.collection('carts').deleteOne({ productId });
    } else {

      cartStore.removeItem(productId);
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

module.exports = router;

