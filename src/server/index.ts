
import express, {Request, Response, Router, Express} from 'express';
import busboy from 'connect-busboy';
import router from './route';
import { RequestHandler } from 'express-serve-static-core';

// call express
const app: Express = express(); // define our app using express

// configure app to use bodyParser for
// Getting data from body of requests
app.use(express.urlencoded({extended: true}) as RequestHandler);

app.use(express.json() as RequestHandler) 

app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

const port: number = Number(process.env.PORT) || 8050; // set our port

// Send index.html on root request
app.use(express.static('dist'));
app.get('/', (req:Request, res:Response) => {
    console.log('sending index.html');
    res.sendFile('/dist/index.html');
});

// REGISTER ROUTES
// all of the routes will be prefixed with /api
const routes: Router[] = Object.values(router);
app.use('/api', routes);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`App listening on ${port}`);

export default app;
