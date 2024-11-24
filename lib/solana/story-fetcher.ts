export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  url: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export async function fetchStoryFromShonendump(storyId: string): Promise<Story> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHONENDUMP_API}/stories/${storyId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch story');
    }

    const data = await response.json();
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      author: data.author,
      publishDate: data.publishDate,
      url: `${process.env.NEXT_PUBLIC_SHONENDUMP_URL}/stories/${data.id}`,
      location: data.location
    };
  } catch (error) {
    console.error('Error fetching story:', error);
    throw error;
  }
}