import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { DistributionType } from '../models/enums';
import { getUserDistributionTypeService, getPercentageAssetDistributionService, getResiduaryAssetDistributionService, getSingleBeneficiaryByUserIdService, getSpecificAssetDistributionService, getWillDistributionByUserIdService, deleteSingleBeneficiaryDistributionService, deleteSpecificAssetDistributionService, deletePercentageDistributionService, deleteResiduaryAssetDistributionService, updateWillDistributionService, createWillDistributionService, updateSingleBeneficiaryService, createSingleBeneficiaryService, updatePercentageAssetDistributionService, createPercentageAssetDistributionService, updateSpecificAssetDistributionService, createSpecificAssetDistributionService, updateResiduaryAssetDistributionService, createResiduaryAssetDistributionService } from '../services/assetDistributionService';
import { validUser } from '../services/userServices';

const prisma = new PrismaClient();


export const saveDistributionType = async (request: Request, response: Response) => {
    try {
        const { userId, distributionType, residuaryDistributionType, fallbackRule } = request.body;

        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        //Check if there is an existing entry for the user
        const existingDistribution = await getWillDistributionByUserIdService(userId);

        //Delete current distribution data if the user is changing the type of distribution
        if(existingDistribution && existingDistribution.distributiontype !== distributionType){
            switch (existingDistribution.distributiontype) {
                case DistributionType.SINGLE:
                    await deleteSingleBeneficiaryDistributionService(userId);
                    console.log("Deleted data stored for single beneficiary");
                    break;
            
                case DistributionType.SPECIFIC:
                    await deleteSpecificAssetDistributionService(userId);                    
                    console.log("Deleted data stored for specific asset based beneficiaries");
                    break;
            
                case DistributionType.PERCENTAGE:
                    await deletePercentageDistributionService(userId);
                    console.log("Deleted data stored for percentage based beneficiaries");
                    break;
            
                default:
                    throw new Error("Invalid distribution type");
            }
            await deleteResiduaryAssetDistributionService(userId);
            console.log("Deleted data stored for residuary distribution");
        }

        //Delete current residuary distribution data if the user is changing the type of residuary distribution
        if(existingDistribution?.residuarydistributiontype !== residuaryDistributionType){
            await deleteResiduaryAssetDistributionService(userId);
            console.log("Deleted data stored for percentage based beneficiaries");
        }

        let distributionDetails;

        //Update existing record if it exists, or add new entry
        if (existingDistribution) {
            distributionDetails = await updateWillDistributionService(userId, distributionType, residuaryDistributionType, fallbackRule);
        } else {
            distributionDetails = await createWillDistributionService(userId, distributionType, residuaryDistributionType, fallbackRule);
        }
        response.status(200).json(distributionDetails);
    } catch (error) {
        console.error("Error while saving distribution type:", error);
        response.status(500).json({ error: "Internal Server Error." });
    }
};

export const saveSingleBeneficiaryAssetDistribution = async (request: Request, response: Response) => {
    try {
        const { userId, primaryBeneficiary, secondaryBeneficiary, tertiaryBeneficiary } = request.body;
        
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const userDistributionType = await getUserDistributionTypeService(userId); 
        if (userDistributionType !== DistributionType.SINGLE) {
            return response.status(400).json({ error: "Incorrect distribution." });
        }

        let distributionDetails;

        const existingEntry = await getSingleBeneficiaryByUserIdService(userId);

        //Update existing record if it exists, or add new entry
        if (existingEntry) {
            distributionDetails = await updateSingleBeneficiaryService(userId, primaryBeneficiary, secondaryBeneficiary, tertiaryBeneficiary);
        } else {
            distributionDetails = await createSingleBeneficiaryService(userId, primaryBeneficiary, secondaryBeneficiary, tertiaryBeneficiary);
        }
        response.status(200).json(distributionDetails);
    } catch (error) {
        console.error("Error while saving single beneficiary distribution:", error);
        response.status(500).json({ error: "Internal Server Error." });
    }
};


export const savePercentageAssetDistribution = async (request: Request, response : Response) => {
    try{
        const { userId, beneficiaryData} = request.body;
        
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const userDistributionType = await getUserDistributionTypeService(userId); 
        if (userDistributionType !== DistributionType.PERCENTAGE) {
            return response.status(400).json({ error: "Incorrect distribution." });
        }

        const existingEntry = await getPercentageAssetDistributionService(userId);

        let distributionDetails;

            //Update existing record if it exists, or add new entry
            if(existingEntry){
            distributionDetails = await updatePercentageAssetDistributionService(userId, beneficiaryData );
        }
        else{
            distributionDetails = await createPercentageAssetDistributionService(userId, beneficiaryData );

        }

        response.status(200).json(distributionDetails);
    }
    catch(error){
        console.error("Error while saving percentage based distribution:", error);
        response.status(500).json({ error: "Internal Server Error." });
    }
}

export const saveSpecificAssetDistribution = async (request : Request, response : Response) => {
    try{
        const { userId, assetData} = request.body;
        
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const userDistributionType = await getUserDistributionTypeService(userId); 
        if (userDistributionType !== DistributionType.SPECIFIC) {
            return response.status(400).json({ error: "Incorrect distribution." });
        }

        const existingEntry = await getSpecificAssetDistributionService(userId);
        let distributionDetails;
        
        //Update existing record if it exists, or add new entry
        if(existingEntry){
            distributionDetails = await updateSpecificAssetDistributionService(userId, assetData);
        }
        else{
            distributionDetails = await createSpecificAssetDistributionService(userId, assetData);

        }

        response.status(200).json(distributionDetails);

    }
    catch(error){
        console.error("Error while saving asset based distribution:", error);
        response.status(500).json({ error: "Internal Server Error." });
    }
}

export const saveResiduaryAssetDistribution = async (request: Request, response : Response) => {
    try{
        const { userId, beneficiaryData} = request.body;

        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const existingEntry = await getResiduaryAssetDistributionService(userId);

        let residuaryDistributionDetails;

        //Update existing record if it exists, or add new entry
        if(existingEntry){
            residuaryDistributionDetails = await updateResiduaryAssetDistributionService(userId, beneficiaryData);
        }
        else{
            residuaryDistributionDetails = await createResiduaryAssetDistributionService(userId, beneficiaryData);

        }

        response.status(200).json(residuaryDistributionDetails);
    }
    catch(error){
        console.error("Error while saving percentage based distribution:", error);
        response.status(500).json({ error: "Internal Server Error." });
    }
}

export const getAssetDistributionByUserId = async (request: Request, response: Response) => {
    try {
        const { userId } = request.body;

        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const distribution = await getWillDistributionByUserIdService(userId);

        if (!distribution) {
            return response.status(404).json({ error: "No distribution record found for the user." });
        }

        let distributionDetails;
        let residuaryDistributionDetails;

        //Get distribution data from corresponding table based on the type of distribution
        switch (distribution.distributiontype) {
            case DistributionType.SINGLE:
                distributionDetails = await getSingleBeneficiaryByUserIdService(userId);
                break;
        
            case DistributionType.SPECIFIC:
                distributionDetails = await getSpecificAssetDistributionService(userId);
                break;
        
            case DistributionType.PERCENTAGE:
                distributionDetails = await getPercentageAssetDistributionService(userId);
                break;
        
            default:
                throw new Error("Invalid distribution type");
        }
        

        residuaryDistributionDetails = await getResiduaryAssetDistributionService(userId);

        response.status(200).json({
            userid: userId,
            fallbackrule: distribution.fallbackrule,
            distributiontype: distribution.distributiontype,
            distributionDetails,
            residuarydistributiontype: distribution.residuarydistributiontype,
            residuaryDistributionDetails
        });
    } catch (error) {
        console.error("Error while getting asset distribution details:", error);
        response.status(500).json({ error: "Internal Server Error." });
    }
};