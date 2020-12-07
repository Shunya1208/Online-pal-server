// importing 
const mongoose = require("mongoose");
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// specify a custom path for environment variables
dotenv.config({ path: './config.env' });

const app = require('./app');

// DB config
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
})


// listen
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listenign on location: ${port}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
  
  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('Process terminated!');
    });
  });
