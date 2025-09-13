const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxecommerce');
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Sample data
const categories = [
  {
    name: 'Electronics',
    description: 'Latest electronic gadgets and devices',
    image: {
      url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
      alt: 'Electronics category'
    },
    icon: 'FiSmartphone',
    color: '#3b82f6',
    isFeatured: true,
    sortOrder: 1
  },
  {
    name: 'Fashion',
    description: 'Trendy clothing and accessories',
    image: {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
      alt: 'Fashion category'
    },
    icon: 'FiShirt',
    color: '#ec4899',
    isFeatured: true,
    sortOrder: 2
  },
  {
    name: 'Home & Garden',
    description: 'Everything for your home and garden',
    image: {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      alt: 'Home & Garden category'
    },
    icon: 'FiHome',
    color: '#10b981',
    isFeatured: true,
    sortOrder: 3
  },
  {
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    image: {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      alt: 'Sports & Fitness category'
    },
    icon: 'FiActivity',
    color: '#f59e0b',
    isFeatured: true,
    sortOrder: 4
  },
  {
    name: 'Books & Media',
    description: 'Books, movies, music and more',
    image: {
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      alt: 'Books & Media category'
    },
    icon: 'FiBook',
    color: '#8b5cf6',
    isFeatured: false,
    sortOrder: 5
  }
];

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@luxecommerce.com',
    password: 'AdminPassword123!',
    role: 'admin',
    isVerified: true,
    phone: '+1-555-0100'
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
    role: 'customer',
    isVerified: true,
    phone: '+1-555-0101',
    addresses: [{
      type: 'home',
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      isDefault: true
    }]
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'Password123!',
    role: 'customer',
    isVerified: true,
    phone: '+1-555-0102',
    addresses: [{
      type: 'home',
      firstName: 'Jane',
      lastName: 'Smith',
      addressLine1: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      isDefault: true
    }]
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    password: 'Password123!',
    role: 'customer',
    isVerified: true,
    phone: '+1-555-0103'
  },
  {
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@example.com',
    password: 'Password123!',
    role: 'customer',
    isVerified: true,
    phone: '+1-555-0104'
  }
];

const products = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system.',
    shortDescription: 'Latest iPhone with titanium design and A17 Pro chip',
    price: 1199,
    comparePrice: 1299,
    brand: 'Apple',
    sku: 'IPH15PM-256-NT',
    images: [{
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      alt: 'iPhone 15 Pro Max',
      isMain: true
    }],
    inventory: {
      stock: 50,
      lowStockThreshold: 10
    },
    status: 'active',
    featured: true,
    tags: ['smartphone', 'apple', 'premium', 'new'],
    specifications: [
      { name: 'Display', value: '6.7-inch Super Retina XDR' },
      { name: 'Chip', value: 'A17 Pro' },
      { name: 'Storage', value: '256GB' },
      { name: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto' }
    ]
  },
  {
    name: 'MacBook Pro 16-inch',
    description: 'Supercharged by M3 Pro and M3 Max chips. Built for all the ways you work.',
    shortDescription: 'Professional laptop with M3 Pro chip',
    price: 2499,
    comparePrice: 2699,
    brand: 'Apple',
    sku: 'MBP16-M3P-512',
    images: [{
      url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      alt: 'MacBook Pro 16-inch',
      isMain: true
    }],
    inventory: {
      stock: 25,
      lowStockThreshold: 5
    },
    status: 'active',
    featured: true,
    tags: ['laptop', 'apple', 'professional', 'M3'],
    specifications: [
      { name: 'Display', value: '16.2-inch Liquid Retina XDR' },
      { name: 'Chip', value: 'Apple M3 Pro' },
      { name: 'Memory', value: '18GB unified memory' },
      { name: 'Storage', value: '512GB SSD' }
    ]
  },
  {
    name: 'Premium Leather Jacket',
    description: 'Handcrafted genuine leather jacket with premium finishing and modern design.',
    shortDescription: 'Genuine leather jacket with modern design',
    price: 299,
    comparePrice: 399,
    brand: 'LuxeFashion',
    sku: 'LJ-BLK-L',
    images: [{
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      alt: 'Premium Leather Jacket',
      isMain: true
    }],
    variants: [{
      name: 'Size',
      options: [
        { name: 'Small', value: 'S', stock: 10 },
        { name: 'Medium', value: 'M', stock: 15 },
        { name: 'Large', value: 'L', stock: 12 },
        { name: 'X-Large', value: 'XL', stock: 8 }
      ]
    }],
    inventory: {
      stock: 45,
      lowStockThreshold: 10
    },
    status: 'active',
    featured: true,
    tags: ['jacket', 'leather', 'fashion', 'premium']
  },
  {
    name: 'Smart Home Security Camera',
    description: '4K Ultra HD security camera with night vision, two-way audio, and smart detection.',
    shortDescription: '4K security camera with smart features',
    price: 199,
    comparePrice: 249,
    brand: 'SecureHome',
    sku: 'SHC-4K-001',
    images: [{
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      alt: 'Smart Security Camera',
      isMain: true
    }],
    inventory: {
      stock: 75,
      lowStockThreshold: 15
    },
    status: 'active',
    featured: false,
    tags: ['security', 'camera', 'smart-home', '4k'],
    specifications: [
      { name: 'Resolution', value: '4K Ultra HD (3840x2160)' },
      { name: 'Night Vision', value: 'Up to 30 feet' },
      { name: 'Audio', value: 'Two-way audio' },
      { name: 'Storage', value: 'Cloud & Local SD card' }
    ]
  },
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    shortDescription: 'Wireless headphones with noise cancellation',
    price: 149,
    comparePrice: 199,
    brand: 'AudioTech',
    sku: 'ATH-WL-001',
    images: [{
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      alt: 'Wireless Bluetooth Headphones',
      isMain: true
    }],
    inventory: {
      stock: 100,
      lowStockThreshold: 20
    },
    status: 'active',
    featured: true,
    tags: ['headphones', 'wireless', 'bluetooth', 'noise-cancellation'],
    specifications: [
      { name: 'Battery Life', value: '30 hours with ANC off' },
      { name: 'Connectivity', value: 'Bluetooth 5.0' },
      { name: 'Noise Cancellation', value: 'Active Noise Cancellation' },
      { name: 'Weight', value: '250g' }
    ]
  }
];

// Seed functions
const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Seeded ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Seeded ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

const seedProducts = async (categories, users) => {
  try {
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const adminUser = users.find(user => user.role === 'admin');
    
    // Assign categories to products
    const productsWithCategories = products.map((product, index) => ({
      ...product,
      category: categories[index % categories.length]._id,
      createdBy: adminUser._id
    }));

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Seeded ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

const seedOrders = async (users, products) => {
  try {
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    const customers = users.filter(user => user.role === 'customer');
    const sampleOrders = [];

    // Create sample orders
    for (let i = 0; i < 10; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const orderProducts = products.slice(0, Math.floor(Math.random() * 3) + 1);
      
      const items = orderProducts.map(product => ({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: Math.floor(Math.random() * 3) + 1,
        image: {
          url: product.images[0]?.url,
          alt: product.images[0]?.alt
        }
      }));

      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
      const total = subtotal + tax + shipping;

      const order = {
        customer: customer._id,
        items,
        pricing: {
          subtotal,
          tax: { amount: tax, rate: 0.08 },
          shipping: { amount: shipping, method: 'Standard' },
          total
        },
        status: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 5)],
        paymentStatus: 'paid',
        paymentMethod: {
          type: 'credit_card',
          details: {
            last4: '4242',
            brand: 'Visa',
            holderName: `${customer.firstName} ${customer.lastName}`
          }
        },
        shippingAddress: customer.addresses[0] || {
          firstName: customer.firstName,
          lastName: customer.lastName,
          addressLine1: '123 Sample St',
          city: 'Sample City',
          state: 'SC',
          postalCode: '12345',
          country: 'United States'
        },
        billingAddress: customer.addresses[0] || {
          firstName: customer.firstName,
          lastName: customer.lastName,
          addressLine1: '123 Sample St',
          city: 'Sample City',
          state: 'SC',
          postalCode: '12345',
          country: 'United States'
        },
        shipping: {
          method: 'Standard Shipping',
          carrier: 'FedEx'
        }
      };

      sampleOrders.push(order);
    }

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Seeded ${createdOrders.length} orders`);
    return createdOrders;
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    const categories = await seedCategories();
    const users = await seedUsers();
    const products = await seedProducts(categories, users);
    const orders = await seedOrders(users, products);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Seeding Summary:
   • ${categories.length} Categories
   • ${users.length} Users (1 Admin, ${users.length - 1} Customers)
   • ${products.length} Products
   • ${orders.length} Orders

🔐 Admin Credentials:
   Email: admin@luxecommerce.com
   Password: AdminPassword123!

🛍️  Sample Customer:
   Email: john.doe@example.com
   Password: Password123!
    `);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
