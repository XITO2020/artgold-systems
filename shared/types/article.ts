export type VideoChapter = {
  id?: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  duration: number; // in seconds
  textContent: string;
  end?: number;
};

export type Article = {
  id: string;
  title: string;
  description: string;
  chapters: VideoChapter[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  publishedAt: Date;
  status: 'draft' | 'published';
  readingTime: number; // in minutes
};