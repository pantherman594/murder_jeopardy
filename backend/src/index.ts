import { Server, Socket } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from 'http';
import express from 'express';
import { nanoid } from 'nanoid';
import path from 'path';

import {
  Board,
  BoardCard,
  Callback,
  CardStatus,
  Category,
  LogEntry,
  TeamState,
} from './types';
import { generateBoard } from './board';

const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const port = process.env.PORT || 5000;

const ADMIN = process.env.ADMIN_KEY || 'ADMIN';

let endTime: number = -1;
const board: Board = generateBoard();
// eslint-disable-next-line @typescript-eslint/naming-convention
const _log: LogEntry[] = [];
const submissionIds: {
  [key: string]: { team: string; category: Category; value: number; };
} = {};

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
  io.to(ADMIN).emit('a_log', entry);
  console.log('[LOG]', entry);
};

const stripBoard = () => Object.keys(board).map((category: Category) => (
  [category, ...Object.keys(board[category]).map((val: string) => {
    const c = board[category][val as unknown as number];
    return c.value * (c.status === CardStatus.AVAILABLE ? 1 : -1);
  })]
));

const teamsObj = () => (
  Object.assign({}, ...teamIds.map((tId) => ({
    [tId]: {
      ...teams[tId],
      players: [...teams[tId].players],
    },
  })))
);

if (process.env.NODE_ENV === 'production') {
  const webClient = path.join(__dirname, '..', '..', 'frontend', 'build');
  app.use(express.static(webClient));
}

app.get('/submit/:category/:value', (req, res) => {
  const { category, value } = req.params;
  const card = board[category as Category]?.[value as unknown as number];

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
    category: category as Category,
    value: parseInt(value, 10),
  };

  const { title } = card;

  res.redirect(`https://docs.google.com/forms/d/e/1FAIpQLSfAo17ZceWpeqrhyOaKYatRMChomqV0D_vugAn9clBdkuzlFQ/viewform?usp=pp_url&entry.1341464943=${title}&entry.658473068=${id}`);
});

app.post('/submitted/:id', (req, res) => {
  res.sendStatus(200);

  const { id } = req.params;
  const submission = submissionIds[id];

  if (submission === undefined) return;
  const { team, category, value } = submission;

  const [, attachments = [], text] = req.body as [any, string[] | null, string, any];

  log({
    timestamp: new Date().getTime(),
    team,
    event: 'submit',
    message: `Submitted ${category} for ${value}`,
    errored: false,
  });

  const card = board[category][value];
  card.status = CardStatus.RECEIVED;
  card.submission = {
    attachments,
    text,
  };

  io.to(ADMIN).emit('a_update', board, teamsObj());
  io.to(team).emit('open', card);
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

    if (team !== null) {
      onError('Already in a team');
      return;
    }

    if (t === ADMIN) {
      team = ADMIN;
      onSuccess('Admin joined', stripBoard(), 0, 0, getTotalPoints());
      socket.emit('admin', board, teamsObj(), _log);
      socket.join(t);

      if (endTime > 0) {
        io.to(ADMIN).emit('a_start', board, endTime, teamsObj());
      }

      if (endTime > 0 && endTime < new Date().getTime()) {
        socket.emit('a_end', board, teamsObj());
      }
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
        io.to(ADMIN).emit('a_end', board, teamsObj());
      }, duration);
      io.to(ADMIN).emit('a_start', board, endTime, teamsObj());
    }

    onSuccess(`Joined team ${t}`, stripBoard(), endTime, teams[t].points, getTotalPoints());

    teams[t]?.players.add(socket.id);
    io.to(ADMIN).emit('a_update', board, teamsObj());

    if (teams[t].pending !== null) {
      const card = Object.values(board)
        .reduce((acc, cur) => (
          acc.concat(Object.values(cur))
        ), [] as BoardCard<Category>[])
        .find((c) => c.id === teams[t].pending);
      socket.emit('open', card);
    }

    if (endTime > 0 && endTime < new Date().getTime()) {
      const finalBoard = stripBoard();
      socket.emit('end', teams[t].points, finalBoard, getTotalPoints());
    }
  });

  socket.on('help', (callback: Callback) => {
    const [onSuccess] = makeResult('help', callback);

    onSuccess(`${team === null ? 'Unassigned user' : team} requested help`);
    io.to(ADMIN).emit('help', team);
  });

  socket.on('open', (category: Category, value: number, callback: Callback) => {
    const [onSuccess, onError] = makeResult('open', callback);

    if (endTime > 0 && endTime < new Date().getTime()) {
      onError('Game has ended.');
      return;
    }

    if (team === null || team === ADMIN) {
      onError('Invalid team.');
      return;
    }

    if (teams[team].pending !== null) {
      onError('Already opened a card.');
      return;
    }

    const card = board[category]?.[value];
    if (card?.status === CardStatus.AVAILABLE) {
      card.status = CardStatus.PENDING;
      teams[team].pending = card.id;

      onSuccess(`Opened ${category} for ${value}`);
      io.to(team).emit('open', card);
      io.emit('update', stripBoard(), getTotalPoints());
      io.to(ADMIN).emit('a_update', board, teamsObj());
    } else {
      onError('Invalid card.');
    }
  });

  socket.on('cancel', (category: Category, value: number, callback: Callback) => {
    const [onSuccess, onError] = makeResult('cancel', callback);

    if (endTime > 0 && endTime < new Date().getTime()) {
      onError('Game has ended.');
      return;
    }

    if (team === null || team === ADMIN) {
      onError('Invalid team.');
      return;
    }

    if (teams[team].pending === null) {
      onError('No card is open.');
      return;
    }

    const card = board[category]?.[value];
    if (card?.status !== CardStatus.AVAILABLE && teams[team].pending === card?.id) {
      teams[team].pending = null;
      card.status = CardStatus.CANCELLED;

      onSuccess(`Cancelled ${category} for ${value}`);
      io.to(team).emit('cancel', category, value);
      io.to(ADMIN).emit('a_update', board, teamsObj());
    } else {
      onError('Invalid card.');
    }
  });

  // ADMIN ONLY
  socket.on('approve', (category: Category, value: number, callback: Callback) => {
    const [onSuccess, onError] = makeResult('approve', callback);

    if (endTime > 0 && endTime < new Date().getTime()) {
      onError('Game has ended.');
      return;
    }

    if (team !== ADMIN) {
      onError('No permission');
      return;
    }

    const card = board[category]?.[value];
    if (card?.status === CardStatus.RECEIVED || card?.status === CardStatus.REJECTED) {
      const submittingTeam = teamIds.find((t) => teams[t].pending === card?.id);
      if (!submittingTeam) {
        onError('Invalid card.');
        return;
      }

      teams[submittingTeam].pending = null;
      card.status = CardStatus.APPROVED;

      onSuccess(`Approved ${category} for ${value}, for team ${submittingTeam}`);
      teams[submittingTeam].points += value;
      io.to(submittingTeam).emit('approve', teams[submittingTeam].points);
      io.emit('update', stripBoard(), getTotalPoints());
      io.to(ADMIN).emit('a_update', board, teamsObj());
    } else {
      onError('Invalid card.');
    }
  });

  // ADMIN ONLY
  socket.on('reject', (category: Category, value: number, callback: Callback) => {
    const [onSuccess, onError] = makeResult('reject', callback);

    if (endTime > 0 && endTime < new Date().getTime()) {
      onError('Game has ended.');
      return;
    }

    if (team !== ADMIN) {
      onError('No permission');
      return;
    }

    const card = board[category]?.[value];
    if (card?.status === CardStatus.RECEIVED) {
      const submittingTeam = teamIds.find((t) => teams[t].pending === card?.id);
      if (!submittingTeam) {
        onError('Invalid card.');
        return;
      }

      card.status = CardStatus.REJECTED;

      onSuccess(`Rejected ${category} for ${value}, for team ${submittingTeam}`);
      io.to(submittingTeam).emit('open', card);
      io.to(ADMIN).emit('a_update', board, teamsObj());
    } else {
      onError('Invalid card.');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected.');
    io.to(ADMIN).emit('a_update', board, teamsObj());
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
