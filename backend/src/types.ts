export type Category =
  'Lame Puzzles'
  | 'Manipulatives'
  | 'Fitnessgram+'
  | 'Word Play'
  | '(Not Quick) Maffs';

export enum CardStatus {
  AVAILABLE,
  PENDING,
  RECEIVED,
  CANCELLED,
  APPROVED,
  REJECTED,
}

export interface BoardCard<T extends Category> {
  id: string;
  category: T;
  value: number;
  title: string;
  description: string;
  status: CardStatus;
  submission?: {
    attachments: string[];
    text: string;
  };
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

export type Callback = (error: string | null, ...data: any) => void;
