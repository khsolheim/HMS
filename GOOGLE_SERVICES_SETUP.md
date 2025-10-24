# HMS Inventory - Google Services Setup Guide

## 📋 Oversikt

Denne guiden viser hvordan du setter opp alle Google/Firebase tjenester for HMS Inventory appen.

---

## 🔥 Firebase Setup

### 1. Opprett Firebase Prosjekt

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Klikk "Add project"
3. Prosjektnavn: `hms-inventory` (eller ønsket navn)
4. Aktiver Google Analytics (valgfritt)
5. Velg Analytics location: Norway
6. Klikk "Create project"

### 2. Legg til Apps

#### iOS App:
1. Klikk på iOS-ikonet i Project Overview
2. iOS bundle ID: `com.nextcore.hms` (eller din bundle ID)
3. App nickname: `HMS Inventory iOS`
4. Last ned `GoogleService-Info.plist`
5. Plasser filen i prosjektrotmappen (ikke i Git)

#### Android App:
1. Klikk på Android-ikonet
2. Android package name: `com.nextcore.hms`
3. App nickname: `HMS Inventory Android`
4. Last ned `google-services.json`
5. Plasser filen i `android/app/` (ikke i Git)

#### Web App:
1. Klikk på Web-ikonet
2. App nickname: `HMS Inventory Web`
3. Kopier Firebase config verdiene

### 3. Aktiver Firebase Services

#### Authentication:
1. Gå til **Build → Authentication**
2. Klikk "Get started"
3. Aktiver **Email/Password**
4. Aktiver **Google** sign-in
   - Velg support email
   - Legg til autorisert domene (hvis nødvendig)
5. Aktiver **Apple** sign-in (iOS)
   - Følg Apple Developer setup

#### Firestore Database:
1. Gå til **Build → Firestore Database**
2. Klikk "Create database"
3. Velg location: `europe-west1` (Netherlands - nærmest Norge)
4. Start i **Production mode**
5. Deploy security rules (se nedenfor)

#### Storage:
1. Gå til **Build → Storage**
2. Klikk "Get started"
3. Start i **Production mode**
4. Velg location: `europe-west1`
5. Deploy storage rules (se nedenfor)

#### Cloud Functions:
1. Gå til **Build → Functions**
2. Klikk "Get started"
3. Oppgrader til **Blaze plan** (pay-as-you-go)
   - Kreves for eksterne API-kall
   - Gratis tier: 2M invocations/måned

### 4. Deploy Firestore Rules

```bash
cd /path/to/hms-app
firebase deploy --only firestore:rules
```

### 5. Deploy Storage Rules

```bash
firebase deploy --only storage
```

### 6. Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

---

## ☁️ Google Cloud Platform Setup

### 1. Åpne Google Cloud Console

1. Gå til [Google Cloud Console](https://console.cloud.google.com/)
2. Velg Firebase-prosjektet ditt (samme project ID)

### 2. Aktiver APIs

Gå til **APIs & Services → Library** og aktiver følgende:

#### Cloud Vision API (Bildegjenkjenning):
1. Søk etter "Cloud Vision API"
2. Klikk "Enable"
3. Bruk: Produkt-gjenkjenning fra bilder

#### Google Sheets API (Data export):
1. Søk etter "Google Sheets API"
2. Klikk "Enable"
3. Bruk: Eksport av inventory data til Sheets

#### Google Drive API (Backup):
1. Søk etter "Google Drive API"
2. Klikk "Enable"
3. Bruk: Automatisk backup av data

#### Google Calendar API (Lånevarslinger):
1. Søk etter "Google Calendar API"
2. Klikk "Enable"
3. Bruk: Varsler for forfalte lån

#### People API (Kontakter):
1. Søk etter "People API"
2. Klikk "Enable"
3. Bruk: Velge kontakter ved utlån

### 3. Opprett Service Account (for Cloud Functions)

1. Gå til **IAM & Admin → Service Accounts**
2. Klikk "Create Service Account"
3. Navn: `hms-cloud-functions`
4. Roller:
   - Cloud Vision AI Service Agent
   - Firebase Admin SDK Administrator Service Agent
5. Klikk "Done"

### 4. Generer API Keys

1. Gå til **APIs & Services → Credentials**
2. Klikk "Create Credentials → API Key"
3. Navn: `HMS Mobile App Key`
4. Restriksjoner:
   - Application restrictions: Android apps + iOS apps
   - API restrictions: Vision API, Sheets API, Drive API
5. Kopier API key til `.env`

---

## 📱 Expo Configuration

### 1. Oppdater `.env` fil

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-web-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=hms-inventory.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=hms-inventory
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=hms-inventory.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Cloud Configuration
GOOGLE_CLOUD_API_KEY=your-cloud-api-key-here
GOOGLE_CLOUD_PROJECT_ID=hms-inventory

# Google Services
GOOGLE_WEB_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com

# RevenueCat Configuration (senere)
REVENUECAT_API_KEY_IOS=your-ios-key
REVENUECAT_API_KEY_ANDROID=your-android-key

# Environment
ENVIRONMENT=development
```

### 2. Konfigurer Google Sign-In

#### iOS (Apple Developer):
1. Gå til [Apple Developer](https://developer.apple.com/)
2. Certificates, IDs & Profiles
3. Identifiers → Your App ID
4. Aktiver "Sign In with Apple"

#### Android:
1. Generer SHA-1 certificate fingerprint:
```bash
cd android
./gradlew signingReport
```
2. Legg til SHA-1 i Firebase Console → Project Settings → Android app

---

## 🧪 Test Setup

### 1. Test Firebase Connection

```bash
npm start
# Trykk 'i' for iOS eller 'a' for Android
```

Sjekk at:
- ✅ Ingen Firebase errors i console
- ✅ Authentication fungerer
- ✅ Firestore read/write fungerer

### 2. Test Google Sign-In

1. Klikk "Logg inn med Google"
2. Velg konto
3. Verifiser at bruker opprettes i Firebase Console

### 3. Test Cloud Vision (senere i P0-32)

```typescript
// Test image recognition
const testVision = async () => {
  const result = await visionService.detectLabels(imageUri);
  console.log('Detected:', result);
};
```

---

## 🔐 Security Checklist

- ✅ Firestore rules deployed og testet
- ✅ Storage rules deployed
- ✅ API keys restricted (ikke public)
- ✅ `.env` fil IKKE i Git (.gitignore)
- ✅ Service account permissions korrekt
- ✅ OAuth consent screen konfigurert

---

## 📊 Quotas & Limits

### Firebase Free Tier (Spark Plan):
- Firestore: 50K reads/day, 20K writes/day, 1GB storage
- Storage: 5GB, 1GB/day downloads
- Authentication: Unlimited

### Firebase Blaze Plan (Pay-as-you-go):
- Første 50K reads gratis
- $0.06 per 100K reads deretter
- Cloud Functions: 2M invocations gratis

### Google Cloud Vision:
- Gratis: 1000 requests/måned
- $1.50 per 1000 requests deretter

---

## 🚀 Deploy Commands

```bash
# Deploy all Firebase services
firebase deploy

# Deploy kun Firestore rules
firebase deploy --only firestore:rules

# Deploy kun Functions
firebase deploy --only functions

# Deploy kun Hosting (web app)
firebase deploy --only hosting
```

---

## 📝 Neste Steg

1. ✅ Fullfør Firebase setup
2. ✅ Test authentication i appen
3. ✅ Deploy Firestore rules
4. 🔄 Implementer Cloud Functions (P0-16+)
5. 🔄 Integrer Google APIs (P0-31, P0-32)

---

**Sist oppdatert:** 24. oktober 2025
**Versjon:** 1.0

