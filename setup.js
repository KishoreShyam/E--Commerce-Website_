#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 LuxeCommerce Setup Script');
console.log('============================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Function to run commands safely
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`📦 Running: ${command}`);
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    return true;
  } catch (error) {
    console.error(`❌ Failed to run: ${command}`);
    return false;
  }
}

// Function to create environment file if it doesn't exist
function createEnvFile(filePath, template) {
  if (!fs.existsSync(filePath)) {
    console.log(`📝 Creating ${filePath}`);
    fs.writeFileSync(filePath, template);
    console.log(`✅ Created ${filePath}`);
  } else {
    console.log(`⚠️  ${filePath} already exists, skipping...`);
  }
}

// Environment templates
const customerEnvTemplate = `# Database
MONGODB_URI=mongodb://localhost:27017/luxecommerce

# Server
NODE_ENV=development
PORT=5000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@luxecommerce.com
FROM_NAME=LuxeCommerce

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (Optional - for payments)
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_SECRET_KEY=sk_test_your-secret-key

# URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
ADMIN_SERVER_URL=http://localhost:5001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SENSITIVE_MAX=5

# Security
BCRYPT_SALT_ROUNDS=12
ACCOUNT_LOCKOUT_TIME=1800000
MAX_LOGIN_ATTEMPTS=5
`;

const adminEnvTemplate = `# Database
MONGODB_URI=mongodb://localhost:27017/luxecommerce

# Server
NODE_ENV=development
PORT=5001

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Customer Server
CUSTOMER_SERVER_URL=http://localhost:5000

# URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# Rate Limiting (more generous for admin)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
RATE_LIMIT_SENSITIVE_MAX=10

# Admin Security
SUPER_ADMIN_KEY=your-super-admin-key-change-in-production
ADMIN_DEFAULT_PASSWORD=AdminPassword123!

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=admin@luxecommerce.com
FROM_NAME=LuxeCommerce Admin
`;

async function setup() {
  try {
    console.log('🔧 Starting LuxeCommerce setup...\n');

    // 1. Install root dependencies
    console.log('1️⃣ Installing root dependencies...');
    if (!runCommand('npm install')) {
      throw new Error('Failed to install root dependencies');
    }

    // 2. Install client dependencies
    console.log('\n2️⃣ Installing client dependencies...');
    if (!runCommand('npm install', path.join(process.cwd(), 'client'))) {
      throw new Error('Failed to install client dependencies');
    }

    // 3. Install customer server dependencies
    console.log('\n3️⃣ Installing customer server dependencies...');
    if (!runCommand('npm install', path.join(process.cwd(), 'customer-server'))) {
      throw new Error('Failed to install customer server dependencies');
    }

    // 4. Install admin server dependencies
    console.log('\n4️⃣ Installing admin server dependencies...');
    if (!runCommand('npm install', path.join(process.cwd(), 'admin-server'))) {
      throw new Error('Failed to install admin server dependencies');
    }

    // 5. Install admin dashboard dependencies
    console.log('\n5️⃣ Installing admin dashboard dependencies...');
    if (!runCommand('npm install', path.join(process.cwd(), 'admin-dashboard'))) {
      throw new Error('Failed to install admin dashboard dependencies');
    }

    // 6. Create environment files
    console.log('\n6️⃣ Creating environment files...');
    createEnvFile(
      path.join(process.cwd(), 'customer-server', '.env'),
      customerEnvTemplate
    );
    createEnvFile(
      path.join(process.cwd(), 'admin-server', '.env'),
      adminEnvTemplate
    );

    // 7. Check MongoDB connection (optional)
    console.log('\n7️⃣ Checking MongoDB connection...');
    try {
      const mongoose = require('./customer-server/node_modules/mongoose');
      await mongoose.connect('mongodb://localhost:27017/luxecommerce', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ MongoDB connection successful');
      await mongoose.disconnect();
    } catch (error) {
      console.log('⚠️  MongoDB not running or not accessible');
      console.log('   Please ensure MongoDB is installed and running');
      console.log('   You can start MongoDB with: mongod');
    }

    // Success message
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Ensure MongoDB is running: mongod');
    console.log('2. Seed the database: cd customer-server && node scripts/seedData.js');
    console.log('3. Start all services: npm run dev');
    console.log('\n🌐 Access points:');
    console.log('• Customer Store: http://localhost:3000');
    console.log('• Admin Dashboard: http://localhost:3001');
    console.log('• Customer API: http://localhost:5000');
    console.log('• Admin API: http://localhost:5001');
    console.log('\n🔐 Default credentials:');
    console.log('• Admin: admin@luxecommerce.com / AdminPassword123!');
    console.log('• Customer: john.doe@example.com / Password123!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('• Ensure Node.js 16+ is installed');
    console.log('• Check your internet connection');
    console.log('• Try running: npm cache clean --force');
    process.exit(1);
  }
}

// Run setup
setup();
