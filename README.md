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

