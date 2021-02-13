import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import {
  MuiThemeProvider,
  Theme,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';

import { Board as BoardType, Category } from './types';
import Board from './components/Board';
import Title from './components/Title';

const THEME = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    marginTop: theme.spacing(2),
  },
}));

const App = () => {
  const classes = useStyles();
  const [board, setBoard] = useState<BoardType>([
    [ 'Lame Puzzles', 100, 200, 300, 400, 500 ],
    [ 'Manipulatives', 100, 200, 300, 400, 500 ],
    [ 'Fitnessgram+', 100, 200, 300, 400, 500 ],
    [ 'Word Play', 200, 400, 600, 800, 1000 ],
    [ '(Not Quick) Maffs', 200, 400, 600, 800, 1000 ],
  ]);
  const copyBoard = () => board.map((row) => [...row]);
  const onCardClick = (category: Category, value: number) => {
    console.log(category, value);
    const newBoard = copyBoard();
    newBoard.forEach((row) => {
      if (row[0] === category) {
        const index = row.indexOf(value);
        row[index] = row[index] as number * -1;
      }
    });
    setBoard(newBoard as BoardType);
  };

  return (
    <MuiThemeProvider theme={THEME}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.title}>
          <Title />
        </Grid>
        <Grid item xs={12} style={{ flexGrow: 1 }}>
          <Board board={board} onCardClick={onCardClick} />
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
};

export default App;
