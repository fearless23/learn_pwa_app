// Created in root for root scope i.e access to all Files

// Fired upon when service worker is installed
self.addEventListener('install', evt => {
  console.log("Service Worker is installed", evt)
})

// Fired upon when service worker is activated
self.addEventListener('activate', evt => {
  console.log("Service Worker is activated", evt)
})

// Fetch...
self.addEventListener('fetch', evt => {
  console.log("Fetch Event: ", evt)
})