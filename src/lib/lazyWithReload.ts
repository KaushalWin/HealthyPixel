import { lazy } from 'react';
import {
  safeSessionStorageGet,
  safeSessionStorageRemove,
  safeSessionStorageSet
} from './platform';
import { BRANDING_KEYS } from './branding'; 

const LAZY_RETRY_KEY = BRANDING_KEYS.lazyRetry;

export function lazyWithReload<TModule extends { default: React.ComponentType<any> }>(
  importer: () => Promise<TModule>
) {
  return lazy(async () => {
    try {
      const module = await importer();
      safeSessionStorageRemove(LAZY_RETRY_KEY);
      return module;
    } catch (error) {
      const hasRetried = safeSessionStorageGet(LAZY_RETRY_KEY) === '1';

      if (!hasRetried) {
        const retryPersisted = safeSessionStorageSet(LAZY_RETRY_KEY, '1');
        if (retryPersisted) {
          window.location.reload();
          // Stop execution after requesting reload so lazy import does not continue.
          return new Promise<never>(() => undefined);
        }
      }

      safeSessionStorageRemove(LAZY_RETRY_KEY);
      throw error;
    }
  });
}