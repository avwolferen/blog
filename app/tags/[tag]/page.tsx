import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getAllTags, getPostsByTag } from '@/lib/markdown';
import { notFound } from 'next/navigation';

type Params = Promise<{ tag: string }>;

function decodeTag(tag: string): string {
  try {
    return decodeURIComponent(tag);
  } catch {
    // Fall back to the original value so malformed URLs naturally resolve to notFound().
    return tag;
  }
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag,
  }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { tag } = await params;
  const decodedTag = decodeTag(tag);
  return {
    title: `Posts tagged with "${decodedTag}"`,
    description: `All blog posts tagged with ${decodedTag}`,
  };
}

export default async function TagPage({ params }: { params: Params }) {
  try {
    const { tag } = await params;
    const decodedTag = decodeTag(tag);
    const posts = getPostsByTag(decodedTag);

    if (posts.length === 0) {
      notFound();
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/tags"
            className="text-primary-600 dark:text-primary-400 hover:underline mb-4 inline-block"
          >
            ← All Tags
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Posts tagged with &quot;{decodedTag}&quot;
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {post.coverImage && (
                <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                  <Image
                    src={`/content/blog/${post.slug}/${post.coverImage}`}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Link>
              )}

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
                  <time dateTime={post.date}>
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </time>
                  <span>•</span>
                  <span>{post.readingTime} min read</span>
                </div>

                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
