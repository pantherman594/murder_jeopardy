import React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Category } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    margin: 2,
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0.5),
    },
  },
  cardAction: {
    padding: theme.spacing(3, 0),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(5, 0),
    },
  },
}));

interface IBoardProps {
  onCardClick: (category: Category, value: number) => void;
}

const Board = (props: IBoardProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const mobile = !useMediaQuery(theme.breakpoints.up('md'));

  const categories: Category[] = [
    'Lame Puzzles',
    'Manipulatives',
    'Fitnessgram+',
    'Word Play',
    '(Not Quick) Maffs',
  ];

  const padding = (key: number = 0) => <Grid item xs={1} key={`padding_${key}`} />

  return (
    <Container>
      <Grid container>
        {padding(100)}
        {categories.map((v, i) => {
          return (
            <Grid item xs={2} key={`category-${i}_${v}`}>
              <Typography
                variant={mobile ? 'subtitle1' : 'h6'}
                align='center'
                color='textSecondary'
              >
                {v}
              </Typography>
            </Grid>
          );
        })}
        {padding(101)}
        {Array.from({ length: 5 }, (_v, row) => (
          [padding(row * 2), ...categories.map((category) => {
            let value = (row + 1) * 100;
            if (category === 'Word Play' || category === '(Not Quick) Maffs') {
              value *= 2;
            }

            return (
              <Grid item xs={2} key={`card-${category}_${row}`}>
                <Card className={classes.card}>
                  <CardActionArea
                    onClick={() => props.onCardClick(category, value)}
                    className={classes.cardAction}
                  >
                    <Typography variant={mobile ? 'h6' : 'h5'} align='center'>
                      {(value / (mobile ? 100 : 1)).toFixed(0)}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          }), padding(row * 2 + 1)]
        ))}
        { mobile ? (
          <Grid item xs={11}>
            <Typography variant='subtitle1' color='textSecondary' align='right'>
              Points x100
            </Typography>
          </Grid>
        ) : null }
      </Grid>
    </Container>
  );
};

export default Board;
