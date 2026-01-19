import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogFrontmatter, PostsByDate } from '@/types/blog';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export function getAllPostSlugs(): string[] {
  const folders = fs.readdirSync(postsDirectory);
  return folders.filter((folder) => {
    const folderPath = path.join(postsDirectory, folder);
    return fs.statSync(folderPath).isDirectory();
  });
}

export function getPostBySlug(slug: string): BlogPost {
  const fullPath = path.join(postsDirectory, slug, 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const frontmatter = data as BlogFrontmatter;

  // Calculate reading time (average reading speed: 200 words per minute)
  const wordCount = content.split(/\s+/g).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Extract excerpt (first 160 characters of content)
  const excerpt = content.replace(/[#*`]/g, '').slice(0, 160).trim() + '...';

  // Normalize coverImage path (remove ./ prefix)
  let coverImage = frontmatter.coverImage || frontmatter.img;
  if (coverImage && coverImage.startsWith('./')) {
    coverImage = coverImage.substring(2);
  }

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    categories: frontmatter.categories,
    tags: frontmatter.tags,
    coverImage,
    img: frontmatter.img,
    excerpt,
    content,
    readingTime,
  };
}

export async function getPostContent(slug: string): Promise<string> {
  const post = getPostBySlug(slug);
  
  // Transform relative image paths to absolute paths
  let processedContent = post.content;
  
  // Replace markdown images: ![alt](image.png) -> ![alt](/content/blog/slug/image.png)
  // Also handles ![alt](./image.png) and ![alt](images/image.png)
  processedContent = processedContent.replace(
    /!\[([^\]]*)\]\((?!http)(?!\/)(\.\/)?([^)]+)\)/g,
    (match, alt, dotSlash, filename) => {
      return `![${alt}](/content/blog/${slug}/${filename})`;
    }
  );
  
  // Replace HTML img tags: <img src="image.png" /> -> <img src="/content/blog/slug/image.png" />
  processedContent = processedContent.replace(
    /<img([^>]+)src=["'](?!http)(?!\/)(?:\.\/)?([^"']+)["']/g,
    (match, attrs, filename) => {
      return `<img${attrs}src="/content/blog/${slug}/${filename}"`;
    }
  );
  
  const { marked } = await import('marked');
  const html = await marked(processedContent);
  
  return html;
}

export function getAllPosts(): BlogPost[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  return posts;
}

export function getAdjacentPosts(slug: string): { 
  previous: BlogPost | null; 
  next: BlogPost | null;
} {
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === slug);

  return {
    previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}

export function getPostsByDate(): PostsByDate[] {
  const posts = getAllPosts();
  const postsByYear = new Map<number, Map<number, Map<number, BlogPost[]>>>();

  posts.forEach((post) => {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (!postsByYear.has(year)) {
      postsByYear.set(year, new Map());
    }
    const yearMap = postsByYear.get(year)!;

    if (!yearMap.has(month)) {
      yearMap.set(month, new Map());
    }
    const monthMap = yearMap.get(month)!;

    if (!monthMap.has(day)) {
      monthMap.set(day, []);
    }
    monthMap.get(day)!.push(post);
  });

  const result: PostsByDate[] = [];
  const sortedYears = Array.from(postsByYear.keys()).sort((a, b) => b - a);

  sortedYears.forEach((year) => {
    const months = postsByYear.get(year)!;
    const sortedMonths = Array.from(months.keys()).sort((a, b) => b - a);

    const monthsData = sortedMonths.map((month) => {
      const days = months.get(month)!;
      const sortedDays = Array.from(days.keys()).sort((a, b) => b - a);

      const daysData = sortedDays.map((day) => ({
        day,
        posts: days.get(day)!,
      }));

      return {
        month,
        monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
        days: daysData,
      };
    });

    result.push({
      year,
      months: monthsData,
    });
  });

  return result;
}

export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags?.includes(tag));
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();
  
  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}
