# 🛍️ E-Commerce SaaS Platform

A modern, scalable multi-role e-commerce platform built with React, Node.js, and MongoDB. This Software as a Service (SaaS) application enables sellers to manage products and orders while administrators oversee platform operations.



## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Project Architecture](#project-architecture)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This E-Commerce SaaS platform is a comprehensive marketplace solution that allows multiple sellers to operate within a single ecosystem. The platform provides:

- **For Sellers:** Product management, inventory control, order tracking, and sales analytics
- **For Admins:** Platform oversight, seller management, order monitoring, and system administration
- **For Customers:** Seamless shopping experience across multiple sellers

The application follows the SaaS model with multi-tenant capabilities, enabling scalability and efficient resource utilization.

---

## ✨ Features

### User Management
- ✅ User Registration & Authentication (JWT-based)
- ✅ Secure Password Hashing (bcryptjs)
- ✅ Role-Based Access Control (Seller, Admin, Customer)
- ✅ User Profile Management
- ✅ Session Management with HTTP-Only Cookies

### Product Management
- ✅ Add, Update, and Delete Products
- ✅ Product Categorization and Filtering
- ✅ Image Upload to Cloudinary
- ✅ Inventory Management
- ✅ Product Search Functionality
- ✅ Real-time Stock Updates

### Order Management
- ✅ Place and Track Orders
- ✅ Seller-Specific Order Dashboard
- ✅ Admin Order Management & Analytics
- ✅ Order Status Updates (Pending, Shipped, Delivered)
- ✅ Export Order Data (Excel/PDF)
- ✅ Order History Tracking

### Administrative Features
- ✅ Seller Onboarding & Verification
- ✅ Platform-Wide Analytics Dashboard
- ✅ Seller Performance Monitoring
- ✅ System Maintenance & Logging
- ✅ User Management Console

---

## 🛠️ Tech Stack

### Frontend
```
React 19.0 + Vite
├── UI Library: Material-UI (MUI 6.4.4)
├── State Management: Zustand 5.0.3
├── Routing: React Router v7
├── HTTP Client: Axios 1.8.1
├── Animation: Framer Motion 12.4.10
├── Notifications: React Toastify 11.0.5
├── Icons: Font Awesome & MUI Icons
└── Data Export: XLSX 0.18.5
```

### Backend
```
Node.js + Express 4.21.2
├── Database: MongoDB with Mongoose 8.11.0
├── Authentication: JWT (jsonwebtoken 9.0.2)
├── Password Security: bcryptjs 3.0.2
├── File Upload: Multer 1.4.5 with Cloudinary
├── CORS: cors 2.8.5
├── Task Scheduling: node-cron 3.0.3
├── Environment: dotenv 16.4.7
└── Development: Nodemon 3.1.9
```

### Infrastructure
- **Image Hosting:** Cloudinary
- **Database:** MongoDB Atlas
- **Frontend Port:** 5173 (Vite)
- **Backend Port:** 8000 (Express)

---

## 📁 Project Structure

```
E-Commerce-main/
│
├── server/                          # Backend Application
│   ├── Config/
│   │   └── db.js                   # Database Connection
│   │
│   ├── Model/                       # Database Schemas
│   │   ├── user.js                 # User Schema
│   │   ├── product.js              # Product Schema
│   │   ├── order.js                # Order Schema
│   │   └── seller.js               # Seller Schema
│   │
│   ├── Routes/                      # API Endpoints
│   │   ├── login.js                # Authentication
│   │   ├── signup.js               # Registration
│   │   ├── logout.js               # Session Management
│   │   ├── products.js             # Product Operations
│   │   ├── addProduct.js           # Add New Products
│   │   ├── order.js                # Order Operations
│   │   ├── sellerOrders.js         # Seller Dashboard
│   │   ├── adminOrders.js          # Admin Dashboard
│   │   ├── addSeller.js            # Seller Onboarding
│   │   ├── userRole.js             # Role Management
│   │   ├── home.js                 # Home/Dashboard
│   │   └── landing.js              # Landing Page
│   │
│   ├── package.json                # Dependencies
│   ├── index.js                    # Server Entry Point
│   └── .env                        # Environment Variables
│
└── client/                          # Frontend Application
    ├── src/
    │   ├── components/             # Reusable Components
    │   ├── pages/                  # Page Components
    │   ├── store/                  # Zustand State
    │   ├── utils/                  # Utility Functions
    │   ├── App.jsx                 # Main App
    │   └── main.jsx                # Entry Point
    │
    ├── public/                     # Static Assets
    ├── package.json               # Dependencies
    ├── vite.config.js             # Vite Config
    └── index.html                 # HTML Template
```

---

## 📦 Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (for cloud database)
- **Cloudinary** account (for image hosting)
- **Git** for version control

### Verify Installation
```bash
node --version
npm --version
```

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/E-Commerce-main.git
cd E-Commerce-main
```

### 2. Backend Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the server directory:
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=8000
NODE_ENV=development
```

### 3. Frontend Setup

Navigate to the client directory (from root):
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:8000
```

---

## ⚙️ Configuration

### MongoDB Atlas Setup
1. Create account at [mongodb.com](https://www.mongodb.com)
2. Create a new cluster
3. Create database user and get connection string
4. Add connection string to `.env` file

### Cloudinary Setup
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from dashboard
3. Add credentials to `.env` file

---

## 📖 Running the Application

### Start Backend Server
```bash
cd server
npm start
```
Server runs on: `http://localhost:8000`

### Start Frontend Development Server
```bash
cd client
npm run dev
```
Application accessible at: `http://localhost:5173`

### Build for Production
```bash
# Frontend
cd client
npm run build

# Backend is ready as-is (set NODE_ENV=production)
```

---

## 🔗 API Documentation

### Authentication Endpoints

**POST** `/api/signup`
- Register new user
- Body: `{ name, email, password }`
- Returns: JWT token

**POST** `/api/login`
- Authenticate user
- Body: `{ email, password }`
- Returns: JWT token in cookie

**POST** `/api/logout`
- Clear user session
- Requires: Authentication

### Product Endpoints

**GET** `/api/products`
- Retrieve all products
- Query: `?category=&search=&page=`

**POST** `/api/products/add`
- Add new product (Seller only)
- Body: FormData with file
- Requires: Seller authentication

**PUT** `/api/products/:id`
- Update product
- Requires: Seller ownership

**DELETE** `/api/products/:id`
- Delete product
- Requires: Seller ownership

### Order Endpoints

**POST** `/api/orders`
- Create new order
- Body: `{ items, totalAmount, address }`
- Requires: Authentication

**GET** `/api/orders`
- Get user's orders
- Requires: Authentication

**GET** `/api/seller/orders`
- Get seller's orders (Seller only)
- Requires: Seller authentication

**PUT** `/api/orders/:id/status`
- Update order status (Seller only)
- Body: `{ status }`
- Requires: Seller authentication

**GET** `/api/admin/orders`
- Get all orders (Admin only)
- Requires: Admin authentication

---

## 💾 Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['seller', 'admin'], default: 'seller'),
  date: Date (default: current time),
  orders: [ObjectId] // References to orders
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  seller: ObjectId (ref: User),
  image: String (Cloudinary URL),
  category: String,
  createdAt: Date
}
```

### Order Schema
```javascript
{
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'shipped', 'delivered']),
  customer: ObjectId (ref: User),
  seller: ObjectId (ref: User),
  orderDate: Date,
  deliveryDate: Date
}
```

### Seller Schema
```javascript
{
  user: ObjectId (ref: User),
  shopName: String,
  rating: Number,
  totalOrders: Number,
  status: String
}
```

---

## 🔒 Security Features

### Authentication
- ✅ Password hashing with bcryptjs (salt rounds: 10)
- ✅ JWT-based stateless authentication
- ✅ HTTP-only cookies for token storage
- ✅ Token expiration management

### Authorization
- ✅ Role-based access control middleware
- ✅ Route protection for authenticated endpoints
- ✅ Resource ownership verification
- ✅ Seller can only modify own products

### Data Protection
- ✅ Input validation on all endpoints
- ✅ CORS restriction to authorized domains
- ✅ Environment variables for sensitive data
- ✅ MongoDB Atlas network security

### File Security
- ✅ Cloudinary automatic validation
- ✅ Restricted to image formats
- ✅ Upload size limits enforced

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│              React SPA with Material-UI                  │
│         (Components, Pages, State Management)            │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                    │
│               Express.js REST API Server                 │
│    (Routes, Middleware, Authentication, Validation)     │
└──────────────────┬──────────────────────────────────────┘
                   │ Database Queries
┌──────────────────▼──────────────────────────────────────┐
│                   DATA ACCESS LAYER                      │
│          MongoDB with Mongoose ODM Schema                │
│        (Collections, Relationships, Indexing)            │
└─────────────────────────────────────────────────────────┘
```

### Authentication Flow
```
User → Login → Verify Credentials → Hash Check → 
JWT Generation → Store in Cookie → Authenticated Request → 
Middleware Verification → Access Granted
```

---

## 🚢 Deployment

### Frontend Deployment Options
- **Vercel** (Recommended for Vite)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

### Backend Deployment Options
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**
- **AWS EC2**

### Database Deployment
- **MongoDB Atlas** (Cloud database)

### Environment Variables in Production
Update `.env` files with production credentials:
- Production MongoDB URI
- Production domain in CORS
- Secure JWT secret
- Cloudinary production credentials

---

## 📊 Performance Optimization

- ✅ Code splitting and lazy loading (React)
- ✅ Database indexing on frequently queried fields
- ✅ Cloudinary automatic image optimization
- ✅ Caching strategies for API responses
- ✅ Compression middleware (gzip)
- ✅ CDN for static assets

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User Registration & Login
- [ ] Product CRUD Operations
- [ ] Order Creation & Tracking
- [ ] Role-based Access Control
- [ ] Responsive Design
- [ ] Image Upload
- [ ] Order Export (Excel/PDF)

### Testing Routes
1. **Seller Flow:** Register → Add Products → View Orders
2. **Admin Flow:** Login as Admin → View All Orders → Monitor Platform
3. **Customer Flow:** Browse Products → Place Order → Track

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see details in package.json

---

## 👥 Team

**Maximum Group Members:** 4

### Project Structure for Team Collaboration
- **Frontend Team:** UI/UX components, state management
- **Backend Team:** API development, database design
- **Full Stack:** Authentication, integration
- **DevOps:** Deployment, configuration

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```
Solution: Check connection string in .env file
Ensure MongoDB Atlas network access is configured
Verify username and password
```

**Cloudinary Upload Error**
```
Solution: Verify Cloudinary credentials
Check file size limits
Ensure network connectivity
```

**CORS Error**
```
Solution: Update CORS configuration in server/index.js
Add your frontend URL to allowed origins
```

**Port Already in Use**
```
Solution: Kill process using port 8000 or 5173
Or change PORT in .env file
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Material-UI Documentation](https://mui.com)
- [Vite Documentation](https://vitejs.dev)

---

## 📧 Support

For issues and questions:
1. Check the documentation in the `/docs` folder
2. Review existing GitHub issues
3. Create a new issue with detailed description
4. Contact team members directly

---

## 🎉 Project Highlights

This SaaS e-commerce platform demonstrates:
- ✅ Full-stack development with modern technologies
- ✅ Multi-role user management and authorization
- ✅ RESTful API design principles
- ✅ Responsive UI/UX with Material-UI
- ✅ Secure authentication with JWT
- ✅ Cloud integration (Cloudinary, MongoDB Atlas)
- ✅ Scalable SaaS architecture
- ✅ Production-ready code

---

## 📄 Version History

**v1.0.0** (Current)
- Initial project release
- Multi-role authentication
- Product management
- Order tracking
- Admin dashboard

---

**Last Updated:** September 2026  
**Status:** Active Development & Ready for Submission

---

> This project is submitted as part of university coursework demonstrating Software as a Service (SaaS) principles and full-stack web development capabilities.
