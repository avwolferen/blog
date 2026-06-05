'use client';

import { useEffect, useState } from 'react';
import GoogleAnalytics from '@/components/GoogleAnalytics';

type ConsentChoice = 'accepted' | 'rejected' | 'unset';

const CONSENT_STORAGE_KEY = 'analytics-consent';

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentChoice>('unset');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);

    if (storedConsent === 'accepted' || storedConsent === 'rejected') {
      setConsent(storedConsent);
    }

    setIsHydrated(true);
  }, []);

  const setConsentChoice = (choice: Exclude<ConsentChoice, 'unset'>) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch (error) {
      console.warn('Unable to persist analytics consent preference.', error);
    }
    setConsent(choice);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {consent === 'accepted' ? <GoogleAnalytics /> : null}
      {consent === 'unset' ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We use Google Analytics cookies to understand site usage and improve this blog. Accept to allow analytics tracking, or reject to continue without analytics cookies.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConsentChoice('rejected')}
                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setConsentChoice('accepted')}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
