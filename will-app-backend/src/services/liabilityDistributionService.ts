import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';


const prisma = new PrismaClient();


export const getLiabilityDistributionService = async (userId: string) => {
    const distribution = await prisma.liabilitydistribution.findUnique({
      where: { userid: userId }
    });
  
    return distribution || null;
  }

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
  