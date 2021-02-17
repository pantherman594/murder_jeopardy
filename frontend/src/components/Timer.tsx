import React, { useEffect, useState } from 'react';

import Typography from '@material-ui/core/Typography';

const Timer = ({ endTime }: { endTime: number }) => {
  const [remaining, setRemaining] = useState<number>(90 * 60);

  useEffect(() => {
    const int = setInterval(() => {
      setRemaining(Math.max(0, Math.floor((endTime - new Date().getTime()) / 1000)));
    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, [endTime]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <Typography
      variant='h4'
      align='center'
      color='textPrimary'
    >
      {`${mins}:${secs.toString().padStart(2, '0')}`}
    </Typography>
  );
};

export default Timer;
