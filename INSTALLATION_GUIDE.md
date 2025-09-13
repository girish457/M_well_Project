# M-Well Healthcare Application - Complete Installation Guide

## 🚀 Quick Setup (Recommended)

### Step 1: Install Node.js
1. **Download Node.js** from [https://nodejs.org/](https://nodejs.org/)
2. **Choose the LTS version** (Long Term Support)
3. **Run the installer** and follow the setup wizard
4. **Make sure to check** "Add to PATH" during installation
5. **Restart your computer** after installation

### Step 2: Verify Installation
Open a new Command Prompt or PowerShell and run:
```bash
node --version
npm --version
```
Both commands should return version numbers.

### Step 3: Install Project Dependencies
Navigate to your project directory and run:
```bash
cd E:\Mwell
npm install
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Alternative Installation Methods

### Method 1: Using Node Version Manager (nvm-windows)
1. Download nvm-windows from [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
2. Install nvm-windows
3. Open Command Prompt as Administrator
4. Run:
   ```bash
   nvm install latest
   nvm use latest
   ```

### Method 2: Using Chocolatey (Windows Package Manager)
1. Install Chocolatey from [https://chocolatey.org/](https://chocolatey.org/)
2. Open PowerShell as Administrator
3. Run:
   ```bash
   choco install nodejs
   ```

### Method 3: Using Winget (Windows Package Manager)
1. Open PowerShell as Administrator
2. Run:
   ```bash
   winget install OpenJS.NodeJS
   ```

---

## 🛠 Troubleshooting

### Problem: "npm is not recognized"
**Solution:**
1. Restart your computer after installing Node.js
2. Check if Node.js is in your PATH:
   ```bash
   echo $env:PATH
   ```
3. Manually add Node.js to PATH:
   - Open System Properties → Environment Variables
   - Add `C:\Program Files\nodejs\` to your PATH
   - Restart Command Prompt

### Problem: "Permission denied" errors
**Solution:**
1. Run Command Prompt as Administrator
2. Or configure npm to use a different directory:
   ```bash
   npm config set prefix %APPDATA%\npm
   ```

### Problem: "Port 3000 is already in use"
**Solution:**
```bash
npm run dev -- --port 3001
```

### Problem: Dependencies won't install
**Solution:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete node_modules and package-lock.json:
   ```bash
   rmdir /s node_modules
   del package-lock.json
   ```
3. Reinstall:
   ```bash
   npm install
   ```

---

## 📁 Project Structure After Installation

```
M-Well/
├── node_modules/           # Dependencies (created after npm install)
├── .next/                  # Next.js build files (created after npm run dev)
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── services/
│   │   ├── doctors/
│   │   ├── appointments/
│   │   └── contact/
│   └── components/        # React components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx
│       ├── Services.tsx
│       ├── About.tsx
│       ├── Stats.tsx
│       ├── Testimonials.tsx
│       └── CTA.tsx
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── package-lock.json      # Lock file (created after npm install)
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
└── README.md              # Project documentation
```

---

## 🎯 Available Scripts

After installation, you can use these commands:

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm install` - Install dependencies
- `npm update` - Update dependencies

---

## 🌐 Accessing the Application

Once everything is set up:

1. **Development**: http://localhost:3000
2. **Production**: After `npm run build` and `npm start`, the app will be available on the specified port

---

## 📞 Need Help?

If you're still having issues:

1. **Check Node.js Installation**:
   ```bash
   node --version
   npm --version
   ```

2. **Verify Project Dependencies**:
   ```bash
   npm list
   ```

3. **Check for Errors**:
   ```bash
   npm run lint
   ```

4. **Clear Everything and Start Fresh**:
   ```bash
   rmdir /s node_modules
   del package-lock.json
   npm install
   npm run dev
   ```

---

**Ready to go?** Follow Step 1-5 in the Quick Setup section above! 🚀





