# HMS Inventory App

**Cross-platform hjemme-inventar app** bygget med React Native (Expo), Firebase og Google Cloud-tjenester.

## 📱 Plattformer

- iOS 15+
- Android 13+ (API 33)
- Web (moderne nettlesere)

## 🚀 Kom i gang

### Forutsetninger

- Node.js 20 LTS eller nyere
- npm eller yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode 14+ (for simulator/device)
- Android: Android Studio (for emulator/device)

### Installasjon

1. **Klon repository**
```bash
git clone https://github.com/username/hms-app.git
cd hms-app
```

2. **Installer dependencies**
```bash
npm install
```

3. **Konfigurer environment variables**
```bash
cp .env.example .env
```

Rediger `.env` og legg til dine Firebase og Google Cloud credentials.

4. **Start development server**
```bash
npm start
```

Dette åpner Expo Dev Tools i nettleseren. Derfra kan du:
- Trykk `i` for iOS simulator
- Trykk `a` for Android emulator
- Trykk `w` for web browser
- Scan QR-koden med Expo Go app (iOS/Android) for å teste på fysisk enhet

## 🏗️ Prosjektstruktur

```
hms-app/
├── src/
│   ├── features/              # Feature-baserte moduler
│   │   ├── auth/             # Autentisering
│   │   ├── inventory/        # Lager/inventar
│   │   ├── scanner/          # QR/barcode scanning
│   │   ├── locations/        # Lokasjoner (hierarkisk)
│   │   ├── categories/       # Kategorier med custom fields
│   │   ├── households/       # Husholdninger og medlemmer
│   │   ├── projects/         # Prosjektstyring
│   │   ├── loans/            # Utlånshåndtering
│   │   ├── reports/          # Rapporter og eksport
│   │   ├── printing/         # Printer-støtte
│   │   ├── analytics/        # Analytics og insights
│   │   ├── settings/         # Innstillinger
│   │   ├── subscription/     # Abonnementshåndtering
│   │   ├── sharing/          # Deling og gjeste-tilgang
│   │   ├── search/           # Global søk
│   │   ├── achievements/     # Gamification
│   │   └── dashboard/        # Dashboard/Hjem
│   ├── shared/               # Delte komponenter og utilities
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils/            # Utility functions
│   │   └── types/            # TypeScript types
│   ├── services/             # Tjenester organisert etter provider
│   │   ├── firebase/         # Firebase services
│   │   ├── google/           # Google integrations
│   │   ├── core/             # Core app services
│   │   └── integrations/     # Third-party integrations
│   ├── navigation/           # Navigation configuration
│   ├── locales/              # Translations (nb-NO, en-US, sv-SE, da-DK)
│   ├── theme/                # Theming
│   └── config/               # Configuration files
├── .github/
│   └── workflows/            # GitHub Actions CI/CD
├── firestore.rules           # Firestore security rules
├── .env.example              # Environment variables template
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup file
└── README.md                 # This file
```

## 🧪 Testing

### Kjør alle tester
```bash
npm test
```

### Kjør tester i watch mode
```bash
npm run test:watch
```

### Generer coverage report
```bash
npm run test:coverage
```

### Linting
```bash
npm run lint
npm run lint:fix  # Auto-fix linting errors
```

### Type checking
```bash
npm run type-check
```

### Formatering
```bash
npm run format
```

## 📦 Bygg for produksjon

### iOS
```bash
npx eas build --platform ios
```

### Android
```bash
npx eas build --platform android
```

### Web
```bash
npx expo export:web
```

## 🔥 Firebase Setup

1. Opprett Firebase project på [Firebase Console](https://console.firebase.google.com/)
2. Enable følgende tjenester:
   - Authentication (Google, Apple, Email/Password)
   - Firestore Database
   - Storage
   - Cloud Functions
   - Cloud Messaging
   - Hosting (for web)
3. Legg til iOS og Android apps i Firebase
4. Last ned konfigurasjonsfiler:
   - `GoogleService-Info.plist` (iOS)
   - `google-services.json` (Android)
5. Kopier Firebase web config til `.env`

### Deploy Firestore Security Rules
```bash
firebase deploy --only firestore:rules
```

## 🌍 Google Cloud Setup

1. Opprett Google Cloud project på [Google Cloud Console](https://console.cloud.google.com/)
2. Enable følgende APIs:
   - Cloud Vision API
   - ML Kit API
   - Google Sheets API
   - Google Drive API
   - Google Calendar API
   - Google Contacts API
3. Opprett API key og legg til i `.env`

## 💳 RevenueCat Setup

1. Opprett konto på [RevenueCat](https://www.revenuecat.com/)
2. Konfigurer Pro offering:
   - Monthly: 49 NOK
   - Yearly: 490 NOK
3. Legg til API keys i `.env`

## 📖 Dokumentasjon

- [Arkitektur](/docs/ARCHITECTURE.md)
- [API Referanse](/docs/API.md)
- [Contributing Guide](/docs/CONTRIBUTING.md)
- [Deployment Guide](/docs/DEPLOYMENT.md)

## 🛠️ Teknisk Stack

- **Frontend:** React Native (Expo SDK 54+), TypeScript
- **UI Library:** React Native Paper (Material Design 3)
- **Navigation:** React Navigation v7
- **State Management:** Zustand (client), TanStack React Query (server)
- **Forms:** React Hook Form + Zod
- **Backend:** Firebase (Auth, Firestore, Storage, Functions)
- **Cloud Services:** Google Cloud (Vision, ML Kit, Sheets, Drive, Calendar)
- **Subscriptions:** RevenueCat
- **Testing:** Jest, React Native Testing Library
- **CI/CD:** GitHub Actions, Fastlane, Expo EAS

## 🌟 Features

### Core Features
- ✅ Multi-household inventory management
- ✅ QR code/barcode scanning
- ✅ Hierarchical location system
- ✅ Custom categories med dynamic fields
- ✅ Image management med WebP optimization
- ✅ Member management med role-based access
- ✅ Invitation system
- ✅ Guest sharing med access control
- ✅ Project management med Kanban board
- ✅ Loan tracking med reminders

### Advanced Features
- ✅ Push notifications (FCM)
- ✅ Reports & export (PDF, Excel, Google Sheets)
- ✅ Label printing (DYMO, Brother, Zebra)
- ✅ Analytics & insights
- ✅ Subscription system (Freemium + Pro)
- ✅ Global search
- ✅ Achievements & gamification
- ✅ Offline-first architecture
- ✅ Dark mode
- ✅ i18n (nb-NO, en-US, sv-SE, da-DK)
- ✅ Accessibility (WCAG AA)

## 📝 License

Private project - All rights reserved

## 👥 Authors

- Karsten

## 🐛 Bug Reports

Report bugs via GitHub Issues.

## 📞 Support

Email: support@hms.app

