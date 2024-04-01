/*
{"date":"2024-03-05","season":"lent","season_week":3,"celebrations":[{"title":"Tuesday, 3rd week of Lent","colour":"violet","rank":"ferial","rank_num":2.9}],"weekday":"tuesday"}
*/

// Write the type
export type LiturgicalDay = {
  date: string; // "yyyy-mm-dd"
  season: string;
  season_week: number;
  celebrations: Celebration[];
  weekday: string;
};

type Celebration = {
  title: string;
  subtitle: string;
  colour: string;
  rank: string;
  rank_num: number;
};
