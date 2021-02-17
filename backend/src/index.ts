import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { createServer } from 'http';
import express from 'express';
import { nanoid } from 'nanoid';
import path from 'path';

import {
  Board,
  Callback,
  Category,
  LogEntry,
  TeamState,
} from './types';
import { generateBoard } from './board';

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const port = process.env.PORT || 5000;

const ADMIN = 'ADMIN';

let endTime: number = -1;
const board: Board = generateBoard();
// eslint-disable-next-line @typescript-eslint/naming-convention
const _log: LogEntry[] = [];
const submissionIds: { [key: string]: { team: string; category: string; value: number; } } = {};

const teamIds = ['HEVI', 'KRNU', 'FHGB', 'VZDM'];
const teams: { [id: string]: TeamState } = {
  HEVI: {
    points: 0,
    pending: null,
    players: new Set<string>(),
  },
  KRNU: {
    points: 0,
    pending: null,
    players: new Set<string>(),
  },
  FHGB: {
    points: 0,
    pending: null,
    players: new Set<string>(),
  },
  VZDM: {
    points: 0,
    pending: null,
    players: new Set<string>(),
  },
};

const getTotalPoints = (): number => (
  Object.values(teams).map((teamData) => teamData.points).reduce((a, b) => a + b)
);

const log = (entry: LogEntry) => {
  _log.push(entry);
  io.to(ADMIN).emit('log', entry);
  console.log('[LOG]', entry);
};

const stripBoard = () => Object.keys(board).map((category) => (
  [category, ...Object.keys(board[category]).map((val) => {
    const c = board[category][val];
    return c.value * (c.available ? 1 : -1);
  })]
));

if (process.env.NODE_ENV === 'production') {
  const webClient = path.join(__dirname, '..', '..', 'frontend', 'build');
  app.use(express.static(webClient));
}

app.get('/submit/:category/:value', (req, res) => {
  const { category, value } = req.params;
  const card = board[category]?.[value];

  if (card === undefined) {
    res.sendStatus(404);
    return;
  }

  const team = teamIds.find((t) => teams[t].pending === card.id);

  if (team === undefined) {
    res.sendStatus(404);
    return;
  }

  const id = nanoid();
  submissionIds[id] = {
    team,
    category,
    value: parseInt(value, 10),
  };

  const { title } = card;

  res.redirect(`https://docs.google.com/forms/d/e/1FAIpQLSfAo17ZceWpeqrhyOaKYatRMChomqV0D_vugAn9clBdkuzlFQ/viewform?usp=pp_url&entry.1341464943=${title}&entry.658473068=${id}`);
});

app.get('/submitted/:id', (req, res) => {
  res.sendStatus(200);

  const { id } = req.params;
  const submission = submissionIds[id];

  if (submission === undefined) return;
  const { team, category, value } = submission;

  log({
    timestamp: new Date().getTime(),
    team,
    event: 'submit',
    message: `Submitted ${category} for ${value}`,
    errored: false,
  });

  io.to(ADMIN).emit('submit', team, category, value);
  io.to(team).emit('submit');
  delete submissionIds[id];
});

io.on('connection', (socket: Socket) => {
  let team: string | null = null;
  console.log('Connected client on port %s.', port);

  const makeSuccess = (event: string, callback: Callback) => (message: string, ...data: any) => {
    callback(null, ...data);
    log({
      timestamp: new Date().getTime(),
      team,
      event,
      message,
      errored: false,
    });
  };

  const makeError = (event: string, callback: Callback) => (message: string) => {
    callback(message);
    log({
      timestamp: new Date().getTime(),
      team,
      event,
      message,
      errored: true,
    });
  };

  const makeResult = (event: string, callback: Callback) => [
    makeSuccess(event, callback),
    makeError(event, callback),
  ];

  socket.on('join', (t: string, callback: Callback) => {
    const [onSuccess, onError] = makeResult('join', callback);

    if (team === ADMIN) {
      team = ADMIN;
      onSuccess('Admin joined', board, endTime, teams);
      return;
    }

    if (team !== null) {
      onError('Already in a team');
      return;
    }

    if (teams[t] === undefined) {
      onError('Invalid team name.');
      return;
    }

    socket.join(t);

    team = t;
    if (endTime < 0) {
      const duration = 90 * 60 * 1000;
      endTime = new Date().getTime() + duration;
      setTimeout(() => {
        const total = getTotalPoints();
        const finalBoard = stripBoard();
        teamIds.forEach((tId) => io.to(tId).emit('end', teams[tId].points, finalBoard, total));
        io.to(ADMIN).emit('end', teams, board);
      }, duration);
      io.to(ADMIN).emit('start', board, endTime, teams);
    }

    onSuccess(`Joined team ${t}`, stripBoard(), endTime, teams[t].points, getTotalPoints());
    teams[team]?.players.add(socket.id);
    io.to(ADMIN).emit('join', t);
  });

  socket.on('open', (category: Category, value: number, callback: Callback) => {
    const [onSuccess, onError] = makeResult('open', callback);

    if (team === null || team === ADMIN) {
      onError('Invalid team.');
      return;
    }

    if (teams[team].pending !== null) {
      onError('Already opened a card.');
      return;
    }

    if (board[category]?.[value]?.available === true) {
      const card = board[category][value];
      card.available = false;
      teams[team].pending = card.id;
      onSuccess(`Opened ${category} for ${value}`);
      io.to(team).emit('open', card);
      io.emit('update', stripBoard(), getTotalPoints());
    } else {
      onError('Invalid card.');
    }
  });

  socket.on('cancel', (category: Category, value: number, callback: Callback) => {
    const [onSuccess, onError] = makeResult('cancel', callback);

    if (team === null || team === ADMIN) {
      onError('Invalid team.');
      return;
    }

    if (teams[team].pending === null) {
      onError('No card is open.');
      return;
    }

    const card = board[category]?.[value];
    if (card !== undefined && teams[team].pending === card.id && card.available === false) {
      teams[team].pending = null;
      onSuccess(`Cancelled ${category} for ${value}`);
      io.to(team).emit('cancel', category, value);
    } else {
      onError('Invalid card.');
    }
  });

  socket.on('help', (callback: Callback) => {
    const [onSuccess] = makeResult('help', callback);

    onSuccess(`${team === null ? 'Unassigned user' : team} requested help`);
    io.to(ADMIN).emit('help', team);
  });

  // ADMIN ONLY
  socket.on('approve', (submittingTeam: string, category: Category, value: number, callback: Callback) => {
    const [onSuccess, onError] = makeResult('approve', callback);

    if (team !== ADMIN) {
      onError('No permission');
      return;
    }

    const card = board[category]?.[value];
    if (card !== undefined && teams[submittingTeam].pending === card.id
        && card.available === false) {
      teams[submittingTeam].pending = null;
      onSuccess(`Approved ${category} for ${value}, for team ${submittingTeam}`);
      teams[team].points += value;
      io.to(team).emit('approve', category, value);
      io.to(ADMIN).emit('approve', category, value);
      io.emit('update', stripBoard(), getTotalPoints());
    } else {
      onError('Invalid card.');
    }
  });

  // ADMIN ONLY
  socket.on('reject', (submittingTeam: string, category: Category, value: number, callback: Callback) => {
    const [onSuccess, onError] = makeResult('reject', callback);

    if (team !== ADMIN) {
      onError('No permission');
      return;
    }

    const card = board[category]?.[value];
    if (card !== undefined && teams[submittingTeam].pending === card.id
        && card.available === false) {
      onSuccess(`Rejected ${category} for ${value}, for team ${submittingTeam}`);
      io.to(team).emit('reject', category, value);
      io.to(ADMIN).emit('reject', category, value);
    } else {
      onError('Invalid card.');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected.');
    io.to(ADMIN).emit('disconnected', team);
    teams[team]?.players.delete(socket.id);
    log({
      timestamp: new Date().getTime(),
      team,
      event: 'disconnected',
      message: 'Player disconnected',
      errored: false,
    });
  });
});

server.listen(port, () => {
  console.log('Running server on port %s', port);
});
