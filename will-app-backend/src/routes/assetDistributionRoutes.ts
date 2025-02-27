import { getAssetDistributionByUserId, saveSpecificAssetDistribution, saveDistributionType, savePercentageAssetDistribution, saveSingleBeneficiaryAssetDistribution, saveResiduaryAssetDistribution } from "../controller/assetDistributionController";
import  express  from "express";

const router = express.Router();

router.post('/assetDistribution/saveAssetDistributionType',saveDistributionType);
router.post('/assetDistribution/saveSingleBeneficiaryAssetDistribution',saveSingleBeneficiaryAssetDistribution);
router.post('/assetDistribution/savePercentageAssetDistribution',savePercentageAssetDistribution);
router.post('/assetDistribution/saveSpecificAssetDistribution',saveSpecificAssetDistribution);
router.post('/assetDistribution/saveResiduaryAssetDistribution',saveResiduaryAssetDistribution);
router.get('/assetDistribution/getAssetDistributionByUserId',getAssetDistributionByUserId);

export default router;

