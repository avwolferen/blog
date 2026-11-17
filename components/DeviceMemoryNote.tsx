'use client';

import { useEffect, useState } from 'react';

interface NavigatorWithDeviceMemory extends Navigator {
  readonly deviceMemory?: number;
}

export default function DeviceMemoryNote() {
  const [deviceMemory, setDeviceMemory] = useState<number | null>(null);

  useEffect(() => {
    const memory = (navigator as NavigatorWithDeviceMemory).deviceMemory;

    if (typeof memory === 'number' && Number.isFinite(memory) && memory > 0) {
      setDeviceMemory(memory);
    }
  }, []);

  if (deviceMemory === null) {
    return null;
  }

  return (
    <p className="text-gray-600 dark:text-gray-400 text-xs mt-2" aria-live="polite">
      This device has approximately {deviceMemory} GiB of RAM.
    </p>
  );
}
