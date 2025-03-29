import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertPDFVersioning = async (userId: string, folderPath: string) => {
    return await prisma.pdfversioning.upsert({
        where: { userid: userId },
        update: {
            folderpath: folderPath,
            latestversion: {
                increment: 1, // Increment the version by 1 on every update
            },
            updatedate: new Date(),
        },
        create: {
            userid: userId,
            folderpath: folderPath,
            latestversion: 1, // Default version for new records
            createdate: new Date(),
            updatedate: new Date(),
        },
    });
};

export const getPDFVersioningByUserId = async (userId: string) => {
    return await prisma.pdfversioning.findUnique({
        where: { userid: userId },
    });
};