export type Content = {
  id: number;
  contentType: number;
  title: string;
  publisher: string;
  description: string;
  downloadUrl: string;
  imageUrl: string;
  date: string;
  downloadCount: number;
  voteAverageScore: number;
  songInfo: {
    difficulties: number[];
    hasLua: boolean;
  };
};
