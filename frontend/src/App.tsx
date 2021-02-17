import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import ReactMarkdown from 'react-markdown';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {
  MuiThemeProvider,
  Theme,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';

import {
  BoardCard,
  Board as BoardType,
  Category,
} from './types';
import Board from './components/Board';
import Timer from './components/Timer';
import Title from './components/Title';

// TODO: help button
// TODO: notify approve/reject
// TODO: admin page

const THEME = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#9ab0e6',
    },
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    marginTop: theme.spacing(2),
  },
  status: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(4),
  },
}));

const App = () => {
  const classes = useStyles();
  const [teamType, setTeamType] = useState<string>('');
  const [teamError, setTeamError] = useState<boolean>(false);
  const [team, setTeam] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [board, setBoard] = useState<BoardType>([
    [ 'Lame Puzzles', -100, -200, -300, -400, -500 ],
    [ 'Manipulatives', -100, -200, -300, -400, -500 ],
    [ 'Fitnessgram+', -100, -200, -300, -400, -500 ],
    [ 'Word Play', -200, -400, -600, -800, -1000 ],
    [ '(Not Quick) Maffs', -200, -400, -600, -800, -1000 ],
  ]);
  const [endTime, setEndTime] = useState<number>(new Date().getTime() + 90 * 60 * 1000);
  const [teamPoints, setTeamPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [card, setCard] = useState<BoardCard<Category> | null>(null);

  useEffect(() => {
    const s = io('http://localhost:5000')

    s.on('open', (card: BoardCard<Category>) => {
      setCard(card);
    });

    s.on('cancel', () => {
      setCard(null);
    });

    s.on('approve', (category: Category, value: number) => {
      setTeamPoints((tp) => tp + value);
      setCard(null);
    });

    s.on('update', (remoteBoard: BoardType, points: number) => {
      setBoard(remoteBoard);
      setTotalPoints(points);
    });

    setSocket(s);
    return () => {
      s.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!socket || !team) {
      return () => {};
    }

    const onConnect = () => {
      socket.emit('join', team, (err: string | undefined, remoteBoard: BoardType,
        end: number, points: number, total: number) => {
        if (err) return;

        setBoard(remoteBoard);
        setEndTime(end);
        setTeamPoints(points);
        setTotalPoints(total);
      });
    };

    socket.on('connect', onConnect);

    return () => {
      socket.off('connect', onConnect);
    };
  }, [socket, team]);

  const onCardClick = (category: Category, value: number) => {
    if (socket) {
      socket.emit('open', category, value, () => {});
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamType(event.target.value);
  }

  const handleClose = () => {
    if (socket) {
      setTeamError(false);
      socket.emit('join', teamType, (err: string | undefined, remoteBoard: BoardType,
        end: number, points: number, total: number) => {
        if (err) {
          setTeamError(true);
          return;
        }

        setTeam(teamType);
        setBoard(remoteBoard);
        setEndTime(end);
        setTeamPoints(points);
        setTotalPoints(total);
      });
    } else {
      setTeamError(true);
    }
  }

  const handleCardClose = () => {
    if (socket) {
      socket.emit('cancel', card?.category, card?.value, (err: string | undefined) => {
        if (err) {
          setCard(null);
        }
      });
    }
  }

  return (
    <MuiThemeProvider theme={THEME}>
      <Dialog open={team === ''}>
        <DialogTitle>Team Code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            value={teamType}
            error={teamError}
            onChange={handleChange}
            onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key === 'Enter') {
                handleClose();
                event.preventDefault();
              }
            }}
            color='primary'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={card !== null}>
        <DialogTitle>{card?.title}</DialogTitle>
        <DialogContent>
          <Typography
            variant='body1'
            color='textPrimary'
          >
            <ReactMarkdown>
              {card?.description ?? ''}
            </ReactMarkdown>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCardClose} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.title}>
          <Title />
        </Grid>
        <Grid item xs={12} style={{ flexGrow: 1 }}>
          <Board board={board} onCardClick={onCardClick} />
        </Grid>
      </Grid>
      <div className={classes.status}>
        <Timer endTime={endTime} />
        <Typography
          variant='h6'
          align='center'
          color='textPrimary'
        >
          Your Points: {teamPoints}
        </Typography>
        <Typography
          variant='h6'
          align='center'
          color='textPrimary'
        >
          Opponent: {totalPoints - teamPoints}
        </Typography>
      </div>
    </MuiThemeProvider>
  );
};

export default App;
