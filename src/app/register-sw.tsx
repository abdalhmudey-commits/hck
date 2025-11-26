'use client';

import { useEffect } from 'react';

export function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Since we removed basePath, the sw.js file will be at the root of the deployment
      navigator.serviceWorker
        .register(`/sw.js`)
        .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
        .catch((error) => console.error('Service Worker registration failed:', error));
    }
  }, []);

  return null;
}
