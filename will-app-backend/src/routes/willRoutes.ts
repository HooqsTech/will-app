import express from "express";
import {
    getWillServices,
    getWillService,
    upsertWillServiceController,
    deleteWillService,
    upsertServiceCategoryController,
    deleteServiceCategory
} from "../controller/willController";

const router = express.Router();

router.get("/willService", getWillServices);
router.get("/willService/getById/:id", getWillService);
router.post("/willService", upsertWillServiceController);
router.delete("/willService/:id", deleteWillService);

router.post("/serviceCategory", upsertServiceCategoryController);
router.delete("/serviceCategory/:id", deleteServiceCategory);

export default router;
