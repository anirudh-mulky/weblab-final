

const products = [
  {
    id: 'ecopower-400w',
    name: 'EcoPower 400W',
    category: 'Residential',
    wattage: '400W',
    efficiency: '22.5%',
    price: 349.99,
    image: 'images/1.png',
    imageFallback: '⚡',
    description: 'Perfect for residential rooftops with high efficiency and durability.',
    specs: {
      'Max Power': '400W',
      'Efficiency': '22.5%',
      'Cell Type': 'Monocrystalline',
      'Dimensions': '78.74" x 39.37" x 1.57"',
      'Weight': '44.1 lbs',
      'Warranty': '25 years'
    }
  },
  {
    id: 'sunmax-450w',
    name: 'SunMax 450W',
    category: 'High Efficiency',
    wattage: '450W',
    efficiency: '24.2%',
    price: 449.99,
    image: 'images/2.png',
    imageFallback: '☀️',
    description: 'Premium high-efficiency panels with advanced cell technology.',
    specs: {
      'Max Power': '450W',
      'Efficiency': '24.2%',
      'Cell Type': 'PERC Monocrystalline',
      'Dimensions': '82.68" x 41.34" x 1.57"',
      'Weight': '48.5 lbs',
      'Warranty': '25 years'
    }
  },
  {
    id: 'solarpro-500w',
    name: 'SolarPro 500W',
    category: 'Commercial',
    wattage: '500W',
    efficiency: '23.8%',
    price: 549.99,
    image: 'images/3.png',
    imageFallback: '🔆',
    description: 'Built for commercial installations with maximum power output.',
    specs: {
      'Max Power': '500W',
      'Efficiency': '23.8%',
      'Cell Type': 'Half-Cut Monocrystalline',
      'Dimensions': '87.40" x 43.31" x 1.57"',
      'Weight': '55.1 lbs',
      'Warranty': '25 years'
    }
  },
  {
    id: 'ultracell-550w',
    name: 'UltraCell 550W',
    category: 'Premium',
    wattage: '550W',
    efficiency: '25.1%',
    price: 649.99,
    image: 'images/4.png',
    imageFallback: '✨',
    description: 'Top-tier premium panels with cutting-edge technology.',
    specs: {
      'Max Power': '550W',
      'Efficiency': '25.1%',
      'Cell Type': 'N-Type Monocrystalline',
      'Dimensions': '89.76" x 44.88" x 1.57"',
      'Weight': '59.2 lbs',
      'Warranty': '30 years'
    }
  }
];

if (typeof Storage !== 'undefined') {
  localStorage.setItem('products', JSON.stringify(products));
}

function attachProductEventListeners() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) {
    console.error('Products grid not found');
    return;
  }

  productsGrid.addEventListener('click', (e) => {

    const button = e.target.closest('.btn-add-cart');
    if (button) {
      e.preventDefault();
      e.stopPropagation();
      const productId = button.getAttribute('data-product-id');
      if (productId) {
        console.log('Adding to cart:', productId);
        handleAddToCart(productId);
      } else {
        console.error('No product ID found on button');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

  setTimeout(() => {
    attachProductEventListeners();
  }, 100);
});

function renderProducts() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;

  productsGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="product-image-fallback" style="display: none;">${product.imageFallback || '⚡'}</div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-specs">${product.category} • ${product.wattage} • ${product.efficiency} Efficiency</p>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="btn btn-add-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
        <a href="product-detail.html?id=${product.id}" class="btn btn-secondary" style="margin-top: 0.5rem; text-align: center; display: block;">
          View Details
        </a>
      </div>
    </div>
  `).join('');
}

function handleAddToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cartItem = {
    productId: product.id,
    productName: product.name,
    price: product.price,
    quantity: 1,
    image: product.image
  };

  if (typeof addToCart === 'function') {
    addToCart(cartItem);
  } else {

    const API_BASE_URL = window.location.origin + '/api';
    fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItem),
    }).then(() => {
      alert('Item added to cart!');
      if (typeof updateCartBadge === 'function') {
        updateCartBadge();
      }
    });
  }
}

