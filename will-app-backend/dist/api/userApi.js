"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetsByUserId = exports.deleteUserByPhone = exports.upsertUser = exports.createUser = void 0;
// Create a new user
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error("Failed to create user");
    }
    const user = yield response.json(); // Map the response to the User interface
    return user;
});
exports.createUser = createUser;
// Upsert user (Create or Update based on phone number)
const upsertUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("http://localhost:5000/api/users/upsert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error("Failed to upsert user");
    }
    const user = yield response.json(); // Map the response to the User interface
    return user;
});
exports.upsertUser = upsertUser;
// Delete user by phone number
const deleteUserByPhone = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`http://localhost:5000/api/users/${phoneNumber}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete user");
    }
});
exports.deleteUserByPhone = deleteUserByPhone;
// Get assets by user_id
const getAssetsByUserId = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`http://localhost:5000/api/assets/user/${user_id}`, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch assets by user_id");
    }
    const assets = yield response.json(); // Map the response to an array of Asset interfaces
    // Iterate over each asset and deserialize the data field based on the type
    const assetsWithDeserializedData = assets.map((asset) => {
        if (asset.type === "Immovable Asset") {
            asset.data = deserializeImmovableAssetData(asset.data);
        }
        else if (asset.type === "Financial Asset") {
            asset.data = deserializeFinancialAssetData(asset.data);
        }
        else if (asset.type === "Vehicle") {
            asset.data = deserializeVehicleData(asset.data);
        }
        else if (asset.type === "Business") {
            asset.data = deserializeBusinessData(asset.data);
        }
        // Add more checks for other asset types as needed
        return asset;
    });
    return assetsWithDeserializedData;
});
exports.getAssetsByUserId = getAssetsByUserId;
// Helper functions to deserialize data based on asset type
const deserializeImmovableAssetData = (data) => {
    return {
        property_type: data.property_type,
        ownership_type: data.ownership_type,
        address: data.address,
        pincode: data.pincode,
        city: data.city,
    };
};
const deserializeFinancialAssetData = (data) => {
    return {
        bank_accounts: data.bank_accounts,
        fixed_deposits: data.fixed_deposits,
        insurance_policies: data.insurance_policies,
        safe_deposit_boxes: data.safe_deposit_boxes,
        demat_accounts: data.demat_accounts,
        mutual_funds: data.mutual_funds,
        provident_fund: data.provident_fund,
        pension_accounts: data.pension_accounts,
    };
};
const deserializeVehicleData = (data) => {
    return {
        brand_model: data.brand_model,
        registration_number: data.registration_number,
    };
};
const deserializeBusinessData = (data) => {
    return {
        business_name: data.business_name,
        business_type: data.business_type,
        registration_number: data.registration_number,
        industry: data.industry,
        location: data.location,
        employees_count: data.employees_count,
        annual_revenue: data.annual_revenue,
    };
};
