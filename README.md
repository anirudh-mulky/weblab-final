# Premium Solar Panel E-commerce Website

A modern, production-quality solar panel e-commerce platform built with HTML, CSS, Vanilla JavaScript, Node.js, and Express.

## Features

- 🏠 Modern landing page with hero section
- 🌍 Solar availability checker with location-based calculations
- 🛒 Product listing and detail pages
- 🛍️ Full shopping cart with backend persistence
- 💾 MongoDB database integration
- ✨ Premium UI/UX with smooth animations

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set up MongoDB connection:
   - For local MongoDB: Ensure MongoDB is running on `mongodb://localhost:27017`
   - For MongoDB Atlas: Create a `.env` file with your connection string:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solar-ecommerce
     PORT=3000
     ```
   - Note: The app will continue to work without MongoDB (in demo mode) but cart data won't persist.

3. Start the server:
```bash
npm start
```

4. Access the website:
   - Open http://localhost:3000 in your browser
   - The server serves all frontend files and handles API requests

## Project Structure

```
solar/
├── frontend/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   ├── main.js            # Shared utilities & cart badge
│   │   ├── availability.js    # Solar availability calculator
│   │   ├── products.js        # Product listing logic
│   │   ├── product-detail.js  # Product detail page
│   │   └── cart.js            # Shopping cart functionality
│   ├── index.html             # Landing page
│   ├── availability.html      # Solar availability checker
│   ├── products.html          # Product listing
│   ├── product-detail.html    # Product details
│   └── cart.html              # Shopping cart
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── routes/
│   │   └── cart.js            # Cart API routes
│   └── server.js              # Express server
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/cart` - Get all cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Styling**: Custom CSS with Flexbox & Grid
- **Fonts**: Google Fonts (Inter, Poppins)

## Features in Detail

### Landing Page
- Full-screen hero section with gradient background
- Feature highlights with icons
- Smooth animations and hover effects

### Solar Availability Checker
- Location-based solar potential calculation
- Estimated yearly energy production
- Estimated savings calculation
- Score-based recommendations (Low/Medium/High)

### Product Pages
- 4 premium solar panel products
- Detailed specifications
- Add to cart functionality
- Responsive product cards

### Shopping Cart
- Real-time cart updates
- Quantity management
- Item removal
- Total calculation with tax
- Backend persistence via MongoDB

## Development

To run in development mode with auto-reload:
```bash
npm run dev
```

(Requires nodemon to be installed globally or in devDependencies)

## Notes

- The website works with or without MongoDB connection
- Without MongoDB, cart operations work but don't persist between server restarts
- All frontend pages are served through the Express server for proper CORS handling
1️⃣ npm / node NOT FOUND
❌ Error
'node' is not recognized as an internal or external command

✅ Fix

Install Node.js LTS

Reopen terminal

Verify:

node -v
npm -v


👉 Use Command Prompt or Git Bash

2️⃣ node_modules Missing
❌ Error
Cannot find module 'express'

✅ Fix
npm install


⚠ Never copy node_modules from home to college

3️⃣ Port Already in Use (EADDRINUSE)
❌ Error
EADDRINUSE :::3000

✅ Fix (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

✅ Best Prevention

Use backend port 5000

4️⃣ .env File Missing
❌ Error
process.env.MONGODB_URI is undefined

✅ Fix

Create .env manually:

PORT=5000
MONGODB_URI=...


⚠ .env is NOT cloned from GitHub

5️⃣ MongoDB NOT Installed on College PC
❌ Error
MongoDB connection error

✅ Fix (BEST)

Use MongoDB Atlas

MONGODB_URI=mongodb+srv://...

🟡 Temporary Fix

Let app run without DB (your code already allows this)

6️⃣ Nodemon Not Working
❌ Error
'nodemon' is not recognized

✅ Fix
npx nodemon backend/server.js


or install:

npm install nodemon --save-dev

7️⃣ Windows Firewall Blocks Node
❌ Symptom

Server starts

Browser doesn’t load

✅ Fix

Allow Node.js through firewall

Run terminal as Administrator

8️⃣ Wrong Folder Opened
❌ Error
package.json not found

✅ Fix
cd weblab-final


You must be where package.json exists.

9️⃣ MongoDB Index Error (Already Exists)
❌ Error
Index already exists

✅ Fix

Safe to ignore
OR wrap in try-catch (already done)

🔟 Ctrl+Z Instead of Ctrl+C
❌ Problem

Port stays locked

Nodemon crashes

✅ Fix
taskkill /IM node.exe /F

1️⃣1️⃣ Git Clone Issues
❌ Error
permission denied

✅ Fix

Use HTTPS clone, not SSH

Login to GitHub in browser first

1️⃣2️⃣ Line Ending Issues (Windows)
❌ Weird script behavior
✅ Fix (once)
git config --global core.autocrlf true

1️⃣3️⃣ Express Server Not Starting
❌ Error
app.listen is not a function

✅ Fix

Check:

const express = require('express');
const app = express();

1️⃣4️⃣ DB Is Null (getDB() returns null)
❌ Error
Cannot read property 'collection' of null

✅ Fix

Always check:

const db = getDB();
if (!db) return res.status(500).send("DB not connected");

🧠 EXAM GOLDEN STRATEGY
✅ BEST ORDER TO RUN
git clone ...
cd project
npm install
create .env
npm run dev
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser




function updateCartUI() {
    // Update item count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartCountHeader.textContent = totalItems;

    // Cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>$${item.price} x ${item.quantity}</span>
                </div>
            </div>
        `).join('');
    }

    // Calculate subtotal
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Discount logic
    let discount = 0;
    if (subtotal > 1000) {
        discount = subtotal * 0.10; // 10% discount
    }

    let finalTotal = subtotal - discount;

    // Show total
    cartTotalEl.innerHTML = `
        <div>Subtotal: $${subtotal.toFixed(2)}</div>
        <div>Discount: $${discount.toFixed(2)}</div>
        <strong>Total: $${finalTotal.toFixed(2)}</strong>
    `;
}
