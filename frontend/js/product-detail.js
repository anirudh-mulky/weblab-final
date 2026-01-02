

function getProducts() {
  const stored = localStorage.getItem('products');
  return stored ? JSON.parse(stored) : [];
}

function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === id);
}

function renderProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    document.querySelector('.product-detail').innerHTML = '<div class="container"><h2>Product not found</h2></div>';
    return;
  }

  const product = getProductById(productId);

  if (!product) {
    document.querySelector('.product-detail').innerHTML = '<div class="container"><h2>Product not found</h2></div>';
    return;
  }

  const gallery = document.getElementById('product-gallery');
  if (gallery) {
    gallery.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-detail-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="product-image-fallback" style="display: none; font-size: 12rem;">${product.imageFallback || '⚡'}</div>
    `;
  }

  const info = document.getElementById('product-detail-info');
  if (info) {
    info.innerHTML = `
      <h1>${product.name}</h1>
      <p style="color: var(--text-secondary); font-size: 1.25rem; margin-bottom: 1rem;">${product.category}</p>
      <p style="margin-bottom: 2rem;">${product.description}</p>
      <div class="product-detail-price">$${product.price.toFixed(2)}</div>

      <h3 style="margin-top: 3rem; margin-bottom: 1rem;">Specifications</h3>
      <table class="specs-table">
        ${Object.entries(product.specs).map(([key, value]) => `
          <tr>
            <td>${key}</td>
            <td><strong>${value}</strong></td>
          </tr>
        `).join('')}
      </table>

      <button class="btn btn-primary" id="detail-add-to-cart-btn" style="margin-top: 2rem; width: 100%; padding: 1.25rem; font-size: 1.125rem;" data-product-id="${product.id}">
        Add to Cart
      </button>
    `;
  }
}

function handleAddToCartDetail(productId) {
  const product = getProductById(productId);
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

document.addEventListener('DOMContentLoaded', () => {
  renderProductDetail();

  setTimeout(() => {
    const addToCartBtn = document.getElementById('detail-add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const productId = addToCartBtn.getAttribute('data-product-id');
        if (productId) {
          handleAddToCartDetail(productId);
        }
      });
    }
  }, 100);
});

