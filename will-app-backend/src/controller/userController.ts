import { Request, Response } from "express";
import { 
    createUser, 
    deleteUserByPhone, 
    createPersonalDetails, 
    deletePersonalDetails, 
    createAddressDetails, 
    deleteAddressDetails, 
    getUserDetailsByPhone ,
    checkUserExists
} from "../services/userServices";
import admin from "firebase-admin";

// Create a new user
export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        const userExists = await checkUserExists(phoneNumber);

        if (userExists) {
            const userDetails = await getUserDetailsByPhone(phoneNumber);
            return res.status(200).json({ user: userDetails });
        }

        await createUser(phoneNumber);
        const newUserDetails = await getUserDetailsByPhone(phoneNumber);

        res.status(201).json( {user: newUserDetails});
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a user by phone number
export const deleteUserByPhoneHandler = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.params;
        const user = await deleteUserByPhone(phoneNumber);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Create personal details for a user
export const createPersonalDetailsHandler = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const details = req.body;
        const result = await createPersonalDetails(userId, details);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete personal details of a user
export const deletePersonalDetailsHandler = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await deletePersonalDetails(userId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Create address details for a user
export const createAddressDetailsHandler = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const address = req.body;
        const result = await createAddressDetails(userId, address);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete address details of a user
export const deleteAddressDetailsHandler = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await deleteAddressDetails(userId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get user details by phone number
export const getUserDetailsByPhoneHandler = async (req: Request, res: Response) => {
    try {
        const phoneNumber = req.query.phoneNumber as string;
        const user = await getUserDetailsByPhone(phoneNumber);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

// Verify OTP Token and get User Details
export const verifyTokenAndInsertPhoneNumber = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: "ID Token is required" });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const phoneNumber = decodedToken.phone_number;

        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number not found in token" });
        }

        const userExists = await checkUserExists(phoneNumber);

        if (userExists) {
            const userDetails = await getUserDetailsByPhone(phoneNumber);
            return res.status(200).json({ user: userDetails });
        }

        await createUser(phoneNumber);
        const newUserDetails = await getUserDetailsByPhone(phoneNumber);

        return res.status(201).json({ user: newUserDetails });
    } catch (error: any) {
        let errorMessage = "Invalid token";

        if (error.code === "auth/id-token-expired") {
            errorMessage = "ID token expired";
        } else if (error.code === "auth/invalid-id-token") {
            errorMessage = "Invalid ID token";
        }

        console.error("Error verifying token:", error);
        return res.status(401).json({ error: errorMessage });
    }
};