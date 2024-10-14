import "dotenv/config";
import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { SequelizeConnection } from './services/sequelize';
import presentationRoutes from './routes/presentationRoutes';
import authRoutes from "./routes/authRoutes" 
import path from 'path';
const port = 3000;
const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
SequelizeConnection.getInstance(); 

//necessary routes 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', presentationRoutes);
app.use('/api', authRoutes);

/* app.listen(port, () => {
  console.log(`Server is running on port ${port}...`); 
}); */

export default app