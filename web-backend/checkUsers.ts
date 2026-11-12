import { query } from './src/config/db.js';
import bcrypt from 'bcryptjs';

async function fixAndCheckUsers() {
  const adminHash = await bcrypt.hash('AdminAurora2026!', 10);
  const customerHash = await bcrypt.hash('User12345!', 10);
  console.log('Generated Admin Hash:', adminHash);
  console.log('Generated Customer Hash:', customerHash);

  await query('UPDATE users SET password = ? WHERE email = ?', [adminHash, 'admin@aurorapulse.com']);
  await query('UPDATE users SET password = ? WHERE email = ?', [customerHash, 'customer@gmail.com']);
  console.log('Updated passwords in MySQL table.');

  const users = await query('SELECT * FROM users');
  for (const u of users) {
    const isMatchAdmin = await bcrypt.compare('AdminAurora2026!', u.password);
    const isMatchCustomer = await bcrypt.compare('User12345!', u.password);
    console.log(`User ${u.email}: isMatchAdmin=${isMatchAdmin}, isMatchCustomer=${isMatchCustomer}`);
  }
}

fixAndCheckUsers().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

