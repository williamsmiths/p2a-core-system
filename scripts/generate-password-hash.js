const bcrypt = require('bcrypt');

async function generateHashes() {
  const superAdminPassword = 'SuperAdmin@2025!';
  const adminPassword = 'Admin@2025!';
  
  const superAdminHash = await bcrypt.hash(superAdminPassword, 12);
  const adminHash = await bcrypt.hash(adminPassword, 12);
  
  console.log('Super Admin Password Hash:');
  console.log(superAdminHash);
  console.log('\nAdmin Password Hash:');
  console.log(adminHash);
  
  console.log('\nSQL INSERT statements:');
  console.log(`-- Super Admin`);
  console.log(`INSERT INTO users (email, password_hash, role, is_active, is_email_verified, email_verified_at) VALUES ('superadmin@p2a-asean.org', '${superAdminHash}', 'super_admin', true, true, CURRENT_TIMESTAMP);`);
  console.log(`\n-- Admin`);
  console.log(`INSERT INTO users (email, password_hash, role, is_active, is_email_verified, email_verified_at) VALUES ('admin@p2a-asean.org', '${adminHash}', 'admin', true, true, CURRENT_TIMESTAMP);`);
}

generateHashes().catch(console.error);
