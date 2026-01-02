

const cartStore = new Map();

function getAllItems() {
  return Array.from(cartStore.values());
}

function getItem(productId) {
  return cartStore.get(productId);
}

function addItem(item) {
  const existing = cartStore.get(item.productId);

  if (existing) {

    existing.quantity += (item.quantity || 1);
    cartStore.set(item.productId, existing);
  } else {

    cartStore.set(item.productId, {
      productId: item.productId,
      productName: item.productName,
      price: parseFloat(item.price),
      quantity: item.quantity || 1,
      image: item.image,
      createdAt: new Date()
    });
  }

  return cartStore.get(item.productId);
}

function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    cartStore.delete(productId);
    return null;
  }

  const item = cartStore.get(productId);
  if (item) {
    item.quantity = quantity;
    cartStore.set(productId, item);
    return item;
  }

  return null;
}

function removeItem(productId) {
  return cartStore.delete(productId);
}

function clear() {
  cartStore.clear();
}

module.exports = {
  getAllItems,
  getItem,
  addItem,
  updateQuantity,
  removeItem,
  clear
};


