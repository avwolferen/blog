import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAllPostSlugs, getPostBySlug, getPostContent, getAdjacentPosts } from '@/lib/markdown';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import AutoScrollNext from '@/components/AutoScrollNext';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date,
        authors: ['Alex van Wolferen'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPost({ params }: { params: Params }) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    const content = await getPostContent(slug);
    const { previous, next } = getAdjacentPosts(slug);

    return (
      <>
        <ReadingProgressBar />
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-8">
            {post.coverImage && (
              <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={`/content/blog/${encodeURIComponent(post.slug)}/${encodeURIComponent(post.coverImage)}`}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
              <time dateTime={post.date}>
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </time>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
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
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {previous && (
                <Link
                  href={`/blog/${encodeURIComponent(previous.slug)}`}
                  className="group p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">← Previous Post</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {previous.title}
                  </div>
                </Link>
              )}

              {next && (
                <Link
                  href={`/blog/${encodeURIComponent(next.slug)}`}
                  className="group p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:text-right"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Next Post →</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {next.title}
                  </div>
                </Link>
              )}
            </div>
          </footer>
        </article>

        {next && <AutoScrollNext nextPost={next} />}
      </>
    );
  } catch {
    notFound();
  }
}
