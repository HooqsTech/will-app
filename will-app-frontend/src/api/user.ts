import { IUserDetails } from "../models/user";

export const createUser = async (userData: IUserDetails): Promise<IUserDetails> => {
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
  
    const user: IUserDetails = await response.json(); // Map the response to the User interface
    return user;
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