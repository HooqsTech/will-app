import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User, ExcludedPerson, Pet, Beneficiary, Liability, Asset } from '../models/formatUserModel';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    try {
        const {
            fullName,
            fatherName,
            phoneNumber,
            userName,
            password,
            gender,
            dob,
            religion,
            aadhaarNumber,
            addressDetails,
        } = req.body;

        // Check if the phone number already exists
        const existingUser = await prisma.users.findUnique({
            where: { phonenumber: phoneNumber },
        });

        if (existingUser) {
            return res.status(400).json({ error: "Phone number already exists" });
        }

        // Create the user if phone number is not already in use
        const user = await prisma.users.create({
            data: {
                fullname: fullName,
                fathername: fatherName,
                phonenumber: phoneNumber,
                username: userName,
                password,
                gender,
                dob: dob ? new Date(dob) : null,
                religion,
                aadhaarnumber: aadhaarNumber,
                addressdetails: addressDetails,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// export const upsertUser = async (req: Request, res: Response) => {
//     try {
//         const {
//             full_name,
//             father_name,
//             phone_number,
//             user_name,
//             password,
//             gender,
//             dob,
//             religion,
//             aadhaar_number,
//             addressdetails
//         } = req.body;

//         const user = await prisma.users.upsert({
//             where: { phonenumber: phone_number },
//             update: {
//                 fullname: full_name,
//                 fathername: father_name,
//                 username: user_name,
//                 password,
//                 gender,
//                 dob: dob ? new Date(dob) : null,
//                 religion,
//                 aadhaarnumber: aadhaar_number,
//                 addressdetails, 
//             },
//             create: {
//                 fullname: full_name,
//                 fathername: father_name,
//                 phonenumber: phone_number,
//                 username: user_name,
//                 password,
//                 gender,
//                 dob: dob ? new Date(dob) : null,
//                 religion,
//                 aadhaarnumber: aadhaar_number,
//                 addressdetails,
//             },
//         });

//         res.status(200).json(user);
//     } catch (error) {
//         console.error("Error upserting user:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

export const upsertUser = async (req: Request, res: Response) => {
    try {
        const {
            fullName,
            fatherName,
            phoneNumber,
            userName,
            password,
            gender,
            dob,
            religion,
            aadhaarNumber,
            addressDetails,
        } = req.body;

        const user = await prisma.users.upsert({
            where: { phonenumber: phoneNumber },
            update: {
                fullname: fullName,
                fathername: fatherName,
                username: userName,
                password,
                gender,
                dob: dob ? new Date(dob) : null,
                religion,
                aadhaarnumber: aadhaarNumber,
                addressdetails: addressDetails,
            },
            create: {
                fullname: fullName,
                fathername: fatherName,
                phonenumber: phoneNumber,
                username: userName,
                password,
                gender,
                dob: dob ? new Date(dob) : null,
                religion,
                aadhaarnumber: aadhaarNumber,
                addressdetails: addressDetails,
            },
        });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error upserting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUserByPhone = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.params;  // Get phoneNumber from params

        // Validate if phoneNumber is provided
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        // Delete the user by phoneNumber
        const user = await prisma.users.delete({
            where: {
                phonenumber: phoneNumber,  // Make sure phoneNumber is provided correctly
            },
        });

        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserByPhone = async (req: Request, res: Response): Promise<void> => {
    try {
        const phoneNumber = req.params.phoneNumber;  // Updated to camelCase

        const user = await prisma.users.findUnique({
            where: { phonenumber: phoneNumber },  // Updated to camelCase
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserDetailsByPhone = async (req: Request, res: Response): Promise<void> => {
    try {
        const phoneNumber = req.params.phoneNumber;  // Updated to camelCase

        const user = await prisma.users.findUnique({
            where: { phonenumber: phoneNumber },  // Updated to camelCase
            include: {
                assets: true,
                beneficiaries: true,
                excludedpersons: true,
                liabilities: true,
                pets: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Format the response
        const formattedResponse = formatUserResponse(user);

        res.status(200).json(formattedResponse);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const formatUserResponse = (user: User | any) => {
    console.log(user.liabilities); 
    return {
        personalDetails: {
            fullName: user.fullname,
            fatherName: user.fathername,
            gender: user.gender,
            dob: user.dob?.toISOString().split("T")[0], 
            religion: user.religion,
            aadhaarNumber: user.aadhaarnumber,
            username: user.username,
            phoneNumber: user.phonenumber,
        },
        addressDetails: user.addressdetails || {}, 
        assetsDetails: {
            immovableAssets: user.assets
                .filter((asset: Asset) => asset.type === "immovableAssets")
                .map((asset: Asset) => asset.data),
            financialAssets: {
                bankAccounts: user.assets
                    .filter((asset: Asset) => asset.type === "financialAssets" && asset.subtype === "bankAccounts")
                    .flatMap((asset: Asset) => asset.data),
                fixedDeposits: user.assets
                    .filter((asset: Asset) => asset.type === "financialAssets" && asset.subtype === "fixedDeposits")
                    .flatMap((asset: Asset) => asset.data),
                insurancePolicies: user.assets
                    .filter((asset: Asset) => asset.type === "financialAssets" && asset.subtype === "insurancePolicies")
                    .flatMap((asset: Asset) => asset.data),
                safeDepositBoxes: user.assets
                    .filter((asset: Asset) => asset.type === "financialAssets" && asset.subtype === "safeDepositBoxes")
                    .flatMap((asset: Asset) => asset.data),
                dematAccounts: user.assets
                    .filter((asset: Asset) => asset.type === "financialAssets" && asset.subtype === "dematAccounts")
                    .flatMap((asset: Asset) => asset.data),
                mutualFunds: user.assets
                    .filter((asset: Asset) => asset.type === "financialAssets" && asset.subtype === "mutualFunds")
                    .flatMap((asset: Asset) => asset.data),
                providentFund: user.assets
                    .filter((asset: Asset) => asset.type === "financialAssets" && asset.subtype === "providentFund")
                    .flatMap((asset: Asset) => asset.data),
                pensionAccounts: user.assets
                    .filter((asset: Asset) => asset.type === "financialAssets" && asset.subtype === "pensionAccounts")
                    .flatMap((asset: Asset) => asset.data),
            },
            businessAssets: {
                business: user.assets
                    .filter((asset: Asset) => asset.type === "businessAssets" && asset.subtype === "business")
                    .flatMap((asset: Asset) => asset.data),
                bonds: user.assets
                    .filter((asset: Asset) => asset.type === "businessAssets" && asset.subtype === "bonds")
                    .flatMap((asset: Asset) => asset.data),
                debentures: user.assets
                    .filter((asset: Asset) => asset.type === "businessAssets" && asset.subtype === "debentures")
                    .flatMap((asset: Asset) => asset.data),
                esops: user.assets
                    .filter((asset: Asset) => asset.type === "businessAssets" && asset.subtype === "esops")
                    .flatMap((asset: Asset) => asset.data),
                proprietorship: user.assets
                    .filter((asset: Asset) => asset.type === "businessAssets" && asset.subtype === "proprietorship")
                    .flatMap((asset: Asset) => asset.data),
            },
            otherInvestments: {
                vehicles: user.assets
                    .filter((asset: Asset) => asset.type === "otherInvestments" && asset.subtype === "vehicles")
                    .flatMap((asset: Asset) => asset.data),
                jewelry: user.assets
                    .filter((asset: Asset) => asset.type === "otherInvestments" && asset.subtype === "jewelry")
                    .flatMap((asset: Asset) => asset.data),
                digitalAssets: user.assets
                    .filter((asset: Asset) => asset.type === "otherInvestments" && asset.subtype === "digitalAssets")
                    .flatMap((asset: Asset) => asset.data),
                intellectualProperty: user.assets
                    .filter((asset: Asset) => asset.type === "otherInvestments" && asset.subtype === "intellectualProperty")
                    .flatMap((asset: Asset) => asset.data),
                customAssets: user.assets
                    .filter((asset: Asset) => asset.type === "otherInvestments" && asset.subtype === "customAssets")
                    .flatMap((asset: Asset) => asset.data),
            },
        },
        liabilities: {
            homeLoans: user.liabilities
                .filter((liability: Liability) => liability.type === "homeLoans")
                .map((liability: Liability) => liability.data),
            personalLoans: user.liabilities
                .filter((liability: Liability) => liability.type === "personalLoans")
                .map((liability: Liability) => liability.data),
            vehicleLoans: user.liabilities
                .filter((liability: Liability) => liability.type === "vehicleLoans")
                .map((liability: Liability) => liability.data),
            creditCardDebt: user.liabilities
                .filter((liability: Liability) => liability.type === "creditCardDebt")
                .map((liability: Liability) => liability.data),
        },
        beneficiaries: user.beneficiaries?.map((beneficiary: Beneficiary) => beneficiary.data) || [],
        excludedPeople: user.excludedpersons?.map((person: ExcludedPerson) => person.data) || [],
        pets: user.pets?.map((pet: Pet) => pet.data) || [],
    };
};