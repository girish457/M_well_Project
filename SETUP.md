# M-Well Healthcare Application Setup

## Quick Start Guide

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Installation Steps

1. **Open Terminal/Command Prompt**
   Navigate to the M-Well project directory:
   ```bash
   cd E:\Mwell
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   or with yarn:
   ```bash
   yarn dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
M-Well/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx        # Homepage
│   │   ├── about/          # About page
│   │   ├── services/       # Services page
│   │   ├── doctors/        # Doctors page
│   │   ├── appointments/   # Appointments page
│   │   └── contact/        # Contact page
│   └── components/         # Reusable components
├── public/                 # Static assets
├── package.json           # Dependencies
└── tailwind.config.js     # Tailwind configuration
```

### Features Included

✅ **Complete Healthcare Website**
- Homepage with hero section and services overview
- About page with company information and team
- Services page with detailed medical services
- Doctors page with professional profiles
- Appointments page with multi-step booking form
- Contact page with form and information

✅ **Modern UI/UX**
- Responsive design (mobile-first)
- Healthcare-themed color scheme
- Smooth animations and transitions
- Professional typography and spacing

✅ **Technical Features**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React icons
- SEO optimized

### Customization

1. **Update Content**: Modify text and information in component files
2. **Change Colors**: Update the color palette in `tailwind.config.js`
3. **Add Pages**: Create new pages in the `src/app/` directory
4. **Modify Components**: Edit components in `src/components/`

### Troubleshooting

**If npm is not recognized:**
- Make sure Node.js is installed
- Restart your terminal/command prompt
- Try using the full path to npm

**If you get dependency errors:**
- Delete `node_modules` folder and `package-lock.json`
- Run `
npm install` again

**If the development server won't start:**
- Check if port 3000 is available
- Try `npm run dev -- --port 3001` to use a different port

### Support

For any issues or questions:
- Check the README.md file for detailed documentation
- Review the component files for implementation details
- Ensure all dependencies are properly installed

---

**Ready to start?** Run `npm install` followed by `npm run dev` to get started!





