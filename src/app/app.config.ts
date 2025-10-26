import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({
    projectId: "adv-web-game",
    appId: "1:496157083071:web:5702cb2df3fd21fdfa4d0a",
    storageBucket: "adv-web-game.firebasestorage.app",
    apiKey: "AIzaSyCuTVnGttiKZW6vRzafLBlcu815X_DERbw",
    authDomain: "adv-web-game.firebaseapp.com",
    messagingSenderId: "496157083071",
    measurementId: "G-BBDMEW70P8"
    })), provideFirestore(() => getFirestore())
  ]
};
