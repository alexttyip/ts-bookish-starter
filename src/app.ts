import express from 'express';
import 'dotenv/config';

import healthcheckRoutes from './routers/healthcheckRouter';
import bookRoutes from './routers/bookRouter';

const port = process.env['PORT'] || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

/**
 * Primary app routes.
 */
app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);
