export default interface YoutubeVideo {
  id: {
    videoId: string;
  }
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
        width: number;
        height: number;
      }
    }
  }
}