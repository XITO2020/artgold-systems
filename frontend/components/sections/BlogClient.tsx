"use client";

import { ThemeGrid } from "@comp/blog/ThemeGrid";
import { BlogSidebar } from "@comp/blog/BlogSidebar";

interface BlogClientProps {
  initialDict: any;
  lang: string;
}

const themes = [
  { id: 'art-market', name: 'Art Market', count: 24 },
  { id: 'technology', name: 'Technology', count: 18 },
  { id: 'community', name: 'Community', count: 15 },
  { id: 'tutorials', name: 'Tutorials', count: 12 },
  { id: 'announcements', name: 'Announcements', count: 8 },
  { id: 'market-analysis', name: 'Market Analysis', count: 10 },
  { id: 'artist-spotlight', name: 'Artist Spotlight', count: 14 },
  { id: 'token-updates', name: 'Token Updates', count: 6 }
];

const categories = [
  { id: 'news', name: 'News', count: 45 },
  { id: 'guide', name: 'Guides', count: 32 },
  { id: 'analysis', name: 'Analysis', count: 28 },
  { id: 'interview', name: 'Interviews', count: 15 },
  { id: 'feature', name: 'Features', count: 20 },
  { id: 'update', name: 'Updates', count: 12 }
];

export default function BlogClient({ initialDict, lang }: BlogClientProps) {
  // Ensure we have the correct dictionary structure
  const blogDict = {
    title: initialDict.title || "Latest News",
    readMore: initialDict.readMore || "Read More",
    themes: {
      title: initialDict.themes?.title || "Themes",
      ...initialDict.themes
    },
    categories: {
      title: initialDict.categories?.title || "Categories",
      ...initialDict.categories
    },
    archive: {
      title: initialDict.archive?.title || "Archive",
      view: initialDict.archive?.view || "View Articles",
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">{blogDict.title}</h1>
      
      <div className="flex gap-8">
        <div className="flex-1">
          <ThemeGrid 
            theme="art-market" 
            lang={lang} 
            dict={blogDict} 
          />
        </div>
        
        <BlogSidebar 
          themes={themes}
          categories={categories}
          lang={lang}
          dict={blogDict}
        />
      </div>
    </div>
  );
}