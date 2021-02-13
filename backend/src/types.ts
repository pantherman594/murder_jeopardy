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

export interface TeamState {
  points: number;
  pending: string | null;
  players: Set<string>;
}

export type Board = {
  [key in Category]: {
    [value: number]: BoardCard<key>,
  };
};

export interface LogEntry {
  timestamp: number;
  team: string;
  event: string;
  message: string;
  errored: boolean;
}

export type Success = (...data: any) => void;
export type Error = (msg: string) => void;
