import express from "express";
import userRoutes from "./routes/userRoutes";
import addressRoutes from './routes/addressRoutes';
import assetRoutes from './routes/assetRoutes';
import beneficiariesRoute from './routes/benefciariesRoutes';

const app = express();

app.use(express.json()); 
app.use("/api", userRoutes);
app.use('/api', addressRoutes);
app.use('/api', assetRoutes);
app.use('/api', beneficiariesRoute);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
