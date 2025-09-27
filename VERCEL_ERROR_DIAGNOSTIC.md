# Vercel Deployment Error Diagnostics 🔍

## Current Status: Deployment Successful ✅

But experiencing runtime errors during application use.

## Common Post-Deployment Issues & Solutions

### 1. FUNCTION_INVOCATION_FAILED (500) 🔧

**When it happens**: API calls to `/api/*` endpoints fail
**Common causes**:

- Server function crashes on startup
- Database connection issues
- Missing environment variables
- Import/export errors in server.js

**Diagnostic Steps**:

```bash
# Check Vercel function logs
vercel logs --function=server.js

# Test API endpoint directly
curl https://your-app.vercel.app/api/health
```

### 2. NOT_FOUND (404) 🔧

**When it happens**: Routes not found despite configuration
**Common causes**:

- Routing configuration issues
- Static files not built correctly
- Server function not responding to routes

**Diagnostic Steps**:

```bash
# Check if static files exist
curl https://your-app.vercel.app/assets/index-[hash].js

# Check if API routes work
curl https://your-app.vercel.app/api/health
```

### 3. FUNCTION_INVOCATION_TIMEOUT (504) 🔧

**When it happens**: Server function takes too long to respond
**Common causes**:

- Database connection timeout
- Long-running operations
- Cold start issues with MongoDB

**Solutions**:

- Optimize database queries
- Add connection pooling
- Implement request timeouts

### 4. NO_RESPONSE_FROM_FUNCTION (502) 🔧

**When it happens**: Server function doesn't return response
**Common causes**:

- Missing `export default` in server.js
- Function crashes before response
- Incorrect response format

## Environment Variables Checklist ✅

Verify these are set in Vercel dashboard:

```
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## Quick Diagnostic Commands

### Test API Health

```bash
curl -X GET https://your-app.vercel.app/api/health
```

**Expected**: `{"status": "OK", "message": "MegaMart API is running"}`

### Test Products API

```bash
curl -X GET https://your-app.vercel.app/api/products
```

**Expected**: Products array or fallback message

### Test Frontend Routes

- `https://your-app.vercel.app/` (Home)
- `https://your-app.vercel.app/products` (Products)
- `https://your-app.vercel.app/admin` (Admin)
- `https://your-app.vercel.app/invalid-route` (404 page)

## Vercel Dashboard Checks

1. **Functions Tab**: Check if `server.js` function is deployed
2. **Analytics Tab**: Look for 4xx/5xx error rates
3. **Build Logs**: Verify build completed successfully
4. **Function Logs**: Check runtime errors and console output

## Common Fix Patterns

### Database Connection Issues

```javascript
// Add to server.js
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    // Use localStorage fallback
  }
};
```

### Function Export Issues

```javascript
// Ensure server.js ends with
export default app;
```

### Response Format Issues

```javascript
// Ensure all API responses are JSON
res.json({ success: true, data: result });
// Not: res.send(result);
```

## Next Steps Based on Error Type

**Once you identify the specific error**:

1. Check Vercel function logs for that error
2. Test the failing endpoint directly
3. Verify environment variables
4. Check database connectivity
5. Review server.js export structure

**Please share**:

- The specific error code/message you're seeing
- Which URL/action triggers it
- Any error details from Vercel dashboard

This will help me provide targeted fixes! 🎯
