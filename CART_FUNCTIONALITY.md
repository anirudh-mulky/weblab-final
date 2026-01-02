# Backend Cart Functionality - Implementation Guide

## ✅ What's Implemented

The backend cart functionality is **fully implemented and working** with the following features:

### 1. **Cart API Endpoints**

All REST API endpoints are available at `http://localhost:3000/api/cart`:

#### GET `/api/cart`
- **Purpose**: Retrieve all items in the cart
- **Response**: 
  ```json
  {
    "items": [...],
    "total": 1049.97
  }
  ```

#### POST `/api/cart/add`
- **Purpose**: Add an item to the cart
- **Request Body**:
  ```json
  {
    "productId": "ecopower-400w",
    "productName": "EcoPower 400W",
    "price": 349.99,
    "quantity": 1,
    "image": "⚡"
  }
  ```
- **Response**: `{ "success": true, "message": "Item added to cart" }`
- **Behavior**: If item already exists, it increments the quantity

#### PUT `/api/cart/update`
- **Purpose**: Update the quantity of an item
- **Request Body**:
  ```json
  {
    "productId": "ecopower-400w",
    "quantity": 3
  }
  ```
- **Response**: `{ "success": true, "message": "Cart updated" }`
- **Behavior**: If quantity is 0 or less, the item is removed

#### DELETE `/api/cart/remove/:productId`
- **Purpose**: Remove an item from the cart
- **Response**: `{ "success": true, "message": "Item removed from cart" }`

### 2. **Storage Strategy**

The cart uses a **dual storage approach**:

1. **MongoDB (Primary)**: If MongoDB is connected, cart data persists permanently
2. **In-Memory Store (Fallback)**: If MongoDB is not available, cart data is stored in memory during the server session

This ensures the cart works whether or not MongoDB is set up!

### 3. **Frontend Integration**

The frontend JavaScript files automatically connect to the backend:

- **`frontend/js/main.js`**: 
  - `addToCart()` function - Adds items to cart via API
  - `updateCartBadge()` function - Updates cart badge count

- **`frontend/js/cart.js`**: 
  - `loadCart()` - Fetches cart items from API
  - `updateQuantity()` - Updates item quantities
  - `removeItem()` - Removes items from cart

- **`frontend/js/products.js`**: 
  - `handleAddToCart()` - Adds products to cart when "Add to Cart" is clicked

## 🧪 Testing

All endpoints have been tested and are working:

```bash
# Add item
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"productId":"test","productName":"Test","price":99.99,"quantity":1,"image":"⚡"}'

# Get cart
curl http://localhost:3000/api/cart

# Update quantity
curl -X PUT http://localhost:3000/api/cart/update \
  -H "Content-Type: application/json" \
  -d '{"productId":"test","quantity":5}'

# Remove item
curl -X DELETE http://localhost:3000/api/cart/remove/test
```

## 🔄 How It Works

1. **User clicks "Add to Cart"** on a product
2. **Frontend** calls `POST /api/cart/add` with product details
3. **Backend** stores the item (MongoDB or in-memory)
4. **Cart badge** updates automatically
5. **Cart page** fetches items via `GET /api/cart` and displays them
6. **Quantity updates** use `PUT /api/cart/update`
7. **Item removal** uses `DELETE /api/cart/remove/:id`

## 📁 File Structure

```
backend/
├── routes/
│   └── cart.js          # Cart API routes
├── models/
│   └── cartStore.js     # In-memory cart storage
└── config/
    └── db.js            # MongoDB connection

frontend/js/
├── main.js              # Shared cart functions
├── cart.js              # Cart page logic
└── products.js          # Product listing with add to cart
```

## ✨ Features

- ✅ Add items to cart
- ✅ Update item quantities
- ✅ Remove items from cart
- ✅ Automatic quantity increment for duplicate items
- ✅ Real-time cart badge updates
- ✅ Total calculation
- ✅ Works with or without MongoDB
- ✅ Persistent storage (when MongoDB is connected)
- ✅ Session-based storage (in-memory fallback)

The backend cart functionality is **complete and ready to use**! 🎉




