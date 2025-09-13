#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Quick Starting LuxeCommerce Platform');
console.log('=====================================\n');

// Simple MongoDB connection string for development
const mongoUri = 'mongodb://127.0.0.1:27017/luxecommerce';

// Update environment files with local MongoDB
const updateEnvFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/MONGODB_URI=.*/, `MONGODB_URI=${mongoUri}`);
    fs.writeFileSync(filePath, content);
  }
};

// Update both server env files
updateEnvFile(path.join(__dirname, 'customer-server', '.env'));
updateEnvFile(path.join(__dirname, 'admin-server', '.env'));

function startServices() {
  const services = [
    {
      name: 'Customer Server',
      command: 'npm',
      args: ['run', 'dev'],
      cwd: path.join(__dirname, 'customer-server'),
      color: '\x1b[32m',
      port: 5000
    },
    {
      name: 'Admin Server', 
      command: 'npm',
      args: ['run', 'dev'],
      cwd: path.join(__dirname, 'admin-server'),
      color: '\x1b[34m',
      port: 5001
    },
    {
      name: 'Customer Frontend',
      command: 'npm',
      args: ['start'],
      cwd: path.join(__dirname, 'client'),
      color: '\x1b[36m',
      port: 3000
    },
    {
      name: 'Admin Dashboard',
      command: 'npm',
      args: ['start'],
      cwd: path.join(__dirname, 'admin-dashboard'),
      color: '\x1b[35m',
      port: 3001
    }
  ];

  const processes = [];

  console.log('🔄 Starting services sequentially...\n');

  let serviceIndex = 0;

  const startNextService = () => {
    if (serviceIndex >= services.length) {
      console.log('\n🌐 All services started!');
      console.log('========================');
      console.log('📱 Customer Store:    http://localhost:3000');
      console.log('🎛️  Admin Dashboard:   http://localhost:3001');
      console.log('🔌 Customer API:      http://localhost:5000');
      console.log('🔌 Admin API:         http://localhost:5001');
      console.log('\n💡 Note: If MongoDB connection fails, install MongoDB locally or use MongoDB Atlas');
      return;
    }

    const service = services[serviceIndex];
    console.log(`${service.color}🚀 Starting ${service.name}...`);

    const process = spawn(service.command, service.args, {
      cwd: service.cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true
    });

    process.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('webpack') && !output.includes('compiled')) {
        console.log(`${service.color}[${service.name}]${'\x1b[0m'} ${output}`);
      }
    });

    process.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('Warning') && !output.includes('webpack')) {
        console.log(`${service.color}[${service.name}]${'\x1b[0m'} ${output}`);
      }
    });

    process.on('close', (code) => {
      if (code !== 0) {
        console.log(`${service.color}❌ ${service.name} failed to start${'\x1b[0m'}`);
      }
    });

    processes.push(process);
    serviceIndex++;
    
    // Start next service after a delay
    setTimeout(startNextService, 3000);
  };

  startNextService();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down services...');
    processes.forEach(proc => {
      if (proc && !proc.killed) {
        proc.kill('SIGTERM');
      }
    });
    setTimeout(() => {
      console.log('✅ All services stopped');
      process.exit(0);
    }, 2000);
  });
}

startServices();
