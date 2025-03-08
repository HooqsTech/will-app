import { IAddressDetails, IPersonalDetails, IUserDetails } from "../models/user";

export const addPersonalDetailsAsync = async (personalDetails: IPersonalDetails, userId: string): Promise<IPersonalDetails> => {
  const response = await fetch(`http://localhost:5000/api/users/createPersonalDetails/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(personalDetails),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const result: IPersonalDetails = await response.json();
  return result;
};

export const addAddressDetailsAsync = async (personalDetails: IAddressDetails, userId: string): Promise<IAddressDetails> => {
  const response = await fetch(`http://localhost:5000/api/users/createAddressDetails/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(personalDetails),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const result: IAddressDetails = await response.json();
  return result;
};

export const upsertUser = async (userData: IUserDetails): Promise<IUserDetails> => {
  const response = await fetch("http://localhost:5000/api/users/upsert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to upsert user");
  }

  const user: IUserDetails = await response.json(); // Map the response to the User interface
  return user;
};

export const getUser = async (phoneNumber: string): Promise<IUserDetails> => {
  const response = await fetch(`http://localhost:5000/api/users/GetbyPhoneNumber?phoneNumber=${phoneNumber}`, {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error("Failed to upsert user");
  }

  const user: IUserDetails = await response.json();
  return user;
};

export const verifyToken = async(idToken:any): Promise<IUserDetails> => {
  const response = await fetch(`http://localhost:5000/api/users/verifyToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken: idToken
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to upsert user");
  }

  const user: IUserDetails = await response.json();
  return user;
};
