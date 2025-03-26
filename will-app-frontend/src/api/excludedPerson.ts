import { IExcludedPerson, IExcludedPersonDeleteRequest } from "../models/excludedPerson";

export const upsertExcludedPerson = async (data: IExcludedPerson): Promise<IExcludedPerson> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/excludedperson/upsert`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to upsert excluded person");
    }

    const person: IExcludedPerson = await response.json();
    return person;
};

export const deleteExcludedPerson = async (data: IExcludedPersonDeleteRequest): Promise<boolean> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/excludedperson/deleteById`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to delete excluded person");
    }

    return true;
};