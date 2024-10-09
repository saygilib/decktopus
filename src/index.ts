import "dotenv/config";
import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { SequelizeConnection } from './services/sequelize';
import presentationRoutes from './routes/presentationRoutes';

const port = 3000;
const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
SequelizeConnection.getInstance(); 

app.use('/', presentationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`); 
});

