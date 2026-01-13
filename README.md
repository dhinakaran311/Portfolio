# Dhinakaran's Portfolio

A modern, responsive personal portfolio website built with React, showcasing my projects, skills, and professional journey.

## 🚀 Features

- **Responsive Design** – Optimized for all screen sizes
- **Dark/Light Mode** – Theme toggle for user preference
- **Dynamic Content** – Projects, skills, experience, and certifications
- **Smooth Animations** – Powered by Framer Motion
- **Contact Form** – EmailJS integration for direct messaging
- **Firebase Backend** – Real-time data sync and storage
- **Google Analytics** – Traffic and engagement tracking

## 🛠️ Tech Stack

- **Frontend:** React, JavaScript, CSS
- **Animation:** Framer Motion
- **Backend:** Firebase (Firestore, Auth)
- **Form Handling:** React Hook Form, EmailJS
- **Deployment:** Netify

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/dhinakaran311/Portfolio.git

# Navigate to the project
cd Portfolio

# Install dependencies
npm install

# Start development server
npm start
```

## 🔧 Environment Variables

Create a `.env` file with the following:

```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
REACT_APP_ADMIN_EMAIL=your_admin_email@example.com
REACT_APP_KEYONE=first key
REACT_APP_KEYTWO=second key
```

**Note:** 
- `REACT_APP_KEYONE` and `REACT_APP_KEYTWO` are used for the keyboard shortcut to open the admin login modal (Alt+D then Alt+A)
- These should be lowercase letters (default: 'd' and 'a')
- Create a `.env` file in the root directory with your actual values

## 📂 Project Structure

```
Portfolio/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React context providers
│   ├── App.js        # Main application component
│   ├── styles.css    # Global styles
│   └── index.js      # Entry point
├── .env              # Environment variables
└── package.json      # Dependencies
```

## 🌐 Live Demo

Visit the live portfolio at: [dhinakaran-portfolio.vercel.app](https://dhinakaran-portfolio.vercel.app)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ by Dhinakaran
