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
exports.deleteAddressDetails = exports.getAddressDetails = exports.upsertAddressDetails = void 0;
const parseAddressData = (data) => {
    if (typeof data === 'string') {
        return JSON.parse(data);
    }
    return data; // Already in the correct format
};
// Upsert address details (Create or Update based on id)
const upsertAddressDetails = (addressData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("http://localhost:5000/api/address/upsert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.assign(Object.assign({}, addressData), { data: JSON.stringify(addressData.data) })),
    });
    if (!response.ok) {
        throw new Error("Failed to upsert address details");
    }
    const updatedAddress = yield response.json();
    return updatedAddress;
});
exports.upsertAddressDetails = upsertAddressDetails;
// Get address details by user_id
const getAddressDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`http://localhost:5000/api/address/${userId}`, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch address details");
    }
    const address = yield response.json(); // Map the response to AddressDetails interface
    // Parse the 'data' field from string to AddressData object if it is a string
    address.forEach((addressDetail) => {
        addressDetail.data = parseAddressData(addressDetail.data);
    });
    return address;
});
exports.getAddressDetails = getAddressDetails;
// Delete address details by id
const deleteAddressDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`http://localhost:5000/api/address/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete address details");
    }
});
exports.deleteAddressDetails = deleteAddressDetails;
