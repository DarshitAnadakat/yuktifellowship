# PowerNetPro - Quick Start Guide 🚀

## One-Command Setup & Run

### For macOS/Linux:
```bash
chmod +x setup.sh && ./setup.sh
```

### For Windows:
```cmd
setup.bat
```

## What This Script Does:

1. ✅ Checks if Node.js and npm are installed
2. 📦 Installs all project dependencies
3. 🔨 Builds the project
4. 🚀 Starts the development server
5. 📋 Displays all important URLs

## Access URLs:

- **Consumer App**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Admin Login**: http://localhost:5173/admin/login

## Admin Accounts:

Before logging into the admin panel, you need to:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `consumer-b6814`
3. Navigate to **Authentication → Users**
4. Click **Add User** and create accounts:
   - `asonal379@gmail.com` (set a password)
   - `omkarkolhe912@gmail.com` (set a password)
5. After creating accounts, open the `add-admin.html` file in your browser
6. Sign in with the created credentials to grant admin privileges

## Manual Setup (Alternative):

If you prefer to run commands separately:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev
```

## Features:

- ⚡ **Consumer Portal**: Energy consumption monitoring, P2P marketplace
- 🔐 **Admin Panel**: User management, transaction monitoring, analytics
- 🔥 **Real-time Updates**: Firebase integration for live data
- 📊 **Analytics**: Comprehensive dashboards and insights

## Project Structure:

```
Power-Net-User/
├── src/               # Consumer app source code
├── admin/             # Admin panel source code
│   └── src/
│       ├── pages/     # Admin pages
│       ├── contexts/  # Authentication context
│       └── config/    # Firebase config
├── setup.sh           # macOS/Linux setup script
├── setup.bat          # Windows setup script
└── add-admin.html     # Admin privilege granting interface
```

## Technology Stack:

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Animations**: Framer Motion
- **Charts**: Chart.js

## Support:

For issues or questions, check the Firebase configuration in:
- `src/config/firebase.ts`
- `admin/src/config/firebase.ts`

## Deployment:

Project is deployed at: [Your Vercel URL]

---

Made with ⚡ by PowerNetPro Team
