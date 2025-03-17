import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { DistributionType } from '../models/enums';
import { UUID } from 'crypto';

const prisma = new PrismaClient();


//Get distribution type for user
export const getUserDistributionTypeService = async (userId: string): Promise<string | null> => {
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

export const getWillDistributionByUserIdService = async (userId: string) => {
    return await prisma.will_distribution.findUnique({
      where: { userid: userId }
    });
  };

  export const deleteSingleBeneficiaryDistributionService = async (userId: string) => {
    return await prisma.single_beneficiary_distribution.deleteMany({
      where: { userid: userId }
    });
  };
  
  export const deleteSpecificAssetDistributionService = async (userId: string) => {
    return await prisma.specific_asset_distribution.deleteMany({
      where: { userid: userId }
    });
  };
  
  export const deletePercentageDistributionService = async (userId: string) => {
    return await prisma.percentage_distribution.deleteMany({
      where: { userid: userId }
    });
  };
  
  export const deleteResiduaryAssetDistributionService = async (userId: string) => {
    return await prisma.residuary_asset_distribution.deleteMany({
      where: { userid: userId }
    });
  };

export const updateWillDistributionService = async (
    userId: string,
    distributionType: string,
    residuaryDistributionType: string | null,
    fallbackRule: string | null
) => {
    return prisma.will_distribution.update({
        where: { userid: userId },
        data: {
            distributiontype: distributionType,
            residuarydistributiontype: residuaryDistributionType,
            fallbackrule: fallbackRule,
            updatedat: new Date(),
        },
    });
};

export const createWillDistributionService = async (
    userId: string,
    distributionType: string,
    residuaryDistributionType: string | null,
    fallbackRule: string | null
) => {
    return prisma.will_distribution.create({
        data: {
            userid: userId,
            distributiontype: distributionType,
            residuarydistributiontype: residuaryDistributionType,
            fallbackrule: fallbackRule,
            createdat: new Date(),
        },
    });
};

export const getSingleBeneficiaryByUserIdService = async (userId: string) => {
    return prisma.single_beneficiary_distribution.findUnique({
        where: { userid: userId },
    });
};

export const updateSingleBeneficiaryService = async (
    userId: string,
    primaryBeneficiary: string,
    secondaryBeneficiary: string | null,
    tertiaryBeneficiary: string | null
) => {
    return prisma.single_beneficiary_distribution.update({
        where: { userid: userId },
        data: {
            primarybeneficiaryid: primaryBeneficiary,
            secondarybeneficiaryid: secondaryBeneficiary,
            tertiarybeneficiaryid: tertiaryBeneficiary,
            updatedat: new Date(),
        },
    });
};

export const createSingleBeneficiaryService = async (
    userId: string,
    primaryBeneficiary: string,
    secondaryBeneficiary: string | null,
    tertiaryBeneficiary: string | null
) => {
    return prisma.single_beneficiary_distribution.create({
        data: {
            userid: userId,
            primarybeneficiaryid: primaryBeneficiary,
            secondarybeneficiaryid: secondaryBeneficiary,
            tertiarybeneficiaryid: tertiaryBeneficiary,
            createdat: new Date(),
        },
    });
};

export const getPercentageAssetDistributionService = async (userId: string) => {
    return prisma.percentage_distribution.findFirst({
        where: { userid: userId },
    });
};

// ✅ Update Percentage Asset Distribution
export const updatePercentageAssetDistributionService = async (userId: string, beneficiaryData: any) => {
    return prisma.percentage_distribution.update({
        where: { userid: userId },
        data: {
            beneficiaries: beneficiaryData,
            updatedat: new Date(),
        },
    });
};

// ✅ Create Percentage Asset Distribution
export const createPercentageAssetDistributionService = async (userId: string, beneficiaryData: any) => {
    return prisma.percentage_distribution.create({
        data: {
            userid: userId,
            beneficiaries: beneficiaryData,
            createdat: new Date(),
        },
    });
};

// ✅ Get Specific Asset Distribution by User ID
export const getSpecificAssetDistributionService = async (userId: string) => {
    return prisma.specific_asset_distribution.findFirst({
        where: { userid: userId },
    });
};

// ✅ Update Specific Asset Distribution
export const updateSpecificAssetDistributionService = async (userId: string, assetData: any) => {
    return prisma.specific_asset_distribution.update({
        where: { userid: userId },
        data: {
            assets: assetData,
            updatedat: new Date(),
        },
    });
};

// ✅ Create Specific Asset Distribution
export const createSpecificAssetDistributionService = async (userId: string, assetData: any) => {
    return prisma.specific_asset_distribution.create({
        data: {
            userid: userId,
            assets: assetData,
            createdat: new Date(),
        },
    });
};

// ✅ Get Residuary Asset Distribution by User ID
export const getResiduaryAssetDistributionService = async (userId: string) => {
    return prisma.residuary_asset_distribution.findFirst({
        where: { userid: userId },
    });
};

// ✅ Update Residuary Asset Distribution
export const updateResiduaryAssetDistributionService = async (userId: string, beneficiaryData: any) => {
    return prisma.residuary_asset_distribution.update({
        where: { userid: userId },
        data: {
            beneficiaries: beneficiaryData,
            updatedat: new Date(),
        },
    });
};

// ✅ Create Residuary Asset Distribution
export const createResiduaryAssetDistributionService = async (userId: string, beneficiaryData: any) => {
    return prisma.residuary_asset_distribution.create({
        data: {
            userid: userId,
            beneficiaries: beneficiaryData,
            createdat: new Date(),
        },
    });
};



