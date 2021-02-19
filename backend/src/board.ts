import { nanoid } from 'nanoid';

import {
  Board,
  BoardCard,
  CardStatus,
  Category,
} from './types';

export type BoardTwo = Board;

interface ICardBase<T extends Category> {
  category: T;
  value: number;
  title: string;
  description: string;
}

const c = <T extends Category>(base: ICardBase<T>): BoardCard<T> => ({
  ...base,
  id: nanoid(),
  status: CardStatus.AVAILABLE,
});

export const generateBoard = (): Board => ({
  'Lame Puzzles': {
    100: c({
      category: 'Lame Puzzles',
      value: 100,
      title: 'Maze',
      description: 'Solve a maze', // TODO
    }),
    200: c({
      category: 'Lame Puzzles',
      value: 200,
      title: 'Word Search',
      description: 'Solve a word search', // TODO
    }),
    300: c({
      category: 'Lame Puzzles',
      value: 300,
      title: 'Crossword',
      description: 'Solve a crossword', // TODO
    }),
    400: c({
      category: 'Lame Puzzles',
      value: 400,
      title: 'Minesweeper',
      description: 'Complete this minesweeper in less than 120 seconds: <http://minesweeperonline.com/#beginner>.\n\nSubmit a screenshot of game on completion.',
    }),
    500: c({
      category: 'Lame Puzzles',
      value: 500,
      title: 'Sudoku',
      description: 'Solve a sudoku', // TODO
    }),
  },
  Manipulatives: {
    100: c({
      category: 'Manipulatives',
      value: 100,
      title: 'Picture Puzzle',
      description: '', // TODO
    }),
    200: c({
      category: 'Manipulatives',
      value: 200,
      title: 'Cup Stacking',
      description: '', // TODO
    }),
    300: c({
      category: 'Manipulatives',
      value: 300,
      title: 'Jello Chopsticks',
      description: '', // TODO
    }),
    400: c({
      category: 'Manipulatives',
      value: 400,
      title: 'Cup Song',
      description: 'Perform the cup song with the provided cups (see <https://youtu.be/cmSbXsFE3l8?t=71>) for two minutes. Everyone except the person with the lowest voice has to participate in the cup tapping. The person with the lowest voice must sing the song.\n\nSubmit the two minute video, showing everyone\'s participation.',
    }),
    500: c({
      category: 'Manipulatives',
      value: 500,
      title: 'Spaghetti Tower',
      description: 'Build a tower using only spaghetti and marshmallows, with a minimum height of two feet.\n\nSubmit a picture of your tower next to the provided tape measure.',
    }),
  },
  'Fitnessgram+': {
    100: c({
      category: 'Fitnessgram+',
      value: 100,
      title: 'Flossing',
      description: 'Floss for two minutes.\n\nSubmit the two minute video, showing everyone\'s participation.',
    }),
    200: c({
      category: 'Fitnessgram+',
      value: 200,
      title: 'Burpees',
      description: 'We know you all love burpees! Do a collective total of 50 of them, divided however you like.\n\nSubmit a video showing all 50 burpees.',
    }),
    300: c({
      category: 'Fitnessgram+',
      value: 300,
      title: 'Naruto Run',
      description: '', // TODO
    }),
    400: c({
      category: 'Fitnessgram+',
      value: 400,
      title: 'Juju on the Beat',
      description: '', // TODO
    }),
    500: c({
      category: 'Fitnessgram+',
      value: 500,
      title: 'Fitnessgram Relay Race',
      description: '', // TODO
    }),
  },
  'Word Play': { // TODO change all titles to not give away action
    200: c({
      category: 'Word Play',
      value: 200,
      title: 'Pig Latin',
      description: '', // TODO
    }),
    400: c({
      category: 'Word Play',
      value: 400,
      title: 'CL Mad Libs',
      description: '', // TODO
    }),
    600: c({
      category: 'Word Play',
      value: 600,
      title: 'Jesus You\'re My Superhero',
      description: '', // TODO
    }),
    800: c({
      category: 'Word Play',
      value: 800,
      title: 'Rap Parody',
      description: '', // TODO
    }),
    1000: c({
      category: 'Word Play',
      value: 1000,
      title: 'Bible ACting',
      description: '', // TODO
    }),
  },
  '(Not Quick) Maffs': {
    200: c({
      category: '(Not Quick) Maffs',
      value: 200,
      title: 'Multiplication Table',
      description: 'Fill out a 12x12 multiplication table.\n\nSubmit a picture of the completed table.',
    }),
    400: c({
      category: '(Not Quick) Maffs',
      value: 400,
      title: 'silo word problem', // TODO
      description: '', // TODO
    }),
    600: c({
      category: '(Not Quick) Maffs',
      value: 600,
      title: 'Proof that 1 = 2',
      description: '',
    }),
    800: c({
      category: '(Not Quick) Maffs',
      value: 800,
      title: 'Unit Circle',
      description: '',
    }),
    1000: c({
      category: '(Not Quick) Maffs',
      value: 1000,
      title: 'SAT Math',
      description: '',
    }),
  },
});
