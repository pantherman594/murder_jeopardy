export type Category =
  'Lame Puzzles'
  | 'Manipulatives'
  | 'Fitnessgram+'
  | 'Word Play'
  | '(Not Quick) Maffs';

export interface BoardCard<T extends Category> {
  id: string;
  category: T;
  value: number;
  title: string;
  description: string;
  available: boolean;
}

export type Board = [Category, number, number, number, number, number][];
export type Callback = (error: string | null, ...data: any) => void;
