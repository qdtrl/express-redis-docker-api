const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
let RedisStore = require('connect-redis')(session);

const { 
  MONGO_USER, 
  MONGO_PASSWORD, 
  MONGO_IP, 
  MONGO_PORT, 
  REDIS_URL,
  SESSION_SECRET,
  REDIS_PORT } = require('./config/config');
  
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
  .connect(mongoUrl)
  .then(() => console.log('succesfully connected to DB'))
  .catch((e) => {
    console.log(e)
    setTimeout(connectWithRetry, 5000);
  });
}

connectWithRetry();

app.enable("trust proxy");
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: null
    }
}))

app.use(express.json())

app.get('/api', (req, res) => {
  res.send('<h2>Hi you There!</h2>')
});

app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`))