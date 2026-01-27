import { NextResponse } from 'next/server';
import { getPostBySlug, getPostContent, getAdjacentPosts } from '@/lib/markdown';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    const content = await getPostContent(slug);
    const { next } = getAdjacentPosts(slug);

    return NextResponse.json({
      post,
      content,
      nextPost: next,
    });
  } catch {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }
}
