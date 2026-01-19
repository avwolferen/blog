import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
