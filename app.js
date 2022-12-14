require('dotenv').config();
require('express-async-errors');
var cors = require('cors')

const path = require('path');
// extra security packages
const helmet = require('helmet');
const xss = require('xss-clean');
var bodyParser = require('body-parser');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
app.use(helmet());

app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use('/api/v1/jobs',jobsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT||5000;


app.use(cors())

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening ons port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
