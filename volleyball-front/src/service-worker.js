/* eslint-disable no-restricted-globals */

/**
 * Phase 7 PWA Service Worker.
 * キャッシュ方針:
 * - ビルド成果物（App Shell）: Workbox precache
 * - 同一オリジン画像: StaleWhileRevalidate
 * - API（/api および別オリジンの API）: NetworkOnly（スコア・認証をキャッシュしない）
 * - ナビゲーション: App Shell（index.html）へフォールバック
 */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

/**
 * API リクエストはキャッシュせず、常にネットワークへ送る。
 */
registerRoute(
  function ({ url }) {
    const isApiPath = url.pathname.indexOf('/api') === 0;
    const isApiHost =
      url.hostname.indexOf('localhost') !== -1 &&
      (url.port === '5001' || url.port === '5000');

    return isApiPath || isApiHost;
  },
  new NetworkOnly()
);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');

/**
 * SPA のナビゲーションを index.html に束ねる。
 */
registerRoute(
  function ({ request, url }) {
    if (request.mode !== 'navigate') {
      return false;
    }

    if (url.pathname.startsWith('/_')) {
      return false;
    }

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

/**
 * 同一オリジンの画像をランタイムキャッシュする。
 */
registerRoute(
  function ({ url }) {
    const isSameOrigin = url.origin === self.location.origin;
    const isImage =
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.ico');

    return isSameOrigin && isImage;
  },
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
      }),
    ],
  })
);

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
