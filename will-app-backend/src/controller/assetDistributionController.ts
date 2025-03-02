import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { DistributionType } from '../models/enums';
import { UUID } from 'crypto';

const prisma = new PrismaClient();

//Check if the given user id is valid
const validUser = async (userId: UUID): Promise<boolean> => {
    const user = await prisma.users.findUnique({ where: { userid: userId } });
    return !!user;
};

//Get distribution type for user
const getUserDistributionType = async (userId: UUID): Promise<string | null> => {
    const distribution = await prisma.will_distribution.findUnique({
        where: { user_id: userId },
        select: { distribution_type: true }
    });

    return distribution?.distribution_type || null; 
};

//Check for valid beneficiaries
const validBeneficiaries = async (userId: UUID, beneficiaries: UUID[]): Promise<Boolean> =>{
    const allBeneficiaries = await prisma.beneficiaries.findMany({
        where: {userid: userId},
        select: {id: true}
    })
    const existingIds = new Set(allBeneficiaries.map(b => b.id)); 

    return beneficiaries.every(id => existingIds.has(id));
}

export const saveDistributionType = async (request: Request, response: Response) => {
    try {
        const { userId, distributionType, residuaryDistributionType, fallbackRule } = request.body;

        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        //Check if there is an existing entry for the user
        const existingDistribution = await prisma.will_distribution.findUnique({
            where: { user_id: userId }
        });

        //Delete current distribution data if the user is changing the type of distribution
        if(existingDistribution && existingDistribution.distribution_type !== distributionType){
            switch (existingDistribution.distribution_type) {
                case DistributionType.SINGLE:
                    await prisma.single_beneficiary_distribution.deleteMany({
                        where: {user_id: userId}
                    })
                    console.log("Deleted data stored for single beneficiary");
                    break;
            
                case DistributionType.SPECIFIC:
                    await prisma.specific_asset_distribution.deleteMany({
                        where: {user_id: userId}
                    })
                    
                    console.log("Deleted data stored for specific asset based beneficiaries");
                    break;
            
                case DistributionType.PERCENTAGE:
                    await prisma.percentage_distribution.deleteMany({
                        where: {user_id: userId}
                    })
                    console.log("Deleted data stored for percentage based beneficiaries");
                    break;
            
                default:
                    throw new Error("Invalid distribution type");
            }
            await prisma.residuary_asset_distribution.deleteMany({
                where: {user_id: userId}
            })
            console.log("Deleted data stored for residuary distribution");
        }

        //Delete current residuary distribution data if the user is changing the type of residuary distribution
        if(existingDistribution?.residuary_distribution_type !== residuaryDistributionType){
            await prisma.residuary_asset_distribution.deleteMany({
                where: {user_id: userId}
            })
            console.log("Deleted data stored for percentage based beneficiaries");
        }

        let distributionDetails;

        //Update existing record if it exists, or add new entry
        if (existingDistribution) {
            distributionDetails = await prisma.will_distribution.update({
                where: { user_id: userId },
                data: {
                    distribution_type: distributionType,
                    residuary_distribution_type: residuaryDistributionType,
                    fallback_rule: fallbackRule,
                    updated_at: new Date(),
                },
            });
        } else {
            distributionDetails = await prisma.will_distribution.create({
                data: {
                    user_id: userId,
                    distribution_type: distributionType,
                    residuary_distribution_type: residuaryDistributionType,
                    fallback_rule: fallbackRule,
                    created_at: new Date(),
                },
            });
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

        const userDistributionType = await getUserDistributionType(userId); 
        if (userDistributionType !== DistributionType.SINGLE) {
            return response.status(400).json({ error: "Incorrect distribution." });
        }

        let distributionDetails;

        const existingEntry = await prisma.single_beneficiary_distribution.findUnique({
            where: {
                user_id: userId
            },
        });

        //Update existing record if it exists, or add new entry
        if (existingEntry) {
            distributionDetails = await prisma.single_beneficiary_distribution.update({
                where: { user_id:userId },
                data: {
                    primary_beneficiary_id: primaryBeneficiary,
                    secondary_beneficiary_id: secondaryBeneficiary,
                    tertiary_beneficiary_id: tertiaryBeneficiary,
                    updated_at: new Date(),
                },
            });
        } else {
            distributionDetails = await prisma.single_beneficiary_distribution.create({
                data: {
                    user_id: userId,
                    primary_beneficiary_id: primaryBeneficiary,
                    secondary_beneficiary_id: secondaryBeneficiary,
                    tertiary_beneficiary_id: tertiaryBeneficiary,
                    created_at: new Date(),
                },
            });
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

        const userDistributionType = await getUserDistributionType(userId); 
        if (userDistributionType !== DistributionType.PERCENTAGE) {
            return response.status(400).json({ error: "Incorrect distribution." });
        }

        const existingEntry = await prisma.percentage_distribution.findFirst({
            where: {
                user_id: userId
            },
        });

        let distributionDetails;

            //Update existing record if it exists, or add new entry
            if(existingEntry){
            distributionDetails = await prisma.percentage_distribution.update({
                where: {user_id : userId},
                data: {
                    beneficiaries: beneficiaryData,
                    updated_at: new Date(),
                }
            });
        }
        else{
            distributionDetails = await prisma.percentage_distribution.create({
                data: {
                    user_id: userId,
                    beneficiaries: beneficiaryData,
                    created_at: new Date(),
                },
            })
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

        const userDistributionType = await getUserDistributionType(userId); 
        if (userDistributionType !== DistributionType.SPECIFIC) {
            return response.status(400).json({ error: "Incorrect distribution." });
        }

        const existingEntry = await prisma.specific_asset_distribution.findFirst({
            where: {
                user_id: userId
            },
        });
        let distributionDetails;
        
        //Update existing record if it exists, or add new entry
        if(existingEntry){
            distributionDetails = await prisma.specific_asset_distribution.update({
                where: {user_id : userId},
                data: {
                    assets: assetData,
                    updated_at: new Date(),
                }
            });
        }
        else{
            distributionDetails = await prisma.specific_asset_distribution.create({
                data: {
                    user_id: userId,
                    assets: assetData,
                    created_at: new Date(),
                },
            })
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

        const existingEntry = await prisma.residuary_asset_distribution.findFirst({
            where: {
                user_id: userId
            },
        });

        let residuaryDistributionDetails;

        //Update existing record if it exists, or add new entry
        if(existingEntry){
            residuaryDistributionDetails = await prisma.residuary_asset_distribution.update({
                where: {user_id : userId},
                data: {
                    beneficiaries: beneficiaryData,
                    updated_at: new Date(),
                }
            });
        }
        else{
            residuaryDistributionDetails = await prisma.residuary_asset_distribution.create({
                data: {
                    user_id: userId,
                    beneficiaries: beneficiaryData,
                    created_at: new Date(),
                },
            })
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

        const distribution = await prisma.will_distribution.findUnique({
            where: { user_id: userId },
            select: { distribution_type: true, residuary_distribution_type: true, fallback_rule: true },
        });

        if (!distribution) {
            return response.status(404).json({ error: "No distribution record found for the user." });
        }

        let distributionDetails;
        let residuaryDistributionDetails;

        //Get distribution data from corresponding table based on the type of distribution
        switch (distribution.distribution_type) {
            case DistributionType.SINGLE:
                distributionDetails = await prisma.single_beneficiary_distribution.findUnique({
                    where: { user_id: userId },
                    select: {
                        primary_beneficiary_id: true,
                        secondary_beneficiary_id: true,
                        tertiary_beneficiary_id: true
                    },
                });
                break;
        
            case DistributionType.SPECIFIC:
                distributionDetails = await prisma.specific_asset_distribution.findUnique({
                    where: { user_id: userId },
                    select: { assets: true },
                });
                break;
        
            case DistributionType.PERCENTAGE:
                distributionDetails = await prisma.percentage_distribution.findUnique({
                    where: { user_id: userId },
                    select: { beneficiaries: true },
                });
                break;
        
            default:
                throw new Error("Invalid distribution type");
        }
        

        residuaryDistributionDetails = await prisma.residuary_asset_distribution.findUnique({
            where: { user_id: userId },
            select: {beneficiaries: true},
        });

        response.status(200).json({
            user_id: userId,
            fall_back_rule: distribution.fallback_rule,
            distribution_type: distribution.distribution_type,
            distributionDetails,
            residuary_distribution_type: distribution.residuary_distribution_type,
            residuaryDistributionDetails,
        });
    } catch (error) {
        console.error("Error while getting asset distribution details:", error);
        response.status(500).json({ error: "Internal Server Error." });
    }
};