# 🚀 Dhinakaran's Portfolio

> A modern, feature-rich personal portfolio website built with React, showcasing projects, skills, and professional journey with an integrated admin dashboard for real-time content management.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://portfoliodk311.netlify.app)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.12.2-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

### **User Experience**
- 🎨 **Responsive Design** – Seamlessly adapts to all screen sizes and devices
- 🌓 **Dark/Light Mode** – Toggle between themes with smooth transitions
- ✨ **Smooth Animations** – Powered by Framer Motion for premium user interactions
- 🖱️ **Custom Cursor Follower** – Interactive cursor effects on desktop
- 📱 **Mobile-Optimized** – Full mobile menu with smooth navigation
- ⬆️ **Scroll to Top Button** – Easy navigation back to the top

### **Portfolio Sections**
- 🏠 **Hero Section** – Dynamic typing animation showcasing roles (AI/ML Engineer, Full Stack Developer, Competitive Programmer)
- 👤 **About Me** – Personal information with highlight cards and animated elements
- 💻 **Skills** – Visual skill cards with proficiency levels and technology icons
- 📂 **Projects** – Project showcase with tags, descriptions, GitHub links, and live demos
- 💼 **Experience** – Professional journey with expandable internship cards
- 🏆 **Achievements** – Competition wins and awards timeline
- 🎓 **Certifications** – Professional certifications with modal preview
- 📧 **Contact Form** – EmailJS integration for direct messaging

### **Admin Dashboard** 🔐
- 🔑 **Firebase Authentication** – Secure admin login system
- ⌨️ **Keyboard Shortcut Access** – Secret combination (Alt+firstkey+secondkey) to open login
- ✏️ **Real-time Content Editing** – Edit all sections without code changes
- 💾 **Firebase Sync** – Automatic backup and restore from Firebase
- 🔄 **Force Refresh** – Pull latest data from Firebase
- 📊 **CRUD Operations** – Create, Read, Update, Delete for all content types

### **Technical Features**
- 📝 **Markdown Support** – React Markdown with GitHub Flavored Markdown for experience descriptions
- 🎯 **Active Section Tracking** – Highlights current section in navigation
- 🔗 **Social Links** – Integrated social media connections
- 📄 **Resume Preview** – Modal for resume viewing
- 🔔 **Toast Notifications** – User feedback for all actions
- 📊 **Google Analytics** – Traffic and engagement tracking
- 💾 **LocalStorage Fallback** – Offline data persistence

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 18.2.0
- **Language:** JavaScript (ES6+)
- **Styling:** Vanilla CSS with custom animations
- **Animation:** Framer Motion
- **Icons:** React Icons
- **Markdown Rendering:** React Markdown + Remark GFM

### **Backend & Services**
- **Backend:** Firebase (Firestore, Authentication)
- **Form Handling:** React Hook Form
- **Email Service:** EmailJS (for contact form)
- **Analytics:** Google Analytics

### **Libraries & Tools**
- **Notifications:** React Toastify
- **Build Tool:** Create React App (React Scripts 5.0.1)
- **Testing:** Jest, React Testing Library
- **Deployment:** Vercel

---

## 📦 Installation

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn
- Firebase account (for backend)
- EmailJS account (for contact form)

### **Setup Steps**

```bash
# Clone the repository
git clone https://github.com/dhinakaran311/Portfolio.git

# Navigate to the project directory
cd Portfolio

# Install dependencies
npm install

# Create environment file (see Configuration below)
cp .env.example .env

# Start development server
npm start
```

The app will open at `http://localhost:3000`

---

## 🔧 Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Admin Configuration
REACT_APP_ADMIN_EMAIL=your_admin_email@example.com

# Admin Login Keyboard Shortcut (Alt+firstkey+secondkey)
# Set your own secret keys below (single lowercase letters recommended)
REACT_APP_KEYONE=your_secret_key_1
REACT_APP_KEYTWO=your_secret_key_2
```

> **⚠️ Security Note:** For the keyboard shortcut, choose your own secret keys (e.g., single letters like 'a' and 'b', or any other combination). Keep these keys private and don't share them publicly.

### **Getting API Keys**

#### **Firebase Setup**
1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Authentication (Email/Password)
3. Copy your web app configuration values to `.env`

#### **EmailJS Setup**
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service and template
3. Copy Service ID, Template ID, and Public Key to `.env`

---

## 📂 Project Structure

```
Portfolio/
├── public/
│   ├── images/              # Static images (profile, certifications, etc.)
│   └── index.html           # HTML template with meta tags
├── src/
│   ├── components/
│   │   ├── About/           # About section component
│   │   ├── Certifications/  # Certifications section & modal
│   │   ├── Contact/         # Contact form section
│   │   ├── CursorFollower/  # Custom cursor follower
│   │   ├── Experience/      # Experience section with markdown
│   │   ├── Footer/          # Footer component
│   │   ├── Hero/            # Hero section with typing effect
│   │   ├── Navbar/          # Navigation bar & mobile menu
│   │   ├── Projects/        # Projects showcase section
│   │   ├── Skills/          # Skills section with progress bars
│   │   ├── editors/         # Admin CRUD editors for all sections
│   │   ├── AchievementsSection.js
│   │   ├── DKLoader.js      # Custom loading animation
│   │   ├── LoginModal.js    # Admin login modal
│   │   ├── ResumePreviewModal.js
│   │   ├── ScrollToTopButton.jsx
│   │   └── ThemeToggle.js
│   ├── contexts/
│   │   └── AuthContext.js   # Firebase authentication context
│   ├── App.jsx              # Main application component
│   ├── firebase.js          # Firebase configuration
│   ├── firebaseService.js   # Firebase CRUD operations
│   ├── index.js             # Entry point
│   ├── styles.css           # Global styles
│   └── LoadingAnimation.css # Loading screen styles
├── .env                     # Environment variables (not in repo)
├── .env.example             # Example environment file
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

---

## 🎯 Usage

### **For Visitors**
Simply visit the [live demo](https://portfoliodk311.netlify.app) to explore the portfolio!

### **For Admin (Content Management)**

1. **Access Admin Login:**
   - Press `Alt+firstkey+secondkey` to open the login modal (keys configured in `.env`)
   - Or manually set up login via Firebase Authentication

2. **Login:**
   - Use your admin email (configured in `.env`)
   - Enter your Firebase authentication password

3. **Edit Content:**
   - Once logged in, you'll see edit buttons on each section
   - Click to add, update, or delete items
   - Changes auto-sync to Firebase

4. **Admin Features:**
   - **Backup to Firebase:** Manual backup button in navbar
   - **Restore from Firebase:** Restore previous data
   - **Force Refresh:** Pull latest Firebase data
   - **Logout:** Secure logout from admin mode

---

## 🚀 Deployment

### **Netlify (Current Deployment)**

The portfolio is currently deployed on Netlify at [portfoliodk311.netlify.app](https://portfoliodk311.netlify.app)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

Or connect your GitHub repository to Netlify for automatic deployments.

### **Alternative: Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### **Environment Variables in Production**
Make sure to add all `.env` variables in your hosting platform's environment settings (Netlify or Vercel).

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## 📱 Key Features Details

### **Keyboard Shortcuts**
- `Alt+firstkey+secondkey`: Open admin login modal (secret keys configured in `.env`)
- Navigate using navbar or smooth scroll

### **Data Persistence**
1. **Primary:** Firebase Firestore (cloud storage)
2. **Fallback:** LocalStorage (offline access)
3. **Auto-sync:** When admin is logged in

### **Animations**
- Scroll-triggered animations via Framer Motion
- Custom cursor follower (desktop only)
- Smooth page transitions
- Loading screen with custom DK loader

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Dhinakaran M S**
- 📧 Email: dhinakaranms123@gmail.com
- 🌐 Portfolio: [portfoliodk311.netlify.app](https://portfoliodk311.netlify.app)
- 💼 GitHub: [@dhinakaran311](https://github.com/dhinakaran311)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Firebase](https://firebase.google.com/) - Backend and authentication
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [EmailJS](https://www.emailjs.com/) - Email service
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Netlify](https://www.netlify.com/) - Deployment platform

---

<div align="center">

**Made with ❤️ by Dhinakaran**

*If you found this project helpful, please consider giving it a ⭐!*

</div>
