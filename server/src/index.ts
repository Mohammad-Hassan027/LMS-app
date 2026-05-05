import { app } from './app.js';
import { PORT } from './constants.js';
import connectDB from './db/index.js';

connectDB()
  .then(() => {
    console.log('Database connected');
  })
  .catch((e) => {
    console.error('Mongo DB connection failed', e);
  });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

export default app;
