export type Category =
  'Lame Puzzles'
  | 'Manipulatives'
  | 'Fitnessgram+'
  | 'Videos and VBS'
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
  players: string[];
}

export type AdminBoard = {
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

export type Board = [Category, number, number, number, number, number][];
export type Callback = (error: string | null, ...data: any) => void;
