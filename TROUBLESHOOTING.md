# Troubleshooting Cart Issues

## Cart Not Showing Items?

### Step 1: Check Server is Running
```bash
curl http://localhost:3000/api/cart
```
Should return JSON with cart items.

### Step 2: Check Browser Console
1. Open browser Developer Tools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Navigate to Cart page
4. Look for any errors or logs

### Step 3: Verify You're Using the Server
- ✅ **Correct**: `http://localhost:3000/cart`
- ❌ **Wrong**: `file:///path/to/cart.html`

### Step 4: Test Adding Items
1. Go to Products page
2. Click "Add to Cart" on any product
3. Check console for "Item added to cart!" notification
4. Check cart badge in navigation (should show count)

### Step 5: Clear Browser Cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Or clear browser cache completely

### Step 6: Check Network Tab
1. Open Developer Tools
2. Go to Network tab
3. Navigate to Cart page
4. Look for request to `/api/cart`
5. Check if it returns 200 status and JSON data

## Common Issues

### "Failed to fetch" Error
- Server might not be running
- Check if `npm start` is active
- Verify server is on port 3000

### Cart is Empty After Adding Items
- Check if items are actually being added to backend
- Test with: `curl http://localhost:3000/api/cart`
- If backend has items but frontend doesn't show them, check console for JavaScript errors

### CORS Errors
- Shouldn't happen since API is on same origin
- If you see CORS errors, make sure you're accessing via `http://localhost:3000`, not `file://`

## Quick Test Commands

```bash
# Check if server is running
curl http://localhost:3000

# Check cart API
curl http://localhost:3000/api/cart

# Add test item
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"productId":"test","productName":"Test Product","price":99.99,"quantity":1,"image":"⚡"}'

# Verify item was added
curl http://localhost:3000/api/cart
```




