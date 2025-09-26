# MegaMart - E-commerce MVP

A modern, responsive e-commerce website built with React, Vite, and Tailwind CSS. This MVP allows users to browse products, add them to cart and wishlist, and contact the business for purchases.

## Features

### Customer Features

- **Product Browsing**: View all products with search and category filtering
- **Product Details**: Detailed product pages with images and descriptions
- **Shopping Cart**: Add/remove products, update quantities
- **Wishlist**: Save favorite products for later
- **Contact Form**: Get in touch with the business for purchases
- **User Authentication**: Register and login to manage personal data
- **Order Management**: Place orders and track order history
- **Responsive Design**: Works on all devices

### Admin Features

- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order status
- **User Management**: View registered users
- **Admin Dashboard**: Clean interface for managing the store
- **Authentication**: Secure admin login (username: David Promise, password: Flashies@25)

## Tech Stack

- **Frontend**: React 18, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context + Zustand
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd megamart
```

2. Install dependencies

```bash
npm install
```

3. Set up MongoDB

**Option A: Local MongoDB**

- Install MongoDB locally
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**

- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string

4. Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/megamart
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/megamart?retryWrites=true&w=majority

PORT=5000
NODE_ENV=development

# Cloudinary (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

5. Seed the database

```bash
npm run seed
```

6. Start the backend server

```bash
npm run server
```

7. In a new terminal, start the frontend

```bash
npm run dev
```

8. Open your browser and navigate to `http://localhost:3000`

### API Endpoints

The backend provides the following REST API endpoints:

- **Products**: `/api/products`
- **Orders**: `/api/orders`
- **Users**: `/api/users`
- **Wishlist**: `/api/wishlist`

### Cloudinary Setup (for image uploads)

Set the following env variables in your `.env` file:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

Then restart the dev server. In the admin dashboard (Add/Edit Product), you can upload an image file directly; it will be uploaded to Cloudinary and the URL autofilled.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Toast, etc.)
│   ├── Header.jsx      # Navigation header
│   ├── ProductCard.jsx # Product display card
│   ├── ShoppingCart.jsx # Cart sidebar
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── CartContext.jsx # Cart and wishlist state
├── pages/              # Page components
│   ├── HomePage.jsx    # Landing page
│   ├── ProductDetailPage.jsx # Product details
│   ├── CartPage.jsx    # Shopping cart page
│   ├── WishListPage.jsx # Wishlist page
│   ├── ContactPage.jsx # Contact form
│   ├── LoginPage.jsx   # User/Admin login
│   ├── RegisterPage.jsx # User registration
│   └── AdminPanel.jsx  # Admin dashboard
├── lib/                # Utility functions
│   ├── storage.js      # API client functions
│   └── utils.js        # General utilities
├── api/                # API layer
│   └── EcommerceApi.js # API integration
└── hooks/              # Custom React hooks
    └── useCart.js      # Cart management hook

models/                 # MongoDB schemas
routes/                 # Express routes
server.js              # Express server setup
seed.js               # Database seeding script
```

## Key Features Explained

### Database Integration

- **MongoDB**: NoSQL database for storing products, orders, users, and wishlists
- **Mongoose**: ODM for MongoDB with schema validation
- **REST API**: Backend API for CRUD operations
- **Data Persistence**: All data is stored in MongoDB instead of localStorage

### User Authentication

- User registration and login
- Admin authentication with username/password
- JWT-based session management (localStorage)
- Protected routes for authenticated users

### Order Management

- Complete order lifecycle (pending → confirmed → paid → shipped → delivered)
- Order tracking with status history
- Size and color selection for products
- Payment method selection

### Product Management

- Products stored in MongoDB with full schema
- Image upload to Cloudinary
- Category-based filtering
- Search functionality

### Cart & Wishlist

- Cart persists across browser sessions (localStorage)
- Wishlist stored in database per user
- Size and color variants support
- Move items from wishlist to cart

## Customization

### Adding New Product Categories

1. Update the categories in the Product model (`models/Product.js`)
2. Update the category filter logic in frontend components

### Database Schema Changes

1. Modify the schema in the respective model file
2. Update the API routes if needed
3. Run the seed script to update sample data

### Adding New Features

- New pages go in `src/pages/`
- New components go in `src/components/`
- New API endpoints go in `routes/`
- Update routing in `src/App.jsx` and `server.js`

## Deployment

### Backend Deployment

The backend can be deployed to services like:

- **Heroku**: `git push heroku main`
- **Railway**: Connect your repository
- **Vercel**: Use their serverless functions
- **AWS EC2**: Manual server setup

### Frontend Deployment

This is a static React application that can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your repository
- **GitHub Pages**: Use the `gh-pages` package
- **AWS S3**: Upload the `dist` folder

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Email notifications for orders
- Product reviews and ratings
- Advanced analytics dashboard
- Multi-language support
- Mobile app development
- Real-time inventory updates

## License

This project is open source and available under the MIT License.
