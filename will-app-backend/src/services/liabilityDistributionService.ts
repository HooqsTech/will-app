import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { IAsset, ILiabilityDistribution } from 'models/distributionDetails';


const prisma = new PrismaClient();


  export const getLiabilityDistributionService = async (
    userId: string
): Promise<ILiabilityDistribution | null> => {
    const result = await prisma.liabilitydistribution.findFirst({
        where: { userid: userId },
    });

    if (!result) {
        return null;
    }

    // Parse assets from the result
    const assets: IAsset[] = Array.isArray(result.beneficiaries)
        ? result.beneficiaries.map((asset: any) => ({
              asset_id: asset.assetId,
              beneficiarieslist: Array.isArray(asset.beneficiarieslist)
                  ? asset.beneficiarieslist.map((beneficiary: any) => ({
                        percentage: beneficiary.percentage,
                        beneficiaryId: beneficiary.beneficiaryId,
                        beneficiaryName: beneficiary.beneficiaryName,
                    }))
                  : [],
          }))
        : [];

    // Construct the final object
    return {
        userid: result.userid,
        beneficiaries: assets,
        createdat: result.createdate || null,
        updatedat: result.updatedate || null,
    };
};

export const createLiabilityDistributionService = async (
    userId: string,
    beneficiaries: Prisma.InputJsonValue
  ): Promise<void> => {
    await prisma.liabilitydistribution.create({
      data: {
        userid: userId,
        beneficiaries,
        createdate: new Date(),
        updatedate: new Date(),
      },
    });
  };
  
  export const updateLiabilityDistributionService = async (
    userId: string,
    beneficiaries:  Prisma.InputJsonValue
  ): Promise<void> => {
    await prisma.liabilitydistribution.update({
      where: { userid: userId },
      data: {
        beneficiaries,
        updatedate: new Date(),
      },
    });
  };

  export const deleteLiabilityDistributionService = async (
    userId: string
  ): Promise<void> => {
    await prisma.liabilitydistribution.delete({
      where: { userid: userId },
    });
  };
  