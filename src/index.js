const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const errors = require('./common/errors');
const logger = require('./common/logger');
const mongoose = require('mongoose');
const config = require('./config')
const passport = require('passport');
var session = require('express-session');

require('common/passport');

const app = express();

const corsOptions = {
  origin: '*',
  methods: [
    'GET',
    'PUT',
    'POST',
    'PATCH',
    'DELETE',
    'UPDATE'
  ],
  credentials: true
};

app.use(cors(corsOptions))

const winston = require('winston');
const winstonCloudWatch = require('winston-cloudwatch');

winston.add(winstonCloudWatch, {
  logGroupName: 'glo3012',
  logStreamName: 'sample'
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secrettexthere',
  saveUninitialized: true,
  resave: true,
  proxy: true // add this line
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(express.static('uploads'))

app.use(passport.initialize());
app.use(passport.session());

app.use(errors.genericErrorHandler);

// Enables access-logs on each calls
app.use(morgan('combined', {'stream': logger.stream}));

mongoose.connect(`mongodb://${config.db.instance}/${config.db.name}`);

require('./routes')(app);

const port = process.env.PORT || 8000;
app.listen(port);

logger.info('App started')
logger.info(`Port : ${port}`)
logger.info(`Environment : ${process.env.NODE_ENV}`)
logger.info(`Database : ${config.db.instance}/${config.db.name}`)
