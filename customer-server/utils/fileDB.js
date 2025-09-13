const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

class FileDB {
  constructor() {
    this.dbPath = path.join(__dirname, '..', 'data');
    this.usersFile = path.join(this.dbPath, 'users.json');
    this.favoritesFile = path.join(this.dbPath, 'favorites.json');
    
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
  }
}

module.exports = new FileDB();