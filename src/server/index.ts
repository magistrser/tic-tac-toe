import express, { Request, Response, Express, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { port } from 'src/server_config';
import { logger } from 'src/server/logger';

const app: Express = express();

app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(express.json() as RequestHandler);
app.use(express.static('dist'));

app.get('/', (req: Request, res: Response) => {
    console.log('sending index.html');
    res.sendFile('/dist/index.html');
});

app.use(function (error: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(`[${new Date()}]: <${req.url}>: error: ${error.toString()}, body: ${JSON.stringify(req.body)}`);
    next();
});

app.listen(port);
console.log(`App listening on ${port}`);
