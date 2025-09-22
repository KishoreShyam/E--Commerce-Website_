const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

class FileDB {
  constructor() {
    this.dbPath = path.join(__dirname, '..', 'data');
    this.usersFile = path.join(this.dbPath, 'users.json');
    this.favoritesFile = path.join(this.dbPath, 'favorites.json');
    this.productsFile = path.join(this.dbPath, 'products.json');
    this.ordersFile = path.join(this.dbPath, 'orders.json');
    this.categoriesFile = path.join(this.dbPath, 'categories.json');
    
    // Ensure data directory exists
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }
    
    // Initialize files if they don't exist
    this.initializeFiles();
  }

  initializeFiles() {
    if (!fs.existsSync(this.usersFile)) {
      fs.writeFileSync(this.usersFile, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(this.favoritesFile)) {
      fs.writeFileSync(this.favoritesFile, JSON.stringify({}, null, 2));
    }
    if (!fs.existsSync(this.productsFile)) {
      fs.writeFileSync(this.productsFile, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(this.ordersFile)) {
      fs.writeFileSync(this.ordersFile, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(this.categoriesFile)) {
      fs.writeFileSync(this.categoriesFile, JSON.stringify([], null, 2));
    }
  }

  // Product operations
  getProducts() {
    try {
      const data = fs.readFileSync(this.productsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading products file:', error);
      return [];
    }
  }

  saveProducts(products) {
    try {
      fs.writeFileSync(this.productsFile, JSON.stringify(products, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving products file:', error);
      return false;
    }
  }

  createProduct(productData) {
    const products = this.getProducts();
    const id = Date.now().toString();
    
    const product = {
      _id: id,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: productData.status || 'active'
    };
    
    products.push(product);
    this.saveProducts(products);
    return product;
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(product => product._id === id) || null;
  }

  updateProduct(id, updates) {
    const products = this.getProducts();
    const productIndex = products.findIndex(product => product._id === id);
    
    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveProducts(products);
      return products[productIndex];
    }
    return null;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const filteredProducts = products.filter(product => product._id !== id);
    
    if (filteredProducts.length !== products.length) {
      this.saveProducts(filteredProducts);
      return true;
    }
    return false;
  }

  searchProducts(query) {
    const products = this.getProducts();
    if (!query) return products;
    
    const searchLower = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower)
    );
  }

  // Order operations
  getOrders() {
    try {
      const data = fs.readFileSync(this.ordersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading orders file:', error);
      return [];
    }
  }

  saveOrders(orders) {
    try {
      fs.writeFileSync(this.ordersFile, JSON.stringify(orders, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving orders file:', error);
      return false;
    }
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const id = Date.now().toString();
    
    const order = {
      _id: id,
      orderNumber: `LUX${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: orderData.status || 'pending'
    };
    
    orders.push(order);
    this.saveOrders(orders);
    return order;
  }

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(order => order._id === id) || null;
  }

  getUserOrders(userId) {
    const orders = this.getOrders();
    return orders.filter(order => order.customer === userId);
  }

  updateOrder(id, updates) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(order => order._id === id);
    
    if (orderIndex !== -1) {
      orders[orderIndex] = {
        ...orders[orderIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveOrders(orders);
      return orders[orderIndex];
    }
    return null;
  }

  // Category operations
  getCategories() {
    try {
      const data = fs.readFileSync(this.categoriesFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading categories file:', error);
      return [];
    }
  }

  saveCategories(categories) {
    try {
      fs.writeFileSync(this.categoriesFile, JSON.stringify(categories, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving categories file:', error);
      return false;
    }
  }

  // User operations
  getUsers() {
    try {
      const data = fs.readFileSync(this.usersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users file:', error);
      return [];
    }
  }

  saveUsers(users) {
    try {
      fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving users file:', error);
      return false;
    }
  }

  createUser(userData) {
    const users = this.getUsers();
    const id = Date.now().toString();
    
    const user = {
      _id: id,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true, // Auto-verify for development
      loginAttempts: 0,
      role: userData.role || 'customer',
      lastLogin: null
    };
    
    users.push(user);
    this.saveUsers(users);
    return user;
  }

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id) {
    const users = this.getUsers();
    return users.find(user => user._id === id) || null;
  }

  updateUser(id, updates) {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user._id === id);
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveUsers(users);
      return users[userIndex];
    }
    return null;
  }

  // Favorites operations
  getFavorites() {
    try {
      const data = fs.readFileSync(this.favoritesFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading favorites file:', error);
      return {};
    }
  }

  saveFavorites(favorites) {
    try {
      fs.writeFileSync(this.favoritesFile, JSON.stringify(favorites, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving favorites file:', error);
      return false;
    }
  }

  getUserFavorites(userId) {
    const allFavorites = this.getFavorites();
    return allFavorites[userId] || [];
  }

  addFavorite(userId, productData) {
    const allFavorites = this.getFavorites();
    if (!allFavorites[userId]) {
      allFavorites[userId] = [];
    }
    
    const exists = allFavorites[userId].find(fav => fav._id === productData._id);
    if (!exists) {
      allFavorites[userId].push(productData);
      this.saveFavorites(allFavorites);
    }
    
    return allFavorites[userId];
  }

  removeFavorite(userId, productId) {
    const allFavorites = this.getFavorites();
    if (allFavorites[userId]) {
      allFavorites[userId] = allFavorites[userId].filter(fav => fav._id !== productId);
      this.saveFavorites(allFavorites);
    }
    return allFavorites[userId] || [];
  }

  clearFavorites(userId) {
    const allFavorites = this.getFavorites();
    allFavorites[userId] = [];
    this.saveFavorites(allFavorites);
    return [];
  }

  // Initialize with default admin user
  initializeDefaultUsers() {
    const users = this.getUsers();
    
    // Check if admin user exists
    const adminExists = users.find(user => user.email === 'admin@luxecommerce.com');
    
    if (!adminExists) {
      console.log('Creating default admin user...');
      this.createUser({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@luxecommerce.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', // AdminPassword123!
        role: 'admin',
        phone: '+1-555-0100'
      });
    }

    // Check if sample customer exists
    const customerExists = users.find(user => user.email === 'john.doe@example.com');
    
    if (!customerExists) {
      console.log('Creating default customer user...');
      this.createUser({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', // Password123!
        role: 'customer',
        phone: '+1-555-0101'
      });
    }
    
    // Initialize sample data
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Initialize categories if empty
    const categories = this.getCategories();
    if (categories.length === 0) {
      const sampleCategories = [
        { _id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
        { _id: '2', name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
        { _id: '3', name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies' },
        { _id: '4', name: 'Sports', slug: 'sports', description: 'Sports equipment and accessories' },
        { _id: '5', name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care products' }
      ];
      this.saveCategories(sampleCategories);
      console.log('✅ Initialized sample categories');
    }

    // Initialize products if empty
    const products = this.getProducts();
    if (products.length === 0) {
      const sampleProducts = [
        {
          _id: '1',
          name: 'Premium Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 299.99,
          originalPrice: 399.99,
          category: 'Electronics',
          brand: 'AudioTech',
          sku: 'AT-WH-001',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', isMain: true }],
          inventory: { stock: 50, lowStockThreshold: 10 },
          status: 'active',
          featured: true,
          rating: 4.8,
          reviewCount: 324,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Smart Fitness Watch',
          description: 'Advanced fitness tracking with heart rate monitoring',
          price: 199.99,
          originalPrice: 249.99,
          category: 'Electronics',
          brand: 'FitTech',
          sku: 'FT-SW-001',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', isMain: true }],
          inventory: { stock: 30, lowStockThreshold: 5 },
          status: 'active',
          featured: true,
          rating: 4.6,
          reviewCount: 189,
          createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          name: 'Designer Handbag',
          description: 'Luxury leather handbag with premium craftsmanship',
          price: 599.99,
          category: 'Fashion',
          brand: 'LuxeFashion',
          sku: 'LF-HB-001',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
          images: [{ url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', isMain: true }],
          inventory: { stock: 25, lowStockThreshold: 5 },
          status: 'active',
          featured: false,
          rating: 4.9,
          reviewCount: 156,
          createdAt: new Date().toISOString()
        }
      ];
      this.saveProducts(sampleProducts);
      console.log('✅ Initialized sample products');
    }
  }
}

module.exports = new FileDB();