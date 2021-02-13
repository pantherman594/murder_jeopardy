import React from 'react';

import Grid from '@material-ui/core/Grid';
import {
  MuiThemeProvider,
  Theme,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';

import { Category } from './types';
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
  const onCardClick = (category: Category, value: number) => {
    console.log(category, value);
  };

  return (
    <MuiThemeProvider theme={THEME}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.title}>
          <Title />
        </Grid>
        <Grid item xs={12} style={{ flexGrow: 1 }}>
          <Board onCardClick={onCardClick} />
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
};

export default App;
