export interface SelectOptions {
  label: string;
  value: string;
}

export const sorts: SelectOptions[] = [
  { label: "Trending", value: "trending-desc" },
  { label: "Popular", value: "popularity-desc" },
  { label: "Year", value: "year-desc" },
  { label: "Rating", value: "rating-desc" },
  { label: "Title - Descending", value: "title-desc" },
  { label: "Title - Ascending", value: "title-asc" },
];
export const defaultSort = "trending";
export const defaultOrder = "desc";

export const genres: SelectOptions[] = [
  { label: "All", value: "all" },
  { label: "Action", value: "action" },
  { label: "Adventure", value: "adventure" },
  { label: "Animation", value: "animation" },
  { label: "Biography", value: "biography" },
  { label: "Comedy", value: "comedy" },
  { label: "Crime", value: "crime" },
  { label: "Documentary", value: "documentary" },
  { label: "Drama", value: "drama" },
  { label: "Family", value: "family" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Film-Noir", value: "film-noir" },
  { label: "History", value: "history" },
  { label: "Horror", value: "horror" },
  { label: "Music", value: "music" },
  { label: "Musical", value: "musical" },
  { label: "Mystery", value: "mystery" },
  { label: "Romance", value: "romance" },
  { label: "Sci-Fi", value: "sci-fi" },
  { label: "Short", value: "short" },
  { label: "Sport", value: "sport" },
  { label: "Thriller", value: "thriller" },
  { label: "War", value: "war" },
  { label: "Western", value: "western" },
];
export const defaultGenre = "all";
