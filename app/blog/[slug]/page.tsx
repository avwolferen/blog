import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostBySlug, getPostContent, getAdjacentPosts } from '@/lib/markdown';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import InfiniteScrollBlog from '@/components/InfiniteScrollBlog';

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
        <InfiniteScrollBlog
          initialPost={post}
          initialContent={content}
          initialNextPost={next}
          previousPost={previous}
        />
      </>
    );
  } catch {
    notFound();
  }
}
