const express = require('express');
const cors=require('cors');
const cluster = require('cluster');
const os = require('os');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const {userRoutes, quizRoutes} = require('./routes');
const {errorMiddleware} = require('./middleware/errors');
const redisClient = require('./utils/redis');
const socketConnection = require('./utils/socket');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Clustering
const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {
	console.log(`Primary ${process.pid} is running`);
  
	// Fork workers.
	for (let i = 0; i < totalCPUs; i++) {
	  cluster.fork();
	}
  
	cluster.on('exit', (worker, code, signal) => {
	  console.log(`worker ${worker.process.pid} died`);
	});
} else {

	const app = express();
	
	app.use(express.json());
	app.use(cors({origin:true}));
	app.use(express.urlencoded({ extended: false }));

    // Connecting to MongoDB and Starting the Server
    mongoose.connect(process.env.DB_URI).then(() => {
        console.log("DB Connected");
        const server = app.listen(PORT, "0.0.0.0", () => {
          console.log(`Server is running on port ${PORT}`);
        });
		socketConnection(server);
    });

	// Express app security
	app.use(helmet());

	// HTTP request logger
	app.use(morgan('tiny'));

	// Global Error Handling
	app.use(errorMiddleware);

	// Routes
	app.use('/api/quiz',quizRoutes,errorMiddleware);
    app.use('/api',userRoutes,errorMiddleware);
    app.get('/',(req,res)=>{
        res.send("Buzzr Backend");
    });
}