const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(process.cwd(), 'user-data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize with default admin user
const defaultUsers = [
  {
    id: '1',
    email: 'admin@mwell.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  }
]

fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2))

console.log('✅ Admin user created successfully!')
console.log('📧 Email: admin@mwell.com')
console.log('🔑 Password: admin123')
console.log('👑 Role: ADMIN')
console.log('')
console.log('🌐 Access URLs:')
console.log('- Login: http://localhost:3000/account')
console.log('- Admin Dashboard: http://localhost:3000/admin')
console.log('')
console.log('📁 User data stored in: user-data/users.json')

