import Link from 'next/link';

const siteMetadata = {
  author: 'Alex van Wolferen',
  description: 'Sitecore MVP Technology 2018, 2021 and 2022',
  social: {
    twitter: 'avwolferen',
    github: 'avwolferen',
    linkedin: 'alexvanwolferen',
    email: 'alexvanwolferen@gmail.com',
  },
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              I am a Sitecore Architect. Father of Luuk and Fenna, fiancé of Marloes, 
              hoarder of electronics. Loves to learn something new every single day.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 font-medium">
              {siteMetadata.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Tags
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Connect
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`https://twitter.com/${siteMetadata.social.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href={`https://github.com/${siteMetadata.social.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={`https://linkedin.com/in/${siteMetadata.social.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteMetadata.social.email}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} {siteMetadata.author}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
