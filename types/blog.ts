export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  coverImage?: string;
  img?: string;
  excerpt: string;
  content: string;
  readingTime: number;
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  coverImage?: string;
  img?: string;
}

export interface PostsByDate {
  year: number;
  months: {
    month: number;
    monthName: string;
    days: {
      day: number;
      posts: BlogPost[];
    }[];
  }[];
}
