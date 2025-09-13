// Simple in-memory database for development
class MemoryDB {
  constructor() {
    this.users = new Map();
    this.favorites = new Map();
    this.addresses = new Map();
    this.nextId = 1;
  }

  // User operations
  createUser(userData) {
    const id = this.nextId++;
    const user = {
      _id: id.toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: true, // Skip email verification for development
      loginAttempts: 0,
      role: 'customer'
    };
    this.users.set(user.email, user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.get(email) || null;
  }

  findUserById(id) {
    for (const user of this.users.values()) {
      if (user._id === id) return user;
    }
    return null;
  }

  updateUser(id, updates) {
    const user = this.findUserById(id);
    if (user) {
      Object.assign(user, updates, { updatedAt: new Date() });
      this.users.set(user.email, user);
    }
    return user;
  }

  // Favorites operations
  getUserFavorites(userId) {
    const userFavs = this.favorites.get(userId) || [];
    return userFavs;
  }

  addFavorite(userId, productData) {
    const userFavs = this.favorites.get(userId) || [];
    const exists = userFavs.find(fav => fav._id === productData._id);
    if (!exists) {
      userFavs.push(productData);
      this.favorites.set(userId, userFavs);
    }
    return userFavs;
  }

  removeFavorite(userId, productId) {
    const userFavs = this.favorites.get(userId) || [];
    const filtered = userFavs.filter(fav => fav._id !== productId);
    this.favorites.set(userId, filtered);
    return filtered;
  }

  clearFavorites(userId) {
    this.favorites.set(userId, []);
    return [];
  }

  // Address operations
  getUserAddresses(userId) {
    return this.addresses.get(userId) || [];
  }

  addAddress(userId, addressData) {
    const userAddresses = this.addresses.get(userId) || [];
    const address = {
      _id: this.nextId++,
      ...addressData,
      createdAt: new Date()
    };
    userAddresses.push(address);
    this.addresses.set(userId, userAddresses);
    return address;
  }

  updateAddress(userId, addressId, updates) {
    const userAddresses = this.addresses.get(userId) || [];
    const address = userAddresses.find(addr => addr._id == addressId);
    if (address) {
      Object.assign(address, updates, { updatedAt: new Date() });
      this.addresses.set(userId, userAddresses);
    }
    return address;
  }

  deleteAddress(userId, addressId) {
    const userAddresses = this.addresses.get(userId) || [];
    const filtered = userAddresses.filter(addr => addr._id != addressId);
    this.addresses.set(userId, filtered);
    return true;
  }
}

module.exports = new MemoryDB();
