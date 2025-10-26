import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { appConfig } from './app/app.config';

registerLocaleData(localeTh);

bootstrapApplication(App, {
  ...appConfig, // spread config เดิม
  providers: [
    ...(appConfig.providers || []), // ถ้ามี providers เดิม
    provideRouter([]),
    { provide: LOCALE_ID, useValue: 'th' } // ตั้งค่า locale เป็นไทย
  ]
}).catch(err => console.error(err));
