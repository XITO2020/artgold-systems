
export async function fetchArtworks(category: string) {
    try {
      const response = await fetch(`/api/artworks?category=${category}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch artworks:', error);
      return [];
    }
  }
  