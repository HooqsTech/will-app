import { JSONResponse, PersonalDetails } from '../models/userResponseModel';  // Import the User interface

// Create a new user
export const createUser = async (userData: PersonalDetails): Promise<PersonalDetails> => {
  const response = await fetch("http://localhost:5000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const user: PersonalDetails = await response.json(); // Map the response to the User interface
  return user;
};

// Upsert user (Create or Update based on phone number)
export const upsertUser = async (userData: PersonalDetails): Promise<PersonalDetails> => {
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

  const user: PersonalDetails = await response.json(); // Map the response to the User interface
  return user;
};


export const deleteUserByPhone = async (phoneNumber: string): Promise<void> => {
  const response = await fetch(`http://localhost:5000/api/users/${phoneNumber}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};

export const getUserDetailsByPhone = async (phoneNumber: string): Promise<any> => {
    const response = await fetch(`http://localhost:5000/api/users/${phoneNumber}`, {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }
  
    const userDetails: JSONResponse = await response.json();
    return userDetails;
};

