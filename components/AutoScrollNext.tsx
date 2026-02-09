'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types/blog';

interface AutoScrollNextProps {
  nextPost: BlogPost;
}

export default function AutoScrollNext({ nextPost }: AutoScrollNextProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Navigate to next post when scrolled to bottom
          setTimeout(() => {
            router.push(`/blog/${nextPost.slug}`);
          }, 500); // Small delay for better UX
        }
      },
      {
        threshold: 0.5,
        rootMargin: '100px',
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [nextPost.slug, router, isVisible]);

  return (
    <div ref={sentinelRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="p-8 rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 border border-primary-200 dark:border-primary-700">
        <p className="text-sm text-primary-600 dark:text-primary-300 mb-2">Loading next post...</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {nextPost.title}
        </h3>
      </div>
    </div>
  );
}
