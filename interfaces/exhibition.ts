export interface ExhibitionType {
  id: number;
  title: string;
  image: string;
  description: string;
  created_at: Date;
  published_at: Date;
  is_published?: boolean;
}

export interface ApiResponse {
  items: ExhibitionType[];
  page: number;
  size: number;
  total: number;
  total_pages: number;
}
