# M-Well Healthcare Application - Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Node.js Not Found

**Error:** `'node' is not recognized as an internal or external command`

**Solutions:**
1. **Restart your computer** after installing Node.js
2. **Check PATH environment variable:**
   ```powershell
   echo $env:PATH
   ```
3. **Manually add Node.js to PATH:**
   - Open System Properties → Environment Variables
   - Add `C:\Program Files\nodejs\` to your PATH
   - Restart Command Prompt

### 2. npm Not Found

**Error:** `'npm' is not recognized as an internal or external command`

**Solutions:**
1. **Reinstall Node.js** (npm comes with Node.js)
2. **Check if npm exists:**
   ```powershell
   Test-Path "C:\Program Files\nodejs\npm.cmd"
   ```
3. **Use full path:**
   ```powershell
   "C:\Program Files\nodejs\npm.cmd" install
   ```

### 3. Permission Denied Errors

**Error:** `EACCES: permission denied`

**Solutions:**
1. **Run as Administrator:**
   - Right-click Command Prompt → "Run as administrator"
   - Run your npm commands

2. **Change npm directory:**
   ```bash
   npm config set prefix %APPDATA%\npm
   ```

3. **Fix npm permissions:**
   ```bash
   npm config set cache %APPDATA%\npm-cache
   ```

### 4. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solutions:**
1. **Use different port:**
   ```bash
   npm run dev -- --port 3001
   ```

2. **Kill process using port 3000:**
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```

### 5. Dependencies Won't Install

**Error:** Various npm install errors

**Solutions:**
1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete and reinstall:**
   ```bash
   rmdir /s node_modules
   del package-lock.json
   npm install
   ```

3. **Use different registry:**
   ```bash
   npm install --registry https://registry.npmjs.org/
   ```

### 6. TypeScript Errors

**Error:** Cannot find module 'react' or similar

**Solutions:**
1. **Install dependencies first:**
   ```bash
   npm install
   ```

2. **Check TypeScript configuration:**
   ```bash
   npx tsc --noEmit
   ```

3. **Restart TypeScript server** in your IDE

### 7. Build Errors

**Error:** Build fails with various errors

**Solutions:**
1. **Check for syntax errors:**
   ```bash
   npm run lint
   ```

2. **Type check:**
   ```bash
   npm run type-check
   ```

3. **Clean build:**
   ```bash
   npm run clean
   npm install
   npm run build
   ```

## 🔧 Advanced Troubleshooting

### Check Node.js Installation
```powershell
# Check if Node.js is installed
where node

# Check version
node --version

# Check npm version
npm --version

# Check global packages
npm list -g --depth=0
```

### Check Project Dependencies
```bash
# List installed packages
npm list

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### Environment Variables
```powershell
# Check PATH
echo $env:PATH

# Check npm configuration
npm config list

# Check npm cache location
npm config get cache
```

### Network Issues
```bash
# Check npm registry
npm config get registry

# Set npm registry
npm config set registry https://registry.npmjs.org/

# Check connectivity
ping registry.npmjs.org
```

## 🆘 Still Having Issues?

### 1. Complete Fresh Install
```bash
# Delete everything
rmdir /s node_modules
del package-lock.json
del .next

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### 2. Use Alternative Package Managers
```bash
# Using Yarn
yarn install
yarn dev

# Using pnpm
pnpm install
pnpm dev
```

### 3. Check System Requirements
- **Windows 10/11** (64-bit recommended)
- **8GB RAM** minimum
- **2GB free disk space**
- **Internet connection** for downloading packages

### 4. Contact Support
If you're still having issues:
1. Check the [Node.js documentation](https://nodejs.org/en/docs/)
2. Check the [Next.js documentation](https://nextjs.org/docs)
3. Check the [npm documentation](https://docs.npmjs.com/)

## 📋 Quick Checklist

Before asking for help, make sure you've tried:

- [ ] Restarted your computer after installing Node.js
- [ ] Run Command Prompt as Administrator
- [ ] Checked that Node.js and npm are in your PATH
- [ ] Cleared npm cache (`npm cache clean --force`)
- [ ] Deleted `node_modules` and `package-lock.json`
- [ ] Tried `npm install` again
- [ ] Checked for antivirus/firewall blocking
- [ ] Tried a different port (`npm run dev -- --port 3001`)

## 🎯 Success Indicators

You know everything is working when:
- `node --version` returns a version number
- `npm --version` returns a version number
- `npm install` completes without errors
- `npm run dev` starts the development server
- You can access http://localhost:3000 in your browser





