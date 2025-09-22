# LuxeCommerce - Premium E-Commerce Platform

A fully functional, modern e-commerce platform built with React, Node.js, Express, and MongoDB. Features a beautiful customer-facing storefront and a comprehensive admin dashboard with real-time analytics, advanced animations, and secure dual-server architecture.

## ✨ Features

### 🛍️ Customer Features
- **Modern UI/UX**: Beautiful, responsive design with smooth animations using Framer Motion and GSAP
- **Product Browsing**: Advanced filtering, search, and categorization
- **Shopping Cart**: Persistent cart with real-time updates via Socket.IO
- **User Authentication**: Secure JWT-based auth with email verification
- **Order Management**: Complete order tracking and history
- **User Profiles**: Comprehensive profile management with addresses
- **Real-time Features**: Live notifications, chat support, and order updates
- **Payment Integration**: Stripe payment processing (ready for integration)
- **Wishlist & Reviews**: Save favorites and leave product reviews

### 🎛️ Admin Features
- **Comprehensive Dashboard**: Real-time analytics with beautiful charts (Recharts)
- **Product Management**: Full CRUD operations with image uploads
- **Order Management**: Track and manage all customer orders
- **Customer Management**: View and manage customer accounts
- **Analytics & Reports**: Revenue tracking, sales analytics, and performance metrics
- **Inventory Management**: Stock tracking with low-stock alerts
- **Real-time Updates**: Live dashboard updates via Socket.IO
- **Security Controls**: Admin-only access with role-based permissions
- **Bulk Operations**: Mass product updates and order processing

## 🏗️ Architecture

### Dual Server Architecture
- **Customer Server** (Port 5003): Handles all customer-facing operations
- **Admin Server** (Port 3002): Dedicated admin operations with enhanced security  
- **Database**: Shared file-based database with real-time synchronization
- **Real-time**: Separate Socket.IO instances for customer and admin features

### Frontend Applications
- **Customer Store** (Port 3003): React SPA with modern animations  
- **Admin Dashboard** (Port 3002): React admin interface with advanced controls

## 🛠️ Tech Stack

### Frontend Technologies
- **React 18**: Latest React with hooks and concurrent features
- **React Router DOM**: Client-side routing with lazy loading
- **Styled Components**: CSS-in-JS with theme support
- **Framer Motion**: Advanced animations and transitions
- **GSAP**: High-performance animations for complex effects
- **Three.js**: 3D graphics and interactive elements
- **React Query**: Server state management and caching
- **React Hook Form**: Performant forms with validation
- **Yup**: Schema validation
- **Recharts**: Beautiful, responsive charts
- **Socket.IO Client**: Real-time communication

### Backend Technologies
- **Node.js & Express**: Server runtime and web framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Secure authentication tokens
- **Socket.IO**: Real-time bidirectional communication
- **bcryptjs**: Password hashing
- **Nodemailer**: Email sending capabilities
- **Multer & Cloudinary**: File upload and image management
- **Stripe**: Payment processing integration

### Security & Performance
- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting
- **Express Validator**: Input validation and sanitization
- **Mongo Sanitize**: NoSQL injection prevention
- **XSS Clean**: Cross-site scripting protection
- **HPP**: HTTP parameter pollution protection

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd E-Commerce-Website
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install customer frontend dependencies
cd client
npm install
cd ..

# Install customer server dependencies
cd customer-server
npm install
cd ..

# Install admin server dependencies
cd admin-server
npm install
cd ..

# Install admin dashboard dependencies
cd admin-dashboard
npm install
cd ..
```

### 3. Environment Configuration

#### Customer Server (.env)
```bash
cd customer-server
cp .env.example .env
```

Edit `customer-server/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/luxecommerce

# Server
NODE_ENV=development
PORT=5000

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@luxecommerce.com
FROM_NAME=LuxeCommerce

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_SECRET_KEY=sk_test_your-secret-key

# URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
ADMIN_SERVER_URL=http://localhost:3002

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SENSITIVE_MAX=5

# Security
BCRYPT_SALT_ROUNDS=12
ACCOUNT_LOCKOUT_TIME=1800000
MAX_LOGIN_ATTEMPTS=5
```

#### Admin Server (.env)
```bash
cd admin-server
cp .env.example .env
```

Edit `admin-server/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/luxecommerce

# Server
NODE_ENV=development
PORT=5001

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Customer Server
CUSTOMER_SERVER_URL=http://localhost:5003

# URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002

# Rate Limiting (more generous for admin)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
RATE_LIMIT_SENSITIVE_MAX=10

# Admin Security
SUPER_ADMIN_KEY=your-super-admin-key-here
ADMIN_DEFAULT_PASSWORD=AdminPassword123!

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=admin@luxecommerce.com
FROM_NAME=LuxeCommerce Admin
```

### 4. Database Setup

#### Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud service
```

#### Seed Database with Sample Data
```bash
cd customer-server
node scripts/seedData.js
```

This will create:
- **Categories**: Electronics, Fashion, Home & Garden, Sports, Books
- **Products**: Sample products with images and specifications
- **Users**: Admin user and sample customers
- **Orders**: Sample order history

**Default Admin Credentials:**
- Email: `admin@luxecommerce.com`
- Password: `AdminPassword123!`

**Sample Customer:**
- Email: `john.doe@example.com`
- Password: `Password123!`

### 5. Start Development Servers

#### Option 1: Start All Services (Recommended)
```bash
# From root directory
npm run dev
```

This starts:
- Customer frontend on http://localhost:3003
- Admin dashboard on http://localhost:3002  
- Customer server on http://localhost:5003
- Admin server on http://localhost:3002

#### Option 2: Start Services Individually
```bash
# Terminal 1: Customer Frontend
cd client
npm start

# Terminal 2: Admin Dashboard
cd admin-dashboard
PORT=3002 npm start

# Terminal 3: Customer Server
cd customer-server
PORT=5003 npm run dev

# Terminal 4: Admin Server
cd admin-server
PORT=3002 npm run dev
```

## 🌐 Access Points & Usage

### Customer Store (http://localhost:3003)
- **Homepage**: Featured products and categories
- **Products**: Browse and search products
- **Product Details**: Detailed product information
- **Cart**: Shopping cart management
- **Checkout**: Secure checkout process
- **Account**: User registration and login
- **Profile**: Manage account and addresses
- **Orders**: Order history and tracking

### Admin Dashboard (http://localhost:3002)
- **Login**: Admin authentication
- **Dashboard**: Analytics and overview
- **Products**: Manage product catalog
- **Orders**: Process and track orders
- **Customers**: Manage customer accounts
- **Analytics**: Detailed sales reports
- **Settings**: System configuration
- **Profile**: Admin account management

### API Endpoints

#### Customer API (http://localhost:5003/api)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /products` - Get products
- `POST /cart/add` - Add to cart
- `POST /orders` - Create order
- `GET /orders` - Get user orders

#### Admin API (http://localhost:3002/api)
- `POST /auth/login` - Admin login
- `GET /dashboard/stats` - Dashboard statistics
- `GET /products` - Admin product management
- `GET /orders` - Admin order management
- `GET /customers` - Customer management

## 🔗 Real-Time Synchronization

The platform now features real-time synchronization between admin and customer servers:

### Product Management
- ✅ Products added in admin dashboard instantly appear in customer store
- ✅ Product updates are reflected immediately across both platforms
- ✅ Product deletions are synchronized in real-time

### Order Management  
- ✅ Customer orders instantly appear in admin dashboard
- ✅ Order status updates from admin are reflected to customers
- ✅ Real-time notifications for new orders and status changes

### Technical Implementation
- **Shared Database**: File-based database accessible by both servers
- **Socket.IO**: Real-time bidirectional communication
- **Event Broadcasting**: Changes are broadcast to all connected clients
- **Cross-Server Communication**: Admin and customer servers communicate via Socket.IO

## 🔧 Development Guide

### Project Structure
```
E-Commerce-Website/
├── client/                 # Customer React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── styles/         # Global styles
│   └── package.json
├── admin-dashboard/        # Admin React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Admin components
│   │   ├── contexts/       # Admin contexts
│   │   ├── pages/          # Admin pages
│   │   └── styles/         # Admin styles
│   └── package.json
├── customer-server/        # Customer API server
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── socket/            # Socket.IO handlers
│   ├── utils/             # Utility functions
│   ├── scripts/           # Database scripts
│   └── server.js          # Server entry point
├── admin-server/          # Admin API server
│   ├── controllers/       # Admin controllers
│   ├── middleware/        # Admin middleware
│   ├── routes/           # Admin routes
│   ├── socket/           # Admin socket handlers
│   └── server.js         # Admin server entry
└── package.json          # Root package.json
```

### Key Features Implementation

#### Authentication Flow
1. **Customer Registration**: Email verification optional
2. **JWT Tokens**: Stored in HTTP-only cookies
3. **Role-based Access**: Customer vs Admin permissions
4. **Account Security**: Login attempt limiting and lockout

#### Real-time Features
- **Customer**: Cart updates, order notifications, live chat
- **Admin**: Dashboard analytics, order alerts, inventory updates
- **Socket Authentication**: JWT verification for socket connections

#### Database Models
- **User**: Customer and admin accounts
- **Product**: Product catalog with variants and inventory
- **Order**: Complete order management
- **Category**: Product categorization
- **Cart**: Shopping cart persistence
- **Review**: Product reviews and ratings

### Customization Guide

#### Styling & Theming
- **Global Styles**: `src/styles/GlobalStyles.js`
- **Theme Context**: Dark/light mode support
- **Color Customization**: CSS custom properties
- **Responsive Design**: Mobile-first approach

#### Adding New Features
1. **Frontend**: Create components in appropriate directories
2. **Backend**: Add routes, controllers, and models
3. **Database**: Update schemas and migrations
4. **Real-time**: Add socket event handlers

## 🚀 Production Deployment

### Build Applications
```bash
# Build customer frontend
cd client
npm run build

# Build admin dashboard
cd admin-dashboard
npm run build
```

### Environment Variables
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Configure production email settings
- Set up SSL certificates
- Configure production domains

### Deployment Options
- **Vercel/Netlify**: Frontend applications
- **Heroku/Railway**: Backend servers
- **MongoDB Atlas**: Database hosting
- **Cloudinary**: Image hosting
- **Stripe**: Payment processing integration

## 🔒 Security Features

### Authentication & Authorization
- JWT tokens with secure HTTP-only cookies
- Password hashing with bcrypt (12 rounds)
- Account lockout after failed attempts
- Role-based access control (Customer/Admin)
- Email verification for new accounts

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- NoSQL injection prevention
- XSS protection
- CORS configuration
- Security headers with Helmet.js

### Data Protection
- Sensitive data encryption
- Secure password reset flow
- Admin-only access to sensitive operations
- Audit logging for admin actions

## 📊 Monitoring & Analytics

### Built-in Analytics
- Revenue tracking and trends
- Order analytics and conversion rates
- Customer behavior insights
- Product performance metrics
- Real-time dashboard updates

### Performance Monitoring
- API response time tracking
- Database query optimization
- Frontend performance metrics
- Error logging and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code examples
- Create an issue on GitHub

## 🎯 Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Advanced search with Elasticsearch
- [ ] Mobile app development
- [ ] Multi-vendor marketplace features
- [ ] Advanced analytics and reporting
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) features
- [ ] AI-powered product recommendations

---

**LuxeCommerce** - Built with ❤️ for modern e-commerce needs.

- Users (customers and admins)
- Products with categories
- Orders and order items
- Shopping carts
- Reviews and ratings
- Notifications
- Analytics data

Built with ❤️ using React, Node.js, Express, and MongoDB
