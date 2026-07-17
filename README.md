# Dhinakaran's Portfolio

A modern, feature-rich personal portfolio website built with React, showcasing projects, skills, and professional journey with an integrated admin dashboard for real-time content management.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://portfoliodk311.netlify.app)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.12.2-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Technical Features

### User Experience
- **Responsive Design**: Adapts to all screen sizes and devices.
- **Dark/Light Mode**: Theme toggling with smooth transitions.
- **Smooth Animations**: High-quality interactions powered by Framer Motion.
- **Custom Cursor Follower**: Interactive desktop cursor effects.
- **Mobile-Optimized**: Responsive navigation menu.
- **Scroll to Top**: Quick navigation to the top of the page.

### Portfolio Sections
- **Hero Section**: Dynamic typing animation showcasing professional roles.
- **About Me**: Visual highlight cards and animated personal profile.
- **Skills**: Skill visualization with proficiency tracking and technology icons.
- **Projects**: Portfolio showcase with tags, descriptions, GitHub repository links, and live demonstrations.
- **Experience**: Timeline of professional journey with expandable detail cards.
- **Achievements**: Chronological achievement and awards timeline.
- **Certifications**: Professional certification gallery with image and PDF support.
- **Contact Form**: Direct messaging integration through EmailJS.

### Admin and Data Management
- **Cloudinary Integration**: Direct, unsigned image and PDF uploads for projects and certifications.
- **Automated Previews**: Real-time PDF-to-thumbnail generation for certificates.
- **Secure Authentication**: Admin login system powered by Firebase Authentication.
- **Secret Shortcut Access**: Keyboard-driven administrative access (Alt+Key Combination).
- **Real-time Content Management**: In-browser editing tools for all portfolio sections.
- **Data Synchronization**: Automatic bidirectional synchronization with Firebase Firestore.
- **Data Persistence**: LocalStorage fallback for offline data viewing.

### Continuous Integration and Development
- **CI/CD Pipeline**: Automated testing and build validation via GitHub Actions and Netlify.
- **Automated Unit Testing**: Logic verification for critical data services using Jest.
- **Build Validation**: Automated build checks on every push to ensure project stability.

---

## Tech Stack

### Frontend
- **Framework**: React 18.2.0
- **Language**: JavaScript (ES6+)
- **Styling**: Vanilla CSS
- **Animation**: Framer Motion
- **Icons**: React Icons
- **Markdown Rendering**: React Markdown with Remark GFM

### Backend and Services
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Media Management**: Cloudinary API
- **Form Handling**: React Hook Form
- **Messaging**: EmailJS
- **Analytics**: Google Analytics

### Development and Deployment
- **Continuous Integration**: GitHub Actions
- **Continuous Deployment**: Netlify , AWS
- **Build System**: Create React App (React Scripts 5.0.1)
- **Testing Framework**: Jest, React Testing Library

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Cloudinary account
- EmailJS account

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/dhinakaran311/Portfolio.git

# Navigate to the project directory
cd Portfolio

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

---

## Configuration

The following environment variables are required in the `.env` file:

### Firebase Configuration
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

### Cloudinary Configuration
- `REACT_APP_CLOUDINARY_CLOUD_NAME`
- `REACT_APP_CLOUDINARY_UPLOAD_PRESET`

### EmailJS Configuration
- `REACT_APP_EMAILJS_SERVICE_ID`
- `REACT_APP_EMAILJS_TEMPLATE_ID`
- `REACT_APP_EMAILJS_PUBLIC_KEY`

### Admin Configuration
- `REACT_APP_ADMIN_EMAIL`
- `REACT_APP_KEYONE` (Authentication shortcut key 1)
- `REACT_APP_KEYTWO` (Authentication shortcut key 2)

---

## Testing

```bash
# Execute automated test suite
npm test

# Run tests with coverage reporting
npm test -- --coverage
```

---

## Deployment

The project is configured for Continuous Deployment via Netlify. Every push to the `main` branch triggers a GitHub Actions CI run followed by a Netlify deployment.

### Production Environment Variables
All variables listed in the configuration section must be added to the production environment settings in Netlify.

---

## Contribution Guidelines

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/name`).
3. Commit changes (`git commit -m 'Description'`).
4. Push to the branch (`git push origin feature/name`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Contact

**Dhinakaran M S**
- Email: dhinakaranms123@gmail.com
- Portfolio: [portfoliodk311.netlify.app](https://portfoliodk311.netlify.app)
- GitHub: [dhinakaran311](https://github.com/dhinakaran311)

---

Generated with professional documentation standards.
