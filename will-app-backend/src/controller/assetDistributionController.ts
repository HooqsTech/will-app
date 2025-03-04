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
        where: { userid: userId },
        select: { distributiontype: true }
    });

    return distribution?.distributiontype || null; 
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
            where: { userid: userId }
        });

        //Delete current distribution data if the user is changing the type of distribution
        if(existingDistribution && existingDistribution.distributiontype !== distributionType){
            switch (existingDistribution.distributiontype) {
                case DistributionType.SINGLE:
                    await prisma.single_beneficiary_distribution.deleteMany({
                        where: {userid: userId}
                    })
                    console.log("Deleted data stored for single beneficiary");
                    break;
            
                case DistributionType.SPECIFIC:
                    await prisma.specific_asset_distribution.deleteMany({
                        where: {userid: userId}
                    })
                    
                    console.log("Deleted data stored for specific asset based beneficiaries");
                    break;
            
                case DistributionType.PERCENTAGE:
                    await prisma.percentage_distribution.deleteMany({
                        where: {userid: userId}
                    })
                    console.log("Deleted data stored for percentage based beneficiaries");
                    break;
            
                default:
                    throw new Error("Invalid distribution type");
            }
            await prisma.residuary_asset_distribution.deleteMany({
                where: {userid: userId}
            })
            console.log("Deleted data stored for residuary distribution");
        }

        //Delete current residuary distribution data if the user is changing the type of residuary distribution
        if(existingDistribution?.residuarydistributiontype !== residuaryDistributionType){
            await prisma.residuary_asset_distribution.deleteMany({
                where: {userid: userId}
            })
            console.log("Deleted data stored for percentage based beneficiaries");
        }

        let distributionDetails;

        //Update existing record if it exists, or add new entry
        if (existingDistribution) {
            distributionDetails = await prisma.will_distribution.update({
                where: { userid: userId },
                data: {
                    distributiontype: distributionType,
                    residuarydistributiontype: residuaryDistributionType,
                    fallbackrule: fallbackRule,
                    updatedat: new Date(),
                },
            });
        } else {
            distributionDetails = await prisma.will_distribution.create({
                data: {
                    userid: userId,
                    distributiontype: distributionType,
                    residuarydistributiontype: residuaryDistributionType,
                    fallbackrule: fallbackRule,
                    createdat: new Date(),
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
                userid: userId
            },
        });

        //Update existing record if it exists, or add new entry
        if (existingEntry) {
            distributionDetails = await prisma.single_beneficiary_distribution.update({
                where: { userid:userId },
                data: {
                    primarybeneficiaryid: primaryBeneficiary,
                    secondarybeneficiaryid: secondaryBeneficiary,
                    tertiarybeneficiaryid: tertiaryBeneficiary,
                    updatedat: new Date(),
                },
            });
        } else {
            distributionDetails = await prisma.single_beneficiary_distribution.create({
                data: {
                    userid: userId,
                    primarybeneficiaryid: primaryBeneficiary,
                    secondarybeneficiaryid: secondaryBeneficiary,
                    tertiarybeneficiaryid: tertiaryBeneficiary,
                    createdat: new Date(),
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
                userid: userId
            },
        });

        let distributionDetails;

            //Update existing record if it exists, or add new entry
            if(existingEntry){
            distributionDetails = await prisma.percentage_distribution.update({
                where: {userid : userId},
                data: {
                    beneficiaries: beneficiaryData,
                    updatedat: new Date(),
                }
            });
        }
        else{
            distributionDetails = await prisma.percentage_distribution.create({
                data: {
                    userid: userId,
                    beneficiaries: beneficiaryData,
                    createdat: new Date(),
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
                userid: userId
            },
        });
        let distributionDetails;
        
        //Update existing record if it exists, or add new entry
        if(existingEntry){
            distributionDetails = await prisma.specific_asset_distribution.update({
                where: {userid : userId},
                data: {
                    assets: assetData,
                    updatedat: new Date(),
                }
            });
        }
        else{
            distributionDetails = await prisma.specific_asset_distribution.create({
                data: {
                    userid: userId,
                    assets: assetData,
                    createdat: new Date(),
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
                userid: userId
            },
        });

        let residuaryDistributionDetails;

        //Update existing record if it exists, or add new entry
        if(existingEntry){
            residuaryDistributionDetails = await prisma.residuary_asset_distribution.update({
                where: {userid : userId},
                data: {
                    beneficiaries: beneficiaryData,
                    updatedat: new Date(),
                }
            });
        }
        else{
            residuaryDistributionDetails = await prisma.residuary_asset_distribution.create({
                data: {
                    userid: userId,
                    beneficiaries: beneficiaryData,
                    createdat: new Date(),
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
            where: { userid: userId },
            select: { distributiontype: true, residuarydistributiontype: true, fallbackrule: true },
        });

        if (!distribution) {
            return response.status(404).json({ error: "No distribution record found for the user." });
        }

        let distributionDetails;
        let residuaryDistributionDetails;

        //Get distribution data from corresponding table based on the type of distribution
        switch (distribution.distributiontype) {
            case DistributionType.SINGLE:
                distributionDetails = await prisma.single_beneficiary_distribution.findUnique({
                    where: { userid: userId },
                    select: {
                        primarybeneficiaryid: true,
                        secondarybeneficiaryid: true,
                        tertiarybeneficiaryid: true
                    },
                });
                break;
        
            case DistributionType.SPECIFIC:
                distributionDetails = await prisma.specific_asset_distribution.findUnique({
                    where: { userid: userId },
                    select: { assets: true },
                });
                break;
        
            case DistributionType.PERCENTAGE:
                distributionDetails = await prisma.percentage_distribution.findUnique({
                    where: { userid: userId },
                    select: { beneficiaries: true },
                });
                break;
        
            default:
                throw new Error("Invalid distribution type");
        }
        

        residuaryDistributionDetails = await prisma.residuary_asset_distribution.findUnique({
            where: { userid: userId },
            select: {beneficiaries: true},
        });

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