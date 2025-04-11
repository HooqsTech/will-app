import { IWillService, IServiceCategory, IFormattedServiceCategory } from "../models/willService";

const API_URL = import.meta.env.VITE_API_URL;

export const getWillServices = async (): Promise<IFormattedServiceCategory[]> => {
  const response = await fetch(`${API_URL}/api/willService`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch will services");
  }

  const categories: IFormattedServiceCategory[] = await response.json();

  const parsedCategories = categories.map(category => ({
    ...category,
    categoryStandardPrice: Number(category.categoryStandardPrice),
    categoryDiscountPrice: category.categoryDiscountPrice ? Number(category.categoryDiscountPrice) : null,
    services: category.services.map(service => ({
      ...service,
      serviceStandardPrice: Number(service.serviceStandardPrice),
      serviceDiscountPrice: service.serviceDiscountPrice ? Number(service.serviceDiscountPrice) : null,
    })),
  }));
  return parsedCategories;
};

export const getWillService = async (serviceId: string): Promise<IWillService> => {
  const response = await fetch(`${API_URL}/api/willService/getById/${serviceId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch will service");
  }

  const service: IWillService = await response.json();
  return service;
};

export const upsertWillService = async (willServiceData: IWillService): Promise<IWillService> => {

  const response = await fetch(`${API_URL}/api/willService`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(willServiceData),
  });

  if (!response.ok) {
    throw new Error("Failed to upsert will service");
  }

  const service: IWillService = await response.json();
  return service;
};

export const deleteWillService = async (serviceId: string): Promise<void> => {

  const response = await fetch(`${API_URL}/api/willService/${serviceId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete will service");
  }

};

export const upsertServiceCategory = async (categoryData: IServiceCategory): Promise<IServiceCategory> => {

  const response = await fetch(`${API_URL}/api/serviceCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    throw new Error("Failed to upsert service category");
  }

  const category: IServiceCategory = await response.json();
  return category;
};

export const deleteServiceCategory = async (categoryId: string): Promise<void> => {

  const response = await fetch(`${API_URL}/api/serviceCategory/${categoryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete service category");
  }

};