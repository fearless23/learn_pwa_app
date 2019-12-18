// Created in root for root scope i.e access to all Files
const staticCacheName = "food-ninja-static-cache-v2";
const staticAssets = [
  "/",
  // PAGES
  "/index.html",
  "/pages/fallback.html",
  // JS Folder
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  // CSS Folder
  "/css/materialize.min.css",
  "/css/styles.css",
  // IMAGES
  "img/dish.png",
  // URLS
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"
];

const pagesCacheName = "food-ninja-pages-cache-v2";
const routedPages = [
  // PAGES
  "/pages/about.html",
  "/pages/contact.html"
];

const addToCache = async function(cacheName, cacheAssets) {
  try {
    const store = await caches.open(cacheName);
    store.addAll(cacheAssets);
  } catch (error) {
    console.log("Error addToCache: ", err);
  }
};

const deleteOldKeys = async function(newKey) {
  try {
    const allKeys = await caches.keys();
    const oldKeys = allKeys.filter(key => key !== newKey);
    console.log("OLD Keys: ", oldKeys);
    const delOldKeys = oldKeys.map(oldKey => caches.delete(oldKey));
    return Promise.all(delOldKeys);
  } catch (error) {
    console.log("Not getting caches keys", e);
  }
};

const putInCache = async function(cacheName, keyName, data) {
  const store = await caches.open(cacheName);
  await store.put(keyName, data);
  // console.log("PUT: ", cacheName, keyName);
};

// Fired upon when service worker is installed
self.addEventListener("install", evt => {
  console.log("Service Worker is installed");
  evt.waitUntil(addToCache(staticCacheName, staticAssets));
});

// Fired upon when service worker is activated
self.addEventListener("activate", evt => {
  console.log("Service Worker is activated");
  evt.waitUntil(deleteOldKeys(staticCacheName));
});

const limitCacheSize = async function(name, size) {
  const store = await caches.open(name);
  const keys = await store.keys();
  // RECURSION Method
  if (keys.length > size) {
    await store.delete(keys[0]);
    await limitCacheSize(name, size);
  }
  // PROMISE.ALL Method
  // const proms$ = [];
  // for (let i = 0; i < keys.length - size; i++) {
  //   console.log(keys[i]);
  //   proms$.push(store.delete(keys[i]));
  // }
  // await Promise.all(proms$);
};

/*
When assets are not present in cache then app go online to get.
After response comes back, we can cache some of these
which are different from ones cached on install
like pagesAssets when user visits those pages.
*/
const fetcher = async function(evt, cacheName) {
  const url = evt.request.url;
  try {
    const cacheRes = await caches.match(evt.request);
    // console.log(`From SW: ${cacheRes ? "TRUE" : "FALSE"} ${url}`);
    if (cacheRes) return cacheRes;
    else {
      const fetchRes = await fetch(evt.request);
      // Check if url matches ones in pagesCache
      await putInCache(cacheName, url, fetchRes.clone());
      await limitCacheSize(cacheName, 3);
      return fetchRes;
    }
  } catch (error) {
    console.log("FETCHER", error);
    if (url.includes(".html")) {
      const fallBackHTML = await caches.match("/pages/fallback.html");
      return fallBackHTML;
    }
  }
};

// Fetch...
self.addEventListener("fetch", evt => {
  evt.respondWith(fetcher(evt, pagesCacheName));
});
