import Link from 'next/link';
import { getPostsByDate } from '@/lib/markdown';

export const metadata = {
  title: 'Archive',
  description: 'Browse all blog posts organized by date',
};

export default function ArchivePage() {
  const postsByDate = getPostsByDate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Archive
      </h1>

      <div className="space-y-12">
        {postsByDate.map((yearData) => (
          <div key={yearData.year}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sticky top-16 bg-white dark:bg-gray-900 py-2 z-10">
              {yearData.year}
            </h2>

            <div className="space-y-8">
              {yearData.months.map((monthData) => (
                <div key={`${yearData.year}-${monthData.month}`}>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    {monthData.monthName}
                  </h3>

                  <div className="space-y-6">
                    {monthData.days.map((dayData) => (
                      <div key={`${yearData.year}-${monthData.month}-${dayData.day}`}>
                        <div className="flex items-baseline gap-4 mb-3">
                          <span className="text-lg font-medium text-gray-600 dark:text-gray-400 min-w-[3rem]">
                            {dayData.day}
                          </span>
                          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                        </div>

                        <div className="ml-16 space-y-3">
                          {dayData.posts.map((post) => (
                            <article key={post.slug}>
                              <Link
                                href={`/blog/${post.slug}`}
                                className="group block"
                              >
                                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
                                  {post.title}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                  <span>{post.readingTime} min read</span>
                                  {post.tags && post.tags.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <div className="flex flex-wrap gap-1">
                                        {post.tags.slice(0, 3).map((tag) => (
                                          <span
                                            key={tag}
                                            className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </Link>
                            </article>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
