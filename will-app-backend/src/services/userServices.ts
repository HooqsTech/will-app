import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const checkUserExists = async (phoneNumber: string) => {
    const user = await prisma.users.findUnique({
        where: { phonenumber: phoneNumber },
    });

    return user ? true : false;
};

export const createUser = async (phoneNumber: string) => {
    const userId = uuidv4();

    await prisma.users.create({
        data: {
            userid: userId,
            phonenumber: phoneNumber,
            createdat: new Date(),
            updatedat: new Date(),
        },
    });

    return { userId };
};

export const deleteUserByPhone = async (phoneNumber: string) => {
    const existingUser = await prisma.users.findUnique({
        where: { phonenumber: phoneNumber },
    });

    if (!existingUser) {
        throw new Error("User not found");
    }

    await prisma.users.delete({
        where: { phonenumber: phoneNumber },
    });

    return { userId: existingUser.userid };
};

export const createPersonalDetails = async (userId: string, details: any) => {
    const existingUser = await prisma.users.findUnique({
        where: { userid: userId },
    });

    if (!existingUser) {
        throw new Error("User not found");
    }

    const personalDetails = await prisma.personaldetails.upsert({
        where: { userid: userId },
        update: {
            details,
            updatedat: new Date(),
        },
        create: {
            userid: userId,
            details,
            createdat: new Date(),
            updatedat: new Date(),
        },
    });

    return personalDetails.details;
};

export const deletePersonalDetails = async (userId: string) => {
    const existingDetails = await prisma.personaldetails.findUnique({
        where: { userid: userId },
    });

    if (!existingDetails) {
        throw new Error("Personal details not found");
    }

    const deletedDetails = await prisma.personaldetails.delete({
        where: { userid: userId },
    });

    return { personalDetailsId: deletedDetails.id };
};

export const createAddressDetails = async (userId: string, address: any) => {
    const existingUser = await prisma.users.findUnique({
        where: { userid: userId },
    });

    if (!existingUser) {
        throw new Error("User not found");
    }

    const addressDetails = await prisma.addressdetails.upsert({
        where: { userid: userId },
        update: {
            address,
            updatedat: new Date(),
        },
        create: {
            userid: userId,
            address,
            createdat: new Date(),
            updatedat: new Date(),
        },
    });

    return addressDetails.address;
};

export const deleteAddressDetails = async (userId: string) => {
    const existingDetails = await prisma.addressdetails.findUnique({
        where: { userid: userId },
    });

    if (!existingDetails) {
        throw new Error("Address details not found");
    }

    const deletedDetails = await prisma.addressdetails.delete({
        where: { userid: userId },
    });

    return { addressDetailsId: deletedDetails.id };
};

export const getUserDetailsByPhone = async (phoneNumber: string) => {
    const user = await prisma.users.findFirst({
        where: { phonenumber: "+" + phoneNumber.trim() },
        include: {
            addressdetails: true,
            assets: true,
            beneficiaries: true,
            excludedpersons: true,
            liabilities: true,
            personaldetails: true,
            pets: true,
            selectedassets: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return formatUserResponse(user);
};

const formatUserResponse = (user: any) => ({
    userId: user.userid,
    personalDetails: user.personaldetails?.details || {},
    addressDetails: user.addressdetails?.address || {},
    assets: user.assets?.map((asset: any) => ({
        id: asset.id,
        type: asset.type,
        subtype: asset.subtype,
        data: asset.data,
    })),
    beneficiaries: user.beneficiaries?.map((ben: any) => ({
        id: ben.id,
        type: ben.type,
        data: ben.data,
    })),
    excludedPersons: user.excludedpersons?.map((ex: any) => ex.data),
    liabilities: user.liabilities?.map((liability: any) => ({
        id: liability.id,
        type: liability.type,
        data: liability.data,
    })),
    pets: user.pets?.map((pet: any) => pet.data),
    selectedAssets: user.selectedassets?.data || {},
});
