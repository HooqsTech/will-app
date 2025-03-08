import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkUserExists = async (userId: string) => {
    return await prisma.users.findUnique({
        where: { userid: userId },
    });
};

export const upsertSelectedAssets = async (userId: string, assetData: any) => {
    return await prisma.selectedassets.upsert({
        where: { userid: userId },
        update: {
            data: assetData,
            updatedat: new Date(),
        },
        create: {
            userid: userId,
            data: assetData,
            createdat: new Date(),
            updatedat: new Date(),
        },
    });
};

export const getAssetsByUserId = async (userId: string) => {
    return await prisma.assets.findMany({
        where: { userid: userId },
    });
};

export const upsertAsset = async (id: string | null, userId: string, type: string, subtype: string, data: any) => {
    if (id) {
        const existingAsset = await prisma.assets.findUnique({ where: { id } });
        if (existingAsset) {
            return await prisma.assets.update({
                where: { id: existingAsset.id },
                data: { data, updatedat: new Date() },
            });
        }
    }
    return await prisma.assets.create({
        data: { userid: userId, type, subtype, data, createdat: new Date(), updatedat: new Date() },
    });
};

export const deleteAssetsByUserId = async (userId: string) => {
    return await prisma.assets.deleteMany({
        where: { userid: userId },
    });
};

export const deleteAssetById = async (assetId: string) => {
    return await prisma.assets.delete({
        where: { id: assetId },
    });
};
