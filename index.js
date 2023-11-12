const express = require('express');
const cors=require('cors');
const cluster = require('cluster');
const os = require('os');
const helmet = require('helmet');
const mongoose = require('mongoose');
const {userRoutes} = require('./routes');
const {errorMiddleware} = require('./middleware/errors');
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
        app.listen(PORT, "0.0.0.0", () => {
          console.log(`Server is running on port ${PORT}`);
        });
    });

	// Express app security
	app.use(helmet());


	// Global Error Handling
	app.use(errorMiddleware);

	// Routes
    app.use('/api',userRoutes,errorMiddleware);
    app.get('/',(req,res)=>{
        res.send("Buzzr Backend");
    });
}