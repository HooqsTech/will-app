import { IPersonalDetails } from "../models/user";

export const createUser = async (userData: IPersonalDetails): Promise<IPersonalDetails> => {
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
  
    const user: IPersonalDetails = await response.json(); // Map the response to the User interface
    return user;
  };
