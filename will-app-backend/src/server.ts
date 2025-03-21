import express from "express";
import userRoutes from "./routes/userRoutes";
import assetRoutes from './routes/assetRoutes';
import benefciariesRoutes from './routes/benefciariesRoutes';
import liabilitiesRoutes from './routes/liabilitiesRoutes';
import assetDistributionRoutes from './routes/assetDistributionRoutes';
import paymentRoutes from './routes/paymentRoutes';
import cors from 'cors';
import admin from "firebase-admin";
import path from "path";
import pdfGeneratorRoutes from "./routes/pdfGeneratorRoutes";
import willRoutes from "./routes/willRoutes"

// Initialize Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api", userRoutes);
app.use('/api', assetRoutes);
app.use('/api', benefciariesRoutes);
app.use('/api', liabilitiesRoutes);
app.use('/api', assetDistributionRoutes);
app.use('/api', pdfGeneratorRoutes);
app.use("/api", paymentRoutes)
app.use("/api", willRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));