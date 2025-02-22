import express from "express";
import userRoutes from "./routes/userRoutes";
import assetRoutes from './routes/assetRoutes';
import benefciariesRoutes from './routes/benefciariesRoutes';
import liabilitiesRoutes from './routes/liabilitiesRoutes';
import cors from 'cors'
const app = express();

app.use(cors());

app.use(express.json()); 
app.use("/api", userRoutes);
app.use('/api', assetRoutes);
app.use('/api', benefciariesRoutes);
app.use('/api', liabilitiesRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));