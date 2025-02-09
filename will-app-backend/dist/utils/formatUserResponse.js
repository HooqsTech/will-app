"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUserResponse = void 0;
const formatUserResponse = (user) => {
    var _a;
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
                .filter((asset) => asset.type === "immovable_assets")
                .map((asset) => asset.data),
            financial_assets: {
                bank_accounts: user.assets
                    .filter((asset) => asset.type === "financial_assets" && asset.subtype === "bank_accounts")
                    .flatMap((asset) => asset.data),
                fixed_deposits: user.assets
                    .filter((asset) => asset.type === "financial_assets" && asset.subtype === "fixed_deposits")
                    .flatMap((asset) => asset.data),
                insurance_policies: user.assets
                    .filter((asset) => asset.type === "financial_assets" && asset.subtype === "insurance_policies")
                    .flatMap((asset) => asset.data),
                safe_deposit_boxes: user.assets
                    .filter((asset) => asset.type === "financial_assets" && asset.subtype === "safe_deposit_boxes")
                    .flatMap((asset) => asset.data),
                demat_accounts: user.assets
                    .filter((asset) => asset.type === "financial_assets" && asset.subtype === "demat_accounts")
                    .flatMap((asset) => asset.data),
                mutual_funds: user.assets
                    .filter((asset) => asset.type === "financial_assets" && asset.subtype === "mutual_funds")
                    .flatMap((asset) => asset.data),
                provident_fund: user.assets
                    .filter((asset) => asset.type === "financial_assets" && asset.subtype === "provident_fund")
                    .flatMap((asset) => asset.data),
                pension_accounts: user.assets
                    .filter((asset) => asset.type === "financial_assets" && asset.subtype === "pension_accounts")
                    .flatMap((asset) => asset.data),
            },
            business: user.assets
                .filter((asset) => asset.type === "business")
                .map((asset) => asset.data),
            bonds: user.assets
                .filter((asset) => asset.type === "bonds")
                .map((asset) => asset.data),
            debentures: user.assets
                .filter((asset) => asset.type === "debentures")
                .map((asset) => asset.data),
            esops: user.assets
                .filter((asset) => asset.type === "esops")
                .map((asset) => asset.data),
            other_investments: user.assets
                .filter((asset) => asset.type === "other_investments")
                .map((asset) => asset.data),
            vehicles: user.assets
                .filter((asset) => asset.type === "vehicles")
                .map((asset) => asset.data),
            jewelry: user.assets
                .filter((asset) => asset.type === "jewelry")
                .map((asset) => asset.data),
            digital_assets: user.assets
                .filter((asset) => asset.type === "digital_assets")
                .map((asset) => asset.data),
            intellectual_property: user.assets
                .filter((asset) => asset.type === "intellectual_property")
                .map((asset) => asset.data),
            custom_assets: user.assets
                .filter((asset) => asset.type === "custom_assets")
                .map((asset) => asset.data),
        },
        liabilities: {
            home_loans: user.liabilities
                .filter((liability) => liability.type === "home_loans")
                .map((liability) => liability.data),
            personal_loans: user.liabilities
                .filter((liability) => liability.type === "personal_loans")
                .map((liability) => liability.data),
            vehicle_loans: user.liabilities
                .filter((liability) => liability.type === "vehicle_loans")
                .map((liability) => liability.data),
            education_loans: user.liabilities
                .filter((liability) => liability.type === "education_loans")
                .map((liability) => liability.data),
            other_liabilities: user.liabilities
                .filter((liability) => liability.type === "other_liabilities")
                .map((liability) => liability.data),
        },
        beneficiaries: {
            married: ((_a = user.beneficiaries.find((b) => b.type === "spouse")) === null || _a === void 0 ? void 0 : _a.data) || null,
            children: user.beneficiaries
                .filter((b) => b.type === "children")
                .map((b) => b.data),
            additional_beneficiaries: user.beneficiaries
                .filter((b) => b.type === "additional_beneficiaries")
                .map((b) => b.data),
        },
        pets: {
            has_pets: user.pets.length > 0,
            pet_details: user.pets.map((pet) => pet.data),
        },
        excluded_persons: user.excluded_persons.map((excluded) => ({
            full_name: excluded.full_name,
            relationship: excluded.relationship,
            reason: excluded.reason,
        })),
    };
};
exports.formatUserResponse = formatUserResponse;
