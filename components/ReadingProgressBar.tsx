'use client';

import { useEffect, useState, useRef } from 'react';

interface CurrentPostInfo {
  slug: string;
  element: HTMLElement;
  index: number;
}

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const currentPostRef = useRef<CurrentPostInfo | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const currentPost = currentPostRef.current;
      
      if (currentPost?.element) {
        // Calculate progress within the current post
        const rect = currentPost.element.getBoundingClientRect();
        const postTop = window.scrollY + rect.top;
        const postHeight = rect.height;
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the post has been scrolled
        const scrolledInPost = scrollTop - postTop + viewportHeight;
        const scrollProgress = Math.max(0, Math.min(100, (scrolledInPost / postHeight) * 100));
        
        setProgress(scrollProgress);
      } else {
        // Fallback to document-based progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setProgress(scrollProgress);
      }
    };

    const handleCurrentPostChanged = (event: CustomEvent<CurrentPostInfo>) => {
      currentPostRef.current = event.detail;
      // Reset and recalculate progress for the new post
      updateProgress();
    };

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('currentPostChanged', handleCurrentPostChanged as EventListener);
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('currentPostChanged', handleCurrentPostChanged as EventListener);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
