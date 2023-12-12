# Vintellect

This is the repository of the mobile app designed for both iOS and Android. The app has been developed by Ange Curé and [Aubertin Emmanuel](https://www.linkedin.com/in/emmanuel-aubertin/).

## Installation:

First, you need to install Node.js. If you don't have it, see [here](https://nodejs.org/en/download).

After downloading the project, you must install the dependencies:
```
git clone https://github.com/Vintellect/Mobile_App.git
cd Mobile_App && npm install
```

## Run and Try the App

Before proceeding, ensure that your backend is correctly set up. All instructions for the backend [here](https://github.com/Vintellect/deploy_backend_guide).

After that, you need to set up two files. The first one is `config.tsx`:
```typescript
export const wine_url       = "YOUR-WINE-URL";
export const feedback_url   = "YOUR-FEEDBACK-URL";
export const adminwine_url  = "YOUR-WINE-ADMIN-URL";
export const bucket_url     = "YOUR-BUCKET-URL";
```

The second one is `auth/firebaseConfig.tsx` (you can copy from `auth/firebaseConfig.example.tsx`):

```typescript
export const firebaseConfig = {
  apiKey: 'YOUR-CUSTOM-API-KEY',
  authDomain: 'GCP-IDENTITY-PLATFORM-URL',
  projectId: 'GCP-PROJECT-ID',
};
```

> ⚠️ **Ensure not to set an API key without full rights on GCP** ⚠️

Finally, you can run the app using Expo:
```
npm start
```
