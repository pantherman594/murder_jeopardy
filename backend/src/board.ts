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

const fitnessgramAudio = () => (new Date().getTime() > 1613775600000
  ? 'https://drive.google.com/file/d/1Tk23HOrJ5mAjpz-Br4IicOZX5r5VSO-P/view?usp=sharing'
  : 'https://drive.google.com/file/d/1TLUZQdWX-Lem6k7dkkUyRsgI9SaHz6xg/view?usp=sharing');

export const generateBoard = (): Board => ({
  'Lame Puzzles': {
    100: c({
      category: 'Lame Puzzles',
      value: 100,
      title: 'CL Crossword',
      description: `Complete this crossword puzzle: <https://drive.google.com/file/d/1gGH2UBbPsFODEv7cvLXeXq2Rmj-FQTKA/view?usp=sharing>.  
You may use Instagram if you wish.

*Submit a picture of the completed crossword puzzle.*`,
    }),
    200: c({
      category: 'Lame Puzzles',
      value: 200,
      title: 'Word Search',
      description: `Complete all three word searches (total 90 words):

* <https://drive.google.com/file/d/12ifSoDKCo2SlpdfwiP7Bf3gRHsaYJWj9/view?usp=sharing>
* <https://drive.google.com/file/d/11CGyIdwhoN-DpcFxIv8HjDwIFUabtlLt/view?usp=sharing>
* <https://drive.google.com/file/d/1x4TJIbl6aRI75q6xRiKp-zxAtVWTIN_6/view?usp=sharing>

*Submit pictures of the completed word searches.*`,
    }),
    300: c({
      category: 'Lame Puzzles',
      value: 300,
      title: 'Maze',
      description: `Select two out of the following three mazes to complete:

* <https://drive.google.com/file/d/118V5FSLzRTDjSRN5stsJI2OyvKIvMRSO/view?usp=sharing>
* <https://drive.google.com/file/d/1q2KwStJEmFV3rI4E72s75djoyJ6eiElN/view?usp=sharing>
* <https://drive.google.com/file/d/1nH0yK3-2YLHmRmp4N_B97rWkdq8X12b2/view?usp=sharing>

*Submit pictures of the completed mazes.*`,
    }),
    400: c({
      category: 'Lame Puzzles',
      value: 400,
      title: 'Minesweeper',
      description: `Complete a 12x12, 30-mine minesweeper in under 10 minutes. Go to <http://minesweeperonline.com/> and use custom settings under "Game".

*Submit a screenshot of game on completion.*`,
    }),
    500: c({
      category: 'Lame Puzzles',
      value: 500,
      title: 'Sudoku',
      description: `Complete these two Sudoku boards, good luck! Ask if you want a paper copy.

* <https://docs.google.com/spreadsheets/d/1caqEAMNJOwQcuv9bePfZWS7FbO6oPzDsFRL2m8IGOpQ/edit#gid=0>
* <https://docs.google.com/spreadsheets/d/1ZNHjT1z0aT2tUY954rupa8zcp7b6R8q3uK5aQHhicn0/edit#gid=0>

*Submit screenshots or pictures of the completed sudokus.*`,
    }),
  },
  Manipulatives: {
    100: c({
      category: 'Manipulatives',
      value: 100,
      title: 'Picture Puzzle',
      description: `The murderer really didn't like seeing Stick Figure Dan frolicking in the park, and cut this picture apart. Could you put it back together for us?  
**DISCLAIMER**: This isn't actually a clue, just a simple puzzle for you to solve.  
Someone should come by your room with the pieces soon, if not let us know on Zoom.

*Submit a picture of the assembled picture.*`,
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
      description: `We will provide two cups of jello and two empty cups, as well as forks for each team member. Move the jello to the empty cups using only the forks (no tipping and pouring) in a relay style, with 15 seconds for each person until the cups are empty. There must also be someone visibly T-posing in the background at all times.

*Submit the video, with each team member moving jello and T-posing for an almost equal amount of time.*`,
    }),
    400: c({
      category: 'Manipulatives',
      value: 400,
      title: 'Cup Song',
      description: `Perform the cup song with the provided cups (see <https://youtu.be/cmSbXsFE3l8?t=71>) for two minutes. Everyone except the person with the lowest voice has to participate in the cup tapping. The person with the lowest voice must sing the song.

*Submit the two minute video, showing everyone's participation.*`,
    }),
    500: c({
      category: 'Manipulatives',
      value: 500,
      title: 'Spaghetti Tower',
      description: `Build a tower using only spaghetti and marshmallows, with a minimum height of two feet.

*Submit a picture of your tower next to the provided tape measure.*`,
    }),
  },
  'Fitnessgram+': {
    100: c({
      category: 'Fitnessgram+',
      value: 100,
      title: 'Flossing',
      description: `Floss for two minutes.

*Submit the two minute video, showing everyone's participation.*`,
    }),
    200: c({
      category: 'Fitnessgram+',
      value: 200,
      title: 'Burpees',
      description: `We know you all love burpees! Do a collective total of 50 of them, divided however you like. Burpees must include a pushup at the bottom.

*Submit a video showing all 50 burpees.*`,
    }),
    300: c({
      category: 'Fitnessgram+',
      value: 300,
      title: 'Naruto Run',
      description: `Record a video of your team Naruto running in a single file line on the second floor of Stokes South, from the top of the chocolate bar stairs to the classrooms on the opposite end and back. Then, have someone else record your team doing it again but in a V formation.

*Submit the video.*`,
    }),
    400: c({
      category: 'Fitnessgram+',
      value: 400,
      title: 'Plank',
      description: `This one's simple. Plank until failure.

*Submit a video of everyone planking until you cannot plank any longer.*`,
    }),
    500: c({
      category: 'Fitnessgram+',
      value: 500,
      title: 'Fitnessgram Relay Race',
      description: `Fitness is very important for your bodies. And what better way to measure your fitness than the FITNESSGRAM PACER TEST. But we're doing it a bit differently this time. Split your team into quarters. One quarter will start with pushups, another with situps, and the third will run back and forth the long way across your room. The last quarter can rest. When the audio dings, rotate.  
Here is your audio track: <${fitnessgramAudio()}>. Do the whole thing.

*Submit your video.*`,
    }),
  },
  'Videos and VBS': { // TODO change all titles to not give away action
    200: c({
      category: 'Videos and VBS',
      value: 200,
      title: 'Kpop Dance',
      description: `Choose ***ONE*** of the following dances and record all members dancing to the song for the specified duration in the video:

* [BTS - "Go Go" 4:13-4:42](https://www.youtube.com/watch?v=Fl54gG0B8I0)
* [Pentagon - "Shine" 0:51-1:18](https://www.youtube.com/watch?v=6_v8n_zb5ak)

*Submit your video.*`,
    }),
    400: c({
      category: 'Videos and VBS',
      value: 400,
      title: 'Juju on the Beat',
      description: `Dance to Juju on the Beat for the given time (0:16-1:12): <https://www.youtube.com/watch?v=7glxOu2-CoA>.

*Submit your video.*`,
    }),
    600: c({
      category: 'Videos and VBS',
      value: 600,
      title: 'Jesus You\'re My Superhero',
      description: `Recreate <https://www.youtube.com/watch?v=32onYUCR5UE> and record. All members must participate and be shown in the video at some point.

*Submit your video recreation.*`,
    }),
    800: c({
      category: 'Videos and VBS',
      value: 800,
      title: 'Rap Parody',
      description: `Pick an explicit rap song and rewrite the lyrics about pink fluffy unicorns dancing on rainbows ([inspiration](https://www.youtube.com/watch?v=qRC4Vk6kisY)). All members must participate and be shown in the video at some point.

*Submit a video of your rap.*`,
    }),
    1000: c({
      category: 'Videos and VBS',
      value: 1000,
      title: 'Bible Acting',
      description: `Act along with the Bible Video. Record a video to go with this narration <https://www.youtube.com/watch?v=I400jhY2DF0>. All members must participate and be shown in the video at some point.

*Submit your video.*`,
    }),
  },
  '(Not Quick) Maffs': {
    200: c({
      category: '(Not Quick) Maffs',
      value: 200,
      title: 'Multiplication Table',
      description: `Fill out a 12x12 multiplication table. It must be done on the doc (no cheating with formulas):  
<https://docs.google.com/spreadsheets/d/1waeOFPTrtRholx8r8koSF0srOGviXZYxMhdshERAeqM/edit#gid=0>

*Submit a screenshot of the completed table.*`,
    }),
    400: c({
      category: '(Not Quick) Maffs',
      value: 400,
      title: 'Proof that 1 = 2',
      description: `See <https://drive.google.com/file/d/1khxjOMllFwW4kSzcsmFKlsjnwQrdUomK/view?usp=sharing>.

*Use the text box in the submission form to explain the mistake.* `,
    }),
    600: c({
      category: '(Not Quick) Maffs',
      value: 600,
      title: 'Unit Circle',
      description: `Fill in this blank unit circle: <https://drive.google.com/file/d/1WeLlOa5AhbLY9LDiJhfl8TxaEBlwd-P-/view?usp=sharing>.  
An example has been provided.

*Submit a picture of the completed unit circle.*`,
    }),
    800: c({
      category: '(Not Quick) Maffs',
      value: 800,
      title: 'Farmer Dan\'s Silo',
      description: `Are you ready for some math and a little bit of phyics? Go to <https://docs.google.com/document/d/1-YD-lzRh_4J-1uzhv58Xkpy8y91QENpAca1pO4PQhEs/edit?usp=sharing> to lend farmer Dan a hand with his silos! Ask if you need paper.

*Submit a picture of your answers to all 3 parts. Work must be shown.*`,
    }),
    1000: c({
      category: '(Not Quick) Maffs',
      value: 1000,
      title: 'SAT Math',
      description: `Complete this math section of the SAT: <https://drive.google.com/file/d/1Rv5BTObkSY7RgXTdVdEPjjSnVZQChSQQ/view?usp=sharing>.  
It's a calculator section but **NO CALCULATOR ALLOWED**. Ask if you need scratch paper.

*Submit your answers in the text box.*`,
    }),
  },
});
