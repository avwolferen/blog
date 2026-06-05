import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/markdown';

export const metadata = {
  title: 'Tags',
  description: 'Browse blog posts by tags',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Tags
      </h1>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => {
          const posts = getPostsByTag(tag);
          return (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            >
              <span className="text-gray-900 dark:text-gray-100 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {tag}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                ({posts.length})
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
