# MongoDB Setup Guide

## Option 1: Local MongoDB Installation

### Windows

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Start MongoDB service:
   - Open Command Prompt as Administrator
   - Run: `net start MongoDB`
4. Or use MongoDB Compass for GUI management

### macOS

```bash
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu)

```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Option 2: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string from "Connect" > "Connect your application"
5. Update your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/megamart?retryWrites=true&w=majority
```

## Testing the Setup

1. Start the backend server:

```bash
npm run server
```

2. In another terminal, seed the database:

```bash
npm run seed
```

3. Start the frontend:

```bash
npm run dev
```

## Troubleshooting

- **Connection Refused**: Make sure MongoDB is running
- **Authentication Failed**: Check your MongoDB Atlas credentials
- **Port Already in Use**: Change the PORT in .env file

## Database Structure

- **Products**: Store product information, pricing, categories
- **Users**: User accounts, authentication, profiles
- **Orders**: Order history, status tracking, payment info
- **Wishlists**: User wishlists with product references
