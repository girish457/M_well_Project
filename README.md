# M-Well Healthcare Application

A modern, responsive healthcare application built with Next.js and Tailwind CSS. This application provides a comprehensive platform for healthcare services, patient management, and medical appointments.

## Features

### 🏥 **Core Healthcare Features**
- **Appointment Booking System** - Multi-step appointment scheduling with department and doctor selection
- **Doctor Profiles** - Detailed information about medical professionals and their specialties
- **Service Catalog** - Comprehensive list of medical services and departments
- **Emergency Contact** - 24/7 emergency contact information and quick access

### 🎨 **Modern UI/UX**
- **Responsive Design** - Mobile-first approach with seamless desktop experience
- **Healthcare Theme** - Professional medical color scheme with primary blues and accent greens
- **Interactive Components** - Smooth animations and hover effects
- **Accessibility** - WCAG compliant design with proper contrast and navigation

### 📱 **Pages & Sections**
- **Homepage** - Hero section, services overview, testimonials, and call-to-action
- **Services** - Detailed medical services with features and descriptions
- **About** - Company information, mission, values, and leadership team
- **Doctors** - Medical professional profiles with specialties and availability
- **Appointments** - Multi-step booking form with validation
- **Contact** - Contact information, form, and location details

### 🛠 **Technical Features**
- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Responsive Design** - Mobile-first responsive layout
- **SEO Optimized** - Meta tags and structured data

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd M-Well
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
M-Well/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── about/             # About page
│   │   ├── services/          # Services page
│   │   ├── doctors/           # Doctors page
│   │   ├── appointments/      # Appointments page
│   │   └── contact/           # Contact page
│   └── components/            # Reusable components
│       ├── Header.tsx         # Navigation header
│       ├── Footer.tsx         # Site footer
│       ├── Hero.tsx           # Hero section
│       ├── Services.tsx       # Services grid
│       ├── About.tsx          # About section
│       ├── Stats.tsx          # Statistics section
│       ├── Testimonials.tsx   # Patient testimonials
│       └── CTA.tsx            # Call-to-action section
├── public/                    # Static assets
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Customization

### Colors
The application uses a healthcare-themed color palette defined in `tailwind.config.js`:

- **Primary**: Blue tones for trust and professionalism
- **Secondary**: Gray tones for text and backgrounds
- **Accent**: Green tones for health and wellness

### Components
All components are built with Tailwind CSS and can be easily customized by modifying the class names or extending the configuration.

### Content
Update the content in each component file to match your healthcare organization's information.

## Features in Detail

### Appointment Booking
- Multi-step form with validation
- Department and doctor selection
- Time slot availability
- Patient information collection
- Confirmation system

### Doctor Profiles
- Professional information
- Specialties and experience
- Patient ratings and reviews
- Availability and location
- Direct booking integration

### Services Overview
- Comprehensive medical services
- Department-specific information
- Feature lists and descriptions
- Visual icons and layouts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please contact:
- Email: mwellcontact@gmail.com
- Phone: 1800-891-2871

---

**M-Well Healthcare** - Your Health, Our Priority

