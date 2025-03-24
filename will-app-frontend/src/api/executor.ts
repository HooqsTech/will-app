import { IExecutor, IExecutorDeleteRequest } from "../models/executor";

export const upsertExecutor = async (data: IExecutor): Promise<IExecutor> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/executor/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to upsert executor");
  }

  const asset: IExecutor = await response.json();
  return asset;
};

export const deleteExecutor = async (data: IExecutorDeleteRequest): Promise<boolean> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/executor/deleteById`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to delete executor");
  }

  return true;
};