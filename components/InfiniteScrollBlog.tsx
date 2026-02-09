'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';

interface LoadedPost {
  post: BlogPost;
  content: string;
  nextPost: BlogPost | null;
}

interface InfiniteScrollBlogProps {
  initialPost: BlogPost;
  initialContent: string;
  initialNextPost: BlogPost | null;
  previousPost: BlogPost | null;
}

export default function InfiniteScrollBlog({
  initialPost,
  initialContent,
  initialNextPost,
  previousPost,
}: InfiniteScrollBlogProps) {
  const [loadedPosts, setLoadedPosts] = useState<LoadedPost[]>([
    { post: initialPost, content: initialContent, nextPost: initialNextPost },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Get the current next post (from the last loaded post)
  const currentNextPost = loadedPosts[loadedPosts.length - 1]?.nextPost;

  // Load next post when sentinel is visible
  const loadNextPost = useCallback(async () => {
    if (isLoading || !currentNextPost) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(currentNextPost.slug)}`);
      if (response.ok) {
        const data = await response.json();
        setLoadedPosts((prev) => [
          ...prev,
          { post: data.post, content: data.content, nextPost: data.nextPost },
        ]);
      }
    } catch (error) {
      console.error('Failed to load next post:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentNextPost, isLoading]);

  // Intersection observer to load next post
  useEffect(() => {
    if (!currentNextPost) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          loadNextPost();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
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
  }, [currentNextPost, isLoading, loadNextPost]);

  // Track which post is currently in view and update URL
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    loadedPosts.forEach((loadedPost, index) => {
      const postElement = postRefs.current.get(loadedPost.post.slug);
      if (!postElement) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setCurrentPostIndex(index);
            // Update URL without reloading
            const newUrl = `/blog/${loadedPost.post.slug}`;
            if (window.location.pathname !== newUrl) {
              window.history.replaceState(
                { slug: loadedPost.post.slug, index },
                loadedPost.post.title,
                newUrl
              );
              // Update document title
              document.title = `${loadedPost.post.title} | Blog`;
            }
          }
        },
        {
          threshold: [0.3, 0.5, 0.7],
          rootMargin: '-10% 0px -10% 0px',
        }
      );

      observer.observe(postElement);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [loadedPosts]);

  // Dispatch event when current post changes (for progress bar)
  useEffect(() => {
    const currentPost = loadedPosts[currentPostIndex];
    if (currentPost) {
      const postElement = postRefs.current.get(currentPost.post.slug);
      if (postElement) {
        window.dispatchEvent(
          new CustomEvent('currentPostChanged', {
            detail: {
              slug: currentPost.post.slug,
              element: postElement,
              index: currentPostIndex,
            },
          })
        );
      }
    }
  }, [currentPostIndex, loadedPosts]);

  const setPostRef = useCallback((slug: string) => (el: HTMLElement | null) => {
    if (el) {
      postRefs.current.set(slug, el);
    }
  }, []);

  return (
    <>
      {loadedPosts.map((loadedPost, index) => (
        <article
          key={loadedPost.post.slug}
          ref={setPostRef(loadedPost.post.slug)}
          data-post-slug={loadedPost.post.slug}
          data-post-index={index}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {index > 0 && (
            <div className="mb-8 pb-8 border-b-4 border-primary-500 dark:border-primary-400">
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                Continue reading...
              </p>
            </div>
          )}

          <header className="mb-8">
            {loadedPost.post.coverImage && (
              <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={`/content/blog/${encodeURIComponent(loadedPost.post.slug)}/${encodeURIComponent(loadedPost.post.coverImage)}`}
                  alt={loadedPost.post.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {loadedPost.post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
              <time dateTime={loadedPost.post.date}>
                {format(new Date(loadedPost.post.date), 'MMMM d, yyyy')}
              </time>
              <span>•</span>
              <span>{loadedPost.post.readingTime} min read</span>
            </div>

            {loadedPost.post.tags && loadedPost.post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {loadedPost.post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="text-sm px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div
            className="prose prose-lg dark:prose-dark max-w-none prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-lg prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800"
            dangerouslySetInnerHTML={{ __html: loadedPost.content }}
          />

          {/* Show navigation only for the first post */}
          {index === 0 && (
            <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {previousPost && (
                  <Link
                    href={`/blog/${encodeURIComponent(previousPost.slug)}`}
                    className="group p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      ← Previous Post
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      {previousPost.title}
                    </div>
                  </Link>
                )}

                {loadedPost.nextPost && (
                  <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 md:text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Next Post ↓
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {loadedPost.nextPost.title}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Keep scrolling to continue reading
                    </div>
                  </div>
                )}
              </div>
            </footer>
          )}
        </article>
      ))}

      {/* Sentinel for loading next post */}
      {currentNextPost && (
        <div ref={sentinelRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-8 rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 border border-primary-200 dark:border-primary-700">
            {isLoading ? (
              <>
                <p className="text-sm text-primary-600 dark:text-primary-300 mb-2">
                  Loading next post...
                </p>
                <div className="animate-pulse">
                  <div className="h-6 bg-primary-200 dark:bg-primary-700 rounded w-3/4"></div>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-primary-600 dark:text-primary-300 mb-2">
                  Up next...
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {currentNextPost.title}
                </h3>
              </>
            )}
          </div>
        </div>
      )}

      {/* End of posts indicator */}
      {!currentNextPost && loadedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center p-8 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              You&apos;ve reached the end! 🎉
            </p>
            <Link
              href="/archive"
              className="inline-block mt-4 text-primary-600 dark:text-primary-400 hover:underline"
            >
              Browse all posts →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
