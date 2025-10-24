# Google Sign-In Setup Guide

## 📋 Få Web Client ID fra Firebase

### Steg 1: Gå til Firebase Console
1. Åpne: https://console.firebase.google.com/project/hms---home-managment-system/authentication/providers
2. Klikk på **Google** provider

### Steg 2: Aktiver Google Sign-In
1. Toggle "Enable" til ON
2. Velg **Project support email**: `khsolheim@gmail.com`
3. Klikk **Save**

### Steg 3: Hent Web Client ID
1. Under "Web SDK configuration"
2. Se **Web client ID** (ser ut som: `286543486600-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`)
3. **Kopier denne verdien**

### Steg 4: Oppdater `.env` fil
Lim inn Web Client ID i `.env` filen:

```bash
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=286543486600-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

### Steg 5: Restart Expo
```bash
# Stopp appen (Ctrl+C)
npm start
```

---

## 🍎 iOS Setup (Apple Sign-In)

### Steg 1: Aktiver i Firebase
1. Gå til: https://console.firebase.google.com/project/hms---home-managment-system/authentication/providers
2. Klikk på **Apple**
3. Toggle "Enable"
4. Klikk **Save**

### Steg 2: Apple Developer Account (kreves)
1. Gå til: https://developer.apple.com/account/resources/identifiers/list
2. Velg din App ID
3. Capabilities → **Sign In with Apple**
4. Klikk **Save**

---

## 🤖 Android Setup (SHA-1 Certificate)

### Steg 1: Generer Debug Keystore SHA-1
```bash
cd android
./gradlew signingReport
```

### Steg 2: Kopier SHA-1
Se output for "SHA1" under "Variant: debug"

### Steg 3: Legg til i Firebase
1. Gå til: https://console.firebase.google.com/project/hms---home-managment-system/settings/general
2. Under "Your apps" → Android app
3. Scroll ned til "SHA certificate fingerprints"
4. Klikk **Add fingerprint**
5. Lim inn SHA-1
6. Klikk **Save**

---

## ✅ Testing

### Test Google Sign-In:
1. Start appen
2. Gå til Login-skjermen
3. Klikk "Logg inn med Google"
4. Velg Google-konto
5. Verifiser at du blir logget inn

### Sjekk Firebase Console:
https://console.firebase.google.com/project/hms---home-managment-system/authentication/users

Du skal se ny bruker med Google provider!

---

**Sist oppdatert:** 24. oktober 2025

