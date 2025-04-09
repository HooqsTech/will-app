import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const upsertPDFVersioning = async (userId: string, folderPath: string, downloadurl: string) => {
    const existingVersion = await prisma.pdfversioning.findFirst({
        where: { userid: userId },
        orderBy: { latestversion: 'desc' },
    });

    const nextVersion = existingVersion ? existingVersion.latestversion + 1 : 1;

    return await prisma.pdfversioning.create({
        data: {
            versionid: uuidv4(),
            userid: userId,
            folderpath: folderPath,
            latestversion: nextVersion,
            downloadurl: downloadurl,
            createdate: new Date(),
            updatedate: new Date(),
        },
    });
};

export const getPDFVersioningByUserId = async (userId: string) => {
    return await prisma.pdfversioning.findFirst({
      where: { userid: userId },
      orderBy: {
        createdate: 'desc',
      },
    });
  };

export const getAllPDFVersioningByUserId = async (userId: string) => {
    return await prisma.pdfversioning.findMany({
        where: { userid: userId },
    });
};

export const getPDFVersioningByUserIdAndVersionId = async (userId: string, versionId: string) => {
    return await prisma.pdfversioning.findFirst({
        where: {
            userid: userId,
            versionid: versionId,
        },
    });
};