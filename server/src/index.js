import { app } from './app.js';
import { PORT } from './constants.js';
import connectDB from './db/index.js';

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log('Mongo db connection failed !!!', e);
  });
