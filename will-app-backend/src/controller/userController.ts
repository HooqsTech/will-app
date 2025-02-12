import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User, ExcludedPerson,  Pet, Beneficiary,Liability, Asset } from '../models/formatUserModel';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    try {
        const {
            full_name,
            father_name,
            phone_number,
            user_name,
            password,
            gender,
            dob,
            religion,
            aadhaar_number,
        } = req.body;

        const user = await prisma.users.create({
            data: {
                full_name,
                father_name,
                phone_number,
                user_name,
                password,
                gender,
                dob: dob ? new Date(dob) : null,
                religion,
                aadhaar_number,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const upsertUser = async (req: Request, res: Response) => {
    try {
        const {
            full_name,
            father_name,
            phone_number,
            user_name,
            password,
            gender,
            dob,
            religion,
            aadhaar_number,
        } = req.body;

        const user = await prisma.users.upsert({
            where: { phone_number },
            update: { full_name, father_name, user_name, password, gender, dob: dob ? new Date(dob) : null, religion, aadhaar_number },
            create: { full_name, father_name, phone_number, user_name, password, gender, dob: dob ? new Date(dob) : null, religion, aadhaar_number },
        });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error upserting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUserByPhone = async (req: Request, res: Response) => {
    try {
        const { phone_number } = req.params;

        await prisma.users.delete({ where: { phone_number }});

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserByPhone = async (req: Request, res: Response): Promise<void> => {
    try {
        const phoneNumber = req.params.phone_number;

        const user = await prisma.users.findUnique({
            where: { phone_number: phoneNumber },
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
        const phoneNumber = req.params.phone_number;

        const user = await prisma.users.findUnique({
            where: { phone_number: phoneNumber },
            include: {
                address_details: true,
                assets: true,
                beneficiaries: true,
                excluded_persons: true,
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
    return {
        personal_details: {
            full_name: user.full_name,
            father_name: user.father_name,
            gender: user.gender,
            dob: user.dob.toISOString().split("T")[0], // Convert to YYYY-MM-DD
            religion: user.religion,
            aadhaar_number: user.aadhaar_number,
            username: user.user_name,
            phone_number: user.phone_number,
        },
        address_details: user.address_details.length > 0 ? user.address_details[0].data : {},
        assets_details: {
            immovable_assets: user.assets
                .filter((asset: Asset) => asset.type === "immovable_assets")
                .map((asset: Asset) => asset.data),
            financial_assets: {
                bank_accounts: user.assets
                    .filter((asset: Asset) => asset.type === "financial_assets" && asset.subtype === "bank_accounts")
                    .flatMap((asset: Asset) => asset.data),
                fixed_deposits: user.assets
                    .filter((asset: Asset) => asset.type === "financial_assets" && asset.subtype === "fixed_deposits")
                    .flatMap((asset: Asset) => asset.data),
                insurance_policies: user.assets
                    .filter((asset: Asset) => asset.type === "financial_assets" && asset.subtype === "insurance_policies")
                    .flatMap((asset: Asset) => asset.data),
                safe_deposit_boxes: user.assets
                    .filter((asset: Asset) => asset.type === "financial_assets" && asset.subtype === "safe_deposit_boxes")
                    .flatMap((asset: Asset) => asset.data),
                demat_accounts: user.assets
                    .filter((asset: Asset) => asset.type === "financial_assets" && asset.subtype === "demat_accounts")
                    .flatMap((asset: Asset) => asset.data),
                mutual_funds: user.assets
                    .filter((asset: Asset) => asset.type === "financial_assets" && asset.subtype === "mutual_funds")
                    .flatMap((asset: Asset) => asset.data),
                provident_fund: user.assets
                    .filter((asset: Asset) => asset.type === "financial_assets" && asset.subtype === "provident_fund")
                    .flatMap((asset: Asset) => asset.data),
                pension_accounts: user.assets
                    .filter((asset: Asset) => asset.type === "financial_assets" && asset.subtype === "pension_accounts")
                    .flatMap((asset: Asset) => asset.data),
            },
            business_assets: {
                business: user.assets
                    .filter((asset: Asset) => asset.type === "business_assets" && asset.subtype === "business")
                    .flatMap((asset: Asset) => asset.data),
                bonds: user.assets
                    .filter((asset: Asset) =>  asset.type === "business_assets" && asset.subtype === "bonds")
                    .flatMap((asset: Asset) => asset.data),
                debentures: user.assets
                    .filter((asset: Asset) => asset.type === "business_assets" && asset.subtype === "debentures")
                    .flatMap((asset: Asset) => asset.data),
                esops: user.assets
                    .filter((asset: Asset) =>  asset.type === "business_assets" && asset.subtype === "esops")
                    .flatMap((asset: Asset) => asset.data),
            },
            other_investments: {
                vehicles: user.assets
                    .filter((asset: Asset) =>  asset.type === "other_investments" && asset.subtype === "vehicles")
                    .flatMap((asset: Asset) => asset.data),
                jewelry: user.assets
                    .filter((asset: Asset) =>  asset.type === "other_investments" && asset.subtype === "jewelry")
                    .flatMap((asset: Asset) => asset.data),
                digital_assets: user.assets
                    .filter((asset: Asset) =>  asset.type === "other_investments" && asset.subtype === "digital_assets")
                    .flatMap((asset: Asset) => asset.data),
                intellectual_property: user.assets
                    .filter((asset: Asset) =>  asset.type === "other_investments" && asset.subtype === "intellectual_property")
                    .flatMap((asset: Asset) => asset.data),
                custom_assets: user.assets
                    .filter((asset: Asset) =>  asset.type === "other_investments" && asset.subtype === "custom_assets")
                    .flatMap((asset: Asset) => asset.data),
            }
        },
        liabilities: {
            home_loans: user.liabilities
                .filter((liability: Liability) => liability.type === "home_loans")
                .map((liability: Liability) => liability.data),
            personal_loans: user.liabilities
                .filter((liability: Liability) => liability.type === "personal_loans")
                .map((liability: Liability) => liability.data),
            vehicle_loans: user.liabilities
                .filter((liability: Liability) => liability.type === "vehicle_loans")
                .map((liability: Liability) => liability.data),
            education_loans: user.liabilities
                .filter((liability: Liability) => liability.type === "education_loans")
                .map((liability: Liability) => liability.data),
            other_liabilities: user.liabilities
                .filter((liability: Liability) => liability.type === "other_liabilities")
                .map((liability: Liability) => liability.data),
        },
        beneficiaries: {
            married: user.beneficiaries.find((b: Beneficiary) => b.type === "spouse")?.data || null,
            children: user.beneficiaries
                .filter((b: Beneficiary) => b.type === "children")
                .map((b: Beneficiary) => b.data),
            additional_beneficiaries: user.beneficiaries
                .filter((b: Beneficiary) => b.type === "additional_beneficiaries")
                .map((b: Beneficiary) => b.data),
        },
        pets: {
            has_pets: user.pets.length > 0,
            pet_details: user.pets.map((pet: Pet) => pet.data),
        },
        excluded_persons: user.excluded_persons
            .map((item: { data: Array<{ id: string, reason: string, full_name: string, relationship: string }> }) => 
                item.data.map((excluded: { id: string,reason: string, full_name: string, relationship: string }) => ({
                    id: excluded.id,
                    reason: excluded.reason,
                    full_name: excluded.full_name,
                    relationship: excluded.relationship,
                }))
        ).flat(),
    };
};