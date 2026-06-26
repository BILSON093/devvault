import morgan from 'morgan';

// Custom token: user ID
morgan.token('user-id', (req: any) => {
  return req.user?.userId || 'anonymous';
});

// Dev format with colors
export const devLogger = morgan('dev');

// Production format with user tracking
export const prodLogger = morgan(':method :url :status :res[content-length] - :response-time ms user=:user-id');
