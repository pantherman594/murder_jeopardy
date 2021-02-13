import { nanoid } from 'nanoid';

import { Board } from './types';

export type BoardTwo = Board;

export const generateBoard = (): Board => ({
  'Lame Puzzles': {
    100: {
      id: nanoid(),
      category: 'Lame Puzzles',
      value: 100,
      title: 'Maze',
      description: 'Solve a maze', // TODO
      available: true,
    },
    200: {
      id: nanoid(),
      category: 'Lame Puzzles',
      value: 200,
      title: 'Word Search',
      description: 'Solve a word search', // TODO
      available: true,
    },
    300: {
      id: nanoid(),
      category: 'Lame Puzzles',
      value: 300,
      title: 'Crossword',
      description: 'Solve a crossword', // TODO
      available: true,
    },
    400: {
      id: nanoid(),
      category: 'Lame Puzzles',
      value: 400,
      title: 'Minesweeper',
      description: 'Complete this minesweeper in less than 120 seconds: http://minesweeperonline.com/#beginner.\nSubmit a screenshot of game on completion.',
      available: true,
    },
    500: {
      id: nanoid(),
      category: 'Lame Puzzles',
      value: 500,
      title: 'Sudoku',
      description: 'Solve a sudoku', // TODO
      available: true,
    },
  },
  Manipulatives: {
    100: {
      id: nanoid(),
      category: 'Manipulatives',
      value: 100,
      title: 'Picture Puzzle',
      description: '', // TODO
      available: true,
    },
    200: {
      id: nanoid(),
      category: 'Manipulatives',
      value: 200,
      title: 'Cup Stacking',
      description: '', // TODO
      available: true,
    },
    300: {
      id: nanoid(),
      category: 'Manipulatives',
      value: 300,
      title: 'Jello Chopsticks',
      description: '', // TODO
      available: true,
    },
    400: {
      id: nanoid(),
      category: 'Manipulatives',
      value: 400,
      title: 'Cup Song',
      description: 'Perform the cup song with the provided cups (see https://youtu.be/cmSbXsFE3l8?t=71) for two minutes. Everyone except the person with the lowest voice has to participate in the cup tapping. The person with the lowest voice must sing the song.\nSubmit the two minute video, showing everyone\'s participation.',
      available: true,
    },
    500: {
      id: nanoid(),
      category: 'Manipulatives',
      value: 500,
      title: 'Spaghetti Tower',
      description: 'Build a tower using only spaghetti and marshmallows, with a minimum height of two feet.\nSubmit a picture of your tower next to the provided tape measure.',
      available: true,
    },
  },
  'Fitnessgram+': {
    100: {
      id: nanoid(),
      category: 'Fitnessgram+',
      value: 100,
      title: 'Flossing',
      description: 'Floss for two minutes.\nSubmit the two minute video, showing everyone\'s participation.',
      available: true,
    },
    200: {
      id: nanoid(),
      category: 'Fitnessgram+',
      value: 200,
      title: 'Burpees',
      description: 'We know you all love burpees! Do a collective total of 50 of them, divided however you like.\nSubmit a video showing all 50 burpees.',
      available: true,
    },
    300: {
      id: nanoid(),
      category: 'Fitnessgram+',
      value: 300,
      title: 'Naruto Run',
      description: '', // TODO
      available: true,
    },
    400: {
      id: nanoid(),
      category: 'Fitnessgram+',
      value: 400,
      title: 'Juju on the Beat',
      description: '', // TODO
      available: true,
    },
    500: {
      id: nanoid(),
      category: 'Fitnessgram+',
      value: 500,
      title: 'Fitnessgram Relay Race',
      description: '', // TODO
      available: true,
    },
  },
  'Word Play': { // TODO change all titles to not give away action
    200: {
      id: nanoid(),
      category: 'Word Play',
      value: 200,
      title: 'Pig Latin',
      description: '', // TODO
      available: true,
    },
    400: {
      id: nanoid(),
      category: 'Word Play',
      value: 400,
      title: 'CL Mad Libs',
      description: '', // TODO
      available: true,
    },
    600: {
      id: nanoid(),
      category: 'Word Play',
      value: 600,
      title: 'Jesus You\'re My Superhero',
      description: '', // TODO
      available: true,
    },
    800: {
      id: nanoid(),
      category: 'Word Play',
      value: 800,
      title: 'Rap Parody',
      description: '', // TODO
      available: true,
    },
    1000: {
      id: nanoid(),
      category: 'Word Play',
      value: 1000,
      title: 'Bible ACting',
      description: '', // TODO
      available: true,
    },
  },
  '(Not Quick) Maffs': {
    200: {
      id: nanoid(),
      category: '(Not Quick) Maffs',
      value: 200,
      title: 'Multiplication Table',
      description: 'Fill out a 12x12 multiplication table.\nSubmit a picture of the completed table.',
      available: true,
    },
    400: {
      id: nanoid(),
      category: '(Not Quick) Maffs',
      value: 400,
      title: 'silo word problem', // TODO
      description: '', // TODO
      available: true,
    },
    600: {
      id: nanoid(),
      category: '(Not Quick) Maffs',
      value: 600,
      title: 'Proof that 1 = 2',
      description: '',
      available: true,
    },
    800: {
      id: nanoid(),
      category: '(Not Quick) Maffs',
      value: 800,
      title: 'Unit Circle',
      description: '',
      available: true,
    },
    1000: {
      id: nanoid(),
      category: '(Not Quick) Maffs',
      value: 1000,
      title: 'SAT Math',
      description: '',
      available: true,
    },
  },
});
