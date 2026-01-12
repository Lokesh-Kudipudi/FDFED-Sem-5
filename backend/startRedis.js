#!/usr/bin/env node

/**
 * Redis Server Starter for Windows
 * Run: node startRedis.js
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Redis Server...');

try {
  // Try to start redis-server from node_modules
  const redisPath = path.join(__dirname, 'node_modules', '.bin', 'redis-server');
  
  const redis = spawn('node', [
    path.join(__dirname, 'node_modules', 'redis-server', 'bin', 'redis-server.js')
  ]);

  redis.stdout.on('data', (data) => {
    console.log(`✅ ${data}`);
  });

  redis.stderr.on('data', (data) => {
    console.error(`❌ ${data}`);
  });

  redis.on('close', (code) => {
    console.log(`Redis server exited with code ${code}`);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n⏹️  Stopping Redis Server...');
    redis.kill();
    process.exit(0);
  });

} catch (error) {
  console.error('Error starting Redis:', error.message);
  console.log('\n💡 Alternative: Use Docker or WSL to run Redis');
  process.exit(1);
}
