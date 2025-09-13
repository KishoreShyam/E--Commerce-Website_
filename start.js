#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting LuxeCommerce Platform');
console.log('==================================\n');

// Check if setup has been run
const customerEnvPath = path.join(__dirname, 'customer-server', '.env');
const adminEnvPath = path.join(__dirname, 'admin-server', '.env');

if (!fs.existsSync(customerEnvPath) || !fs.existsSync(adminEnvPath)) {
  console.log('⚠️  Environment files not found. Running setup first...\n');
  const setupProcess = spawn('node', ['setup.js'], { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  setupProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Setup completed. Starting services...\n');
      startServices();
    } else {
      console.error('❌ Setup failed. Please run setup manually: node setup.js');
      process.exit(1);
    }
  });
} else {
  startServices();
}

function startServices() {
  const services = [
    {
      name: 'Customer Server',
      command: 'npm',
      args: ['run', 'dev'],
      cwd: path.join(__dirname, 'customer-server'),
      color: '\x1b[32m', // Green
      port: 5000
    },
    {
      name: 'Admin Server',
      command: 'npm',
      args: ['run', 'dev'],
      cwd: path.join(__dirname, 'admin-server'),
      color: '\x1b[34m', // Blue
      port: 5001
    },
    {
      name: 'Customer Frontend',
      command: 'npm',
      args: ['start'],
      cwd: path.join(__dirname, 'client'),
      color: '\x1b[36m', // Cyan
      port: 3000
    },
    {
      name: 'Admin Dashboard',
      command: 'npm',
      args: ['start'],
      cwd: path.join(__dirname, 'admin-dashboard'),
      color: '\x1b[35m', // Magenta
      port: 3001
    }
  ];

  const processes = [];

  console.log('🔄 Starting all services...\n');

  services.forEach((service, index) => {
    setTimeout(() => {
      console.log(`${service.color}🚀 Starting ${service.name}...\x1b[0m`);
      
      const process = spawn(service.command, service.args, {
        cwd: service.cwd,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true
      });

      process.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(`${service.color}[${service.name}]\x1b[0m ${output}`);
        }
      });

      process.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output && !output.includes('Warning:') && !output.includes('webpack-dev-server')) {
          console.log(`${service.color}[${service.name}]\x1b[0m ${output}`);
        }
      });

      process.on('close', (code) => {
        if (code !== 0) {
          console.log(`${service.color}❌ ${service.name} exited with code ${code}\x1b[0m`);
        }
      });

      processes.push(process);
    }, index * 2000); // Stagger startup by 2 seconds
  });

  // Display access information after a delay
  setTimeout(() => {
    console.log('\n🌐 LuxeCommerce is now running!');
    console.log('=====================================');
    console.log('📱 Customer Store:    http://localhost:3000');
    console.log('🎛️  Admin Dashboard:   http://localhost:3001');
    console.log('🔌 Customer API:      http://localhost:5000');
    console.log('🔌 Admin API:         http://localhost:5001');
    console.log('\n🔐 Default Login Credentials:');
    console.log('👤 Admin:    admin@luxecommerce.com / AdminPassword123!');
    console.log('👤 Customer: john.doe@example.com / Password123!');
    console.log('\n💡 Tips:');
    console.log('• Seed database first: cd customer-server && node scripts/seedData.js');
    console.log('• Press Ctrl+C to stop all services');
    console.log('• Check individual service logs above for any issues');
  }, 10000);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down all services...');
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
