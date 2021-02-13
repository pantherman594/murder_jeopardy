import React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Board as BoardType, Category } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    margin: 2,
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0.5),
    },
  },
  cardDisabled: {
    pointerEvents: 'none',
    backgroundColor: theme.palette.grey[900],
  },
  cardAction: {
    padding: `${theme.spacing(3, 0)}!important`,
    [theme.breakpoints.up('md')]: {
      padding: `${theme.spacing(5, 0)}!important`,
    },
  },
}));

interface IBoardProps {
  board: BoardType;
  onCardClick: (category: Category, value: number) => void;
}

const Board = (props: IBoardProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const mobile = !useMediaQuery(theme.breakpoints.up('md'));

  const padding = (key: number = 0) => <Grid item xs={1} key={`padding_${key}`} />

  return (
    <Container>
      <Grid container>
        {padding(100)}
        {props.board.map((v, i) => {
          return (
            <Grid item xs={2} key={`category-${i}_${v[0]}`}>
              <Typography
                variant={mobile ? 'subtitle1' : 'h6'}
                align='center'
                color='textSecondary'
              >
                {v[0]}
              </Typography>
            </Grid>
          );
        })}
        {padding(101)}
        {Array.from({ length: 5 }, (_, row) => (
          [padding(row * 2), ...props.board.map((v) => {
            const category = v[0];
            const value = Math.abs(v[row + 1] as number);
            const available = v[row + 1] > 0;
            const Content: any = available ? CardActionArea : CardContent;
            return (
              <Grid item xs={2} key={`card-${category}_${value}`}>
                <Card className={clsx(classes.card, {[classes.cardDisabled]: !available})}>
                  <Content
                    onClick={available ? () => props.onCardClick(category, value) : undefined}
                    className={classes.cardAction}
                  >
                    <Typography
                      variant={mobile ? 'h6' : 'h5'}
                      align='center'
                      color={available ? 'textPrimary' : 'textSecondary'}
                    >
                      {(value / (mobile ? 100 : 1)).toFixed(0)}
                    </Typography>
                  </Content>
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
