"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const assetRoutes_1 = __importDefault(require("./routes/assetRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", userRoutes_1.default);
app.use('/api', addressRoutes_1.default);
app.use('/api', assetRoutes_1.default);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
