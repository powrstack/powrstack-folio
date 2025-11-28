#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates required environment variables before deployment
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('⚠️  .env.local file not found', colors.yellow);
    log('   Creating .env.local from template...', colors.blue);
    
    const template = `# Environment Variables for PowrStack Portfolio
# Copy this file and fill in your values

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RESUME_LOCAL_ORIGIN=http://localhost:3000
NEXT_PUBLIC_RESUME_REMOTE_ORIGIN=https://yourdomain.com

# Blog API Keys (optional)
# DEV_TO_API_KEY=
# HASHNODE_API_KEY=

# Analytics (optional)
# NEXT_PUBLIC_GA_ID=
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
`;
    
    try {
      fs.writeFileSync(envPath, template);
      log('✅ Created .env.local template', colors.green);
      log('   Please edit .env.local and add your configuration', colors.yellow);
      return false;
    } catch (error) {
      log(`❌ Error creating .env.local: ${error.message}`, colors.red);
      return false;
    }
  }
  return true;
}

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    return {};
  }
}

function validateMasterConfig() {
  log('\n📋 Validating masterConfig.js...', colors.blue);
  
  const configPath = path.join(process.cwd(), 'src', 'masterConfig.js');
  if (!fs.existsSync(configPath)) {
    log('❌ masterConfig.js not found', colors.red);
    return false;
  }
  
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const issues = [];
    
    // Check for placeholder values
    if (content.includes('your-username') || content.includes('your-dev-username')) {
      issues.push('Blog username contains placeholder values');
    }
    
    if (content.includes('yourdomain.com') && !content.includes('mdaburaihan.pro')) {
      issues.push('Site URL contains placeholder domain');
    }
    
    // Check if resume URL is configured
    if (!content.includes('resumeUrl') || content.includes('https://raw.githubusercontent.com/user/repo')) {
      issues.push('Resume URL needs to be configured with your GitHub repository');
    }
    
    if (issues.length > 0) {
      log('⚠️  Configuration issues found:', colors.yellow);
      issues.forEach(issue => log(`   - ${issue}`, colors.yellow));
      return false;
    }
    
    log('✅ masterConfig.js looks good', colors.green);
    return true;
  } catch (error) {
    log(`❌ Error reading masterConfig.js: ${error.message}`, colors.red);
    return false;
  }
}

function validateResumeJson() {
  log('\n📄 Validating resume.json...', colors.blue);
  
  const resumePath = path.join(process.cwd(), 'public', 'resume.json');
  if (!fs.existsSync(resumePath)) {
    log('❌ public/resume.json not found', colors.red);
    return false;
  }
  
  try {
    const content = fs.readFileSync(resumePath, 'utf8');
    const resume = JSON.parse(content);
    
    const requiredFields = ['basics', 'work', 'skills'];
    const missing = requiredFields.filter(field => !resume[field]);
    
    if (missing.length > 0) {
      log(`⚠️  Missing required fields: ${missing.join(', ')}`, colors.yellow);
      return false;
    }
    
    // Check for placeholder values
    if (resume.basics?.name === 'Your Name' || 
        resume.basics?.email === 'you@example.com') {
      log('⚠️  resume.json contains placeholder values', colors.yellow);
      return false;
    }
    
    log('✅ resume.json is valid', colors.green);
    return true;
  } catch (error) {
    log(`❌ Error parsing resume.json: ${error.message}`, colors.red);
    return false;
  }
}

function validateBuildOutput() {
  log('\n🔨 Checking build output...', colors.blue);
  
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    log('⚠️  No build found. Run "pnpm build" first', colors.yellow);
    return false;
  }
  
  log('✅ Next.js build found', colors.green);
  
  const workerPath = path.join(process.cwd(), '.open-next', 'worker.js');
  if (fs.existsSync(workerPath)) {
    const stats = fs.statSync(workerPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    
    if (stats.size > 1024 * 1024) {
      log(`⚠️  Worker bundle is ${sizeMB}MB (limit: 1MB compressed)`, colors.yellow);
      log('   Consider reducing dependencies or code splitting', colors.yellow);
    } else {
      log(`✅ Worker bundle size: ${sizeMB}MB`, colors.green);
    }
  }
  
  return true;
}

function main() {
  log('\n🚀 PowrStack Portfolio - Environment Validation\n', colors.magenta);
  log('═'.repeat(50), colors.blue);
  
  const checks = [
    { name: 'Environment File', fn: checkEnvFile },
    { name: 'Master Config', fn: validateMasterConfig },
    { name: 'Resume Data', fn: validateResumeJson },
    { name: 'Build Output', fn: validateBuildOutput },
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    const passed = check.fn();
    if (!passed) allPassed = false;
  });
  
  log('\n' + '═'.repeat(50), colors.blue);
  
  if (allPassed) {
    log('\n✅ All validation checks passed!', colors.green);
    log('   Ready for deployment 🚀\n', colors.green);
    process.exit(0);
  } else {
    log('\n⚠️  Some validation checks failed', colors.yellow);
    log('   Please fix the issues above before deploying\n', colors.yellow);
    process.exit(1);
  }
}

main();
