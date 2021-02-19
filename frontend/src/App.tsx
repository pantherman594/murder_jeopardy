import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { format, parse } from 'date-fns'

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
  AdminBoard,
  BoardCard,
  Board as BoardType,
  CardStatus,
  Category,
  LogEntry,
  TeamState,
} from './types';
import Board from './components/Board';
import Timer from './components/Timer';
import Title from './components/Title';

const URL = process.env.NODE_ENV === 'production' ? 'https://murder.dav.sh' : 'http://localhost:5000';

const INITIAL_BOARD: BoardType = [
  [ 'Lame Puzzles', -100, -200, -300, -400, -500 ],
  [ 'Manipulatives', -100, -200, -300, -400, -500 ],
  [ 'Fitnessgram+', -100, -200, -300, -400, -500 ],
  [ 'Videos and VBS', -200, -400, -600, -800, -1000 ],
  [ '(Not Quick) Maffs', -200, -400, -600, -800, -1000 ],
];

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

const MDTypography = (props: any) => {
  const { children, ...rest } = props;
  return (
    <Typography
      {...rest}
      component='span'
      variant='body1'
      style={{ fontWeight: 'inherit' }}
    >
      {children}
    </Typography>
  );
};

const cardStatus = (card: BoardCard<Category>) => {
  switch (card.status) {
    case CardStatus.RECEIVED:
      return (
        <Typography variant='caption' color='textPrimary'>
          Submission received. Please wait for review.
        </Typography>
      );
    case CardStatus.REJECTED:
      return (
        <Typography variant='caption' color='error'>
          Submission rejected. Please try again.
        </Typography>
      );
  }

  return null;
};

const App = () => {
  const classes = useStyles();

  // Dialogs
  const [confirmClose, setConfirmClose] = useState<boolean>(false);
  const [teamType, setTeamType] = useState<string>('');
  const [teamError, setTeamError] = useState<boolean>(false);
  const [card, setCard] = useState<BoardCard<Category> | null>(null);

  // Game state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [team, setTeam] = useState<string>('');
  const [board, setBoard] = useState<BoardType>(INITIAL_BOARD);
  const [endTime, setEndTime] = useState<number>(0);
  const [teamPoints, setTeamPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [ended, setEnded] = useState<boolean>(false);

  // Admin state
  const [admin, setAdmin] = useState<boolean>(false);
  const [adminBoard, setAdminBoard] = useState<AdminBoard | null>(null);
  const [teams, setTeams] = useState<{ [id: string]: TeamState } | null>(null);
  const [log, setLog] = useState<LogEntry[] | null>(null);

  const resetVariables = () => {
    setBoard(INITIAL_BOARD);
    setEndTime(0);
    setTeamPoints(0);
    setTotalPoints(0);
    setEnded(false);
    setCard(null);

    setAdmin(false);
    setAdminBoard(null);
    setTeams(null);
    setLog(null);
  };

  useEffect(() => {
    const s = io(URL)

    const handleOpen = (card: BoardCard<Category>) => {
      setCard(card);
    };

    const handleCancel = () => {
      setCard(null);
      setConfirmClose(false);
    };

    const handleApprove = (points: number) => {
      setTeamPoints(points);
      setCard(null);
    };

    const handleUpdate = (remoteBoard: BoardType, points: number) => {
      setBoard(remoteBoard);
      setTotalPoints(points);
    };

    const handleEnd = (points: number, remoteBoard: BoardType, total: number) => {
      setTeamPoints(points);
      setBoard(remoteBoard);
      setTotalPoints(total);
      setEndTime(0);
      setEnded(true);
    };

    const handleAdmin = (board: AdminBoard, teams: { [id: string]: TeamState }, log: LogEntry[]) => {
      setAdmin(true);
      setAdminBoard(board);
      setTeams(teams);
      setLog(log.reverse());
    };

    s.on('open', handleOpen);
    s.on('cancel', handleCancel);
    s.on('approve', handleApprove);
    s.on('update', handleUpdate);
    s.on('end', handleEnd);
    s.on('admin', handleAdmin);

    setSocket(s);
    return () => {
      s.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!socket || !admin) {
      return () => {};
    }

    const s = socket;

    const handleAEnd = (board: AdminBoard, teams: { [id: string]: TeamState }) => {
      setAdminBoard(board);
      setTeams(teams);
    };

    const handleAStart = (board: AdminBoard, endTime: number, teams: { [id: string]: TeamState }) => {
      setAdminBoard(board);
      setEndTime(endTime);
      setTeams(teams);
      console.log(teams);
    };

    const handleAUpdate = (board: AdminBoard, teams: { [id: string]: TeamState }) => {
      setAdminBoard(board);
      setTeams(teams);
      setCard((card) => {
        if (card === null) return null;
        return board[card.category][card.value];
      });
    };

    const handleALog = (le: LogEntry) => {
      setLog((l) => [le, ...(l ?? [])]);
    };

    s.on('a_end', handleAEnd);
    s.on('a_start', handleAStart);
    s.on('a_update', handleAUpdate);
    s.on('a_log', handleALog);

    return () => {
      s.off('a_end', handleAEnd);
      s.off('a_start', handleAStart);
      s.off('a_update', handleAUpdate);
      s.off('a_log', handleALog);
    };
  }, [socket, admin]);

  useEffect(() => {
    if (!socket || !team) {
      return () => {};
    }

    const onConnect = () => {
      socket.emit('join', team, (err: string | undefined, remoteBoard: BoardType,
        end: number, points: number, total: number) => {
        if (err) {
          console.error(err);
          return;
        }

        resetVariables();
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
    if (admin) {
      setCard(adminBoard?.[category][value] ?? null);
      return;
    }

    if (socket) {
      socket.emit('open', category, value, (err: string | undefined) => {
        if (err) {
          console.error(err);
        }
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamType(event.target.value);
  };

  const handleClose = () => {
    if (socket) {
      setTeamError(false);
      socket.emit('join', teamType, (err: string | undefined, remoteBoard: BoardType,
        end: number, points: number, total: number) => {
        if (err) {
          setTeamError(true);
          console.error(err);
          return;
        }

        resetVariables();
        setTeam(teamType);
        setBoard(remoteBoard);
        setEndTime(end);
        setTeamPoints(points);
        setTotalPoints(total);
      });
    } else {
      setTeamError(true);
    }
  };

  const handleCardClose = () => {
    if (admin) {
      setCard(null);
      return;
    }

    if (socket) {
      socket.emit('cancel', card?.category, card?.value, (err: string | undefined) => {
        if (err) {
          setCard(null);
          console.error(err);
        }
      });
    } else {
      setConfirmClose(false);
    }
  };

  const handleReject = () => {
    if (!admin || !socket) return;
    socket.emit('reject', card?.category, card?.value, (err: string | undefined) => {
      if (err) {
        console.error(err);
      } else {
        setCard(null);
      }
    });
  };

  const handleApprove = () => {
    if (!admin || !socket) return;
    socket.emit('approve', card?.category, card?.value, (err: string | undefined) => {
      if (err) {
        console.error(err);
      } else {
        setCard(null);
      }
    });
  };

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
        <DialogTitle>{card?.title} ({card?.value})</DialogTitle>
        <DialogContent>
          <ReactMarkdown
            renderers={{
              text: MDTypography,
              link: Link,
            }}
            linkTarget='_blank'
          >
            {card?.description ?? ''}
          </ReactMarkdown>
          {card && !admin ? cardStatus(card) : null}
          {!admin || !(card?.submission) ? null : <>
            <br /><hr /><br />
            <Typography variant='h5' color='textPrimary'>
              Submission
            </Typography>
            <Typography variant='h6' color='textPrimary'>
              Attachments
            </Typography>
            {(card?.submission?.attachments ?? []).map((att, i) => (
              <Link
                key={att}
                href={`https://drive.google.com/file/d/${att}/view`}
                target='_blank'
                rel='noopener'
              >
                <Typography variant='body1'>
                  Attachment {i + 1}
                </Typography>
              </Link>
            ))}
            <Typography variant='h6' color='textPrimary'>
              Text
            </Typography>
            <Typography variant='body1' color='textSecondary'>
              {card?.submission?.text}
            </Typography>
          </>}
        </DialogContent>
        <DialogActions>
          {admin ? <>
            <Button onClick={handleCardClose} color='primary'>
              Close
            </Button>
            <div style={{flex: '1 0 0'}} />
            <Button
              color='primary'
              variant='contained'
              onClick={handleReject}
              disabled={card?.status !== CardStatus.RECEIVED}
            >
              Reject
            </Button>
            <Button
              color='primary'
              variant='contained'
              onClick={handleApprove}
              disabled={card?.status !== CardStatus.RECEIVED && card?.status !== CardStatus.REJECTED}
            >
              Approve
            </Button>
          </> : <>
            <Button onClick={() => setConfirmClose(true)} color='primary'>
              Cancel
            </Button>
            <div style={{flex: '1 0 0'}} />
            <Button
              href={`${URL}/submit/${card?.category}/${card?.value}`}
              target='_blank'
              rel='noopener'
              color='primary'
              variant='contained'
              disabled={card?.status === CardStatus.RECEIVED}
            >
              Submit
            </Button>
          </>}
        </DialogActions>
      </Dialog>
      <Dialog open={confirmClose}>
        <DialogContent>
          <Typography variant='body1' color='textPrimary'>
            Are you sure you want to cancel?
            <br />
            You won't be able to come back.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClose(false)} color='primary'>
            No
          </Button>
          <Button onClick={handleCardClose} color='primary'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.title}>
          <Title />
        </Grid>
        <Grid item xs={12} style={{ flexGrow: 1 }}>
          <Board
            board={ended ? INITIAL_BOARD : board}
            adminBoard={admin ? adminBoard : null}
            onCardClick={onCardClick}
          />
        </Grid>
      </Grid>
      { !admin ? null : (
        <div className={classes.status}>
          <Timer endTime={endTime} />
          {Object.keys(teams ?? {}).map((team) => (
            <Typography
              variant='h6'
              align='center'
              color='textPrimary'
            >
              {team} ({teams?.[team].players.length}): {teams?.[team]?.points}
            </Typography>
          ))}
        </div>
      )}
      {team === '' || admin ? null : (
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
      )}
      {!admin || !log ? null : (
        <Container maxWidth='md'>
          <List>
            {log.map((le) => (
              <ListItem key={le.timestamp.toString()}>
                <Typography
                  variant='caption'
                  color={le.errored ? 'error' : 'textSecondary'}
                >
                  [{format(parse(le.timestamp.toString(), 'T', new Date()), 'h:mm:ss aaa')} {le.team}] {le.message}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Container>
      )}
    </MuiThemeProvider>
  );
};

export default App;
