
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';

const app = express();

dotenv.load({ path: '.env.dev' });

import * as userController from './controllers/user.controller';

app.set('port', process.env.PORT || 8080);
app.set('json spaces', 2);
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/users', userController.getUsers);
app.get('/test', (req, res) => {
  res.json({ok: "yes"});
})

app.use((err, req, res, next) => {
  console.error('stack', err.stack);
  res.sendStatus(500);
});

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`);
});
