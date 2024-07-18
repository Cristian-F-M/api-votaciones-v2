import express from 'express';
import bodyParser from 'body-parser';
// import { auth } from './routes/index.js';


export default function createApp() {
    const app = express()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }));


    // ? Hacerlo para las demás rutas
    // app.use('/', auth)


    return app
}