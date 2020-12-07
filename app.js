const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const Pusher = require("pusher");
const userRouter = require('./routes/userRoutes');
const messageRouter = require('./routes/messageRoutes');
const roomRouter = require('./routes/roomRoutes');
const mongoose = require("mongoose");
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');



// Start express app
const app = express();
app.enable('trust proxy');

// Pusher configuration
const pusher = new Pusher({
  appId: "1108524",
  key: "b819afcc49b3b99809a0",
  secret: "b1c50f766b2cfeab89c0",
  cluster: "ap3",
  useTLS: true
});


const db = mongoose.connection;

db.once("open", () => {
    console.log("DB connection open");

    const msgCollection = db.collection("messages");
    const roomCollection = db.collection("rooms");
    const mesChangeStream = msgCollection.watch();
    const roomChangeStream = roomCollection.watch();

    

    mesChangeStream.on("change", (change) => {
        if(change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages","inserted",
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    _id: messageDetails._id
                }
            )
        }
    })

    roomChangeStream.on("change", (change) => {
        if(change.operationType === "insert") {
            const roomDetails = change.fullDocument;
            pusher.trigger("rooms","inserted",
                {
                    _id: roomDetails._id,
                    createdAt: roomDetails.createdAt,
                }
            )
        } 
    })
})

// GLOBAL MIDDLEWARES

// Implement CORS
app.use(cors());
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Compress requests
app.use(compression());

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/messages', messageRouter);
// app.use('/api/v1/subscriptions', subscriptionsRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

