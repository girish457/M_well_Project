# 🚀 M-Well Healthcare - Access Guide

## ✅ System Status: READY

The authentication system is now fully functional with file-based storage!

## 🔐 Admin Access

### **Admin Credentials:**
- **Email**: admin@mwell.com
- **Password**: admin123
- **Role**: ADMIN

### **Admin Dashboard URL:**
**http://localhost:3000/admin**

## 👤 User Access

### **Create New User:**
1. Go to: **http://localhost:3000/account**
2. Click "Sign up here"
3. Fill in the registration form
4. User will be automatically logged in

### **Login as Existing User:**
1. Go to: **http://localhost:3000/account**
2. Enter email and password
3. Click "Sign In"

## 📊 Admin Dashboard Features

The admin dashboard shows:
- **Total Users**: Count of all registered users
- **Admin Users**: Count of admin users
- **Total Appointments**: Sum of all user appointments
- **User Management Table**: 
  - User name and email
  - User role (USER/ADMIN)
  - Number of appointments
  - Join date

## 📁 Data Storage

All user data is stored in:
- **Location**: `user-data/users.json`
- **Format**: JSON file with user information
- **Backup**: File is automatically created and updated

## 🎯 Quick Test Steps

### **Test Admin Access:**
1. Open: http://localhost:3000/admin
2. You'll be redirected to login page
3. Login with: admin@mwell.com / admin123
4. You'll see the admin dashboard with user data

### **Test User Registration:**
1. Open: http://localhost:3000/account
2. Click "Sign up here"
3. Create a new user account
4. User will be logged in automatically
5. Check admin dashboard to see new user

### **Test Role-Based Access:**
1. Login as regular user
2. Try accessing: http://localhost:3000/admin
3. You'll be redirected (non-admin users can't access)

## 🔧 System Features

✅ **File-Based Storage**: No database required  
✅ **User Registration**: Create new accounts  
✅ **User Authentication**: Login/logout functionality  
✅ **Role-Based Access**: USER and ADMIN roles  
✅ **Admin Dashboard**: View all users and statistics  
✅ **Secure Routes**: Admin-only access protection  
✅ **Real-time Updates**: User data updates immediately  

## 📱 All Access URLs

- **Homepage**: http://localhost:3000
- **Account/Login**: http://localhost:3000/account
- **Admin Dashboard**: http://localhost:3000/admin
- **Appointments**: http://localhost:3000/appointments
- **Services**: http://localhost:3000/services
- **About**: http://localhost:3000/about
- **Contact**: http://localhost:3000/contact

## 🎉 Ready to Use!

The system is now fully functional. You can:
1. **Login as admin** to see the user management dashboard
2. **Register new users** to test the system
3. **View user data** in the admin panel
4. **Test role-based access** controls

All user data is stored locally in the `user-data` folder and will persist between server restarts.

