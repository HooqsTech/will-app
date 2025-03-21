import { IWillService, IServiceCategory ,IFormattedServiceCategory} from "../models/willService";

const API_URL = import.meta.env.VITE_API_URL;

export const getWillServices = async (): Promise<IFormattedServiceCategory[]> => {
  console.log("Fetching all Will Services");

  const response = await fetch(`${API_URL}/api/willService`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch will services");
  }

  const categories: IFormattedServiceCategory[] = await response.json();
  console.log("Fetched Categories:", categories);

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

  console.log("Parsed Categories:", parsedCategories);
  return parsedCategories;
};

export const getWillService = async (serviceId: string): Promise<IWillService> => {
  console.log("Fetching Will Service with ID:", serviceId);

  const response = await fetch(`${API_URL}/api/willService/getById/${serviceId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch will service");
  }

  const service: IWillService = await response.json();
  console.log("Fetched Will Service:", service);
  return service;
};

export const upsertWillService = async (willServiceData: IWillService): Promise<IWillService> => {
  console.log("Upserting Will Service:", willServiceData);

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
  console.log("Upserted Will Service:", service);
  return service;
};

export const deleteWillService = async (serviceId: string): Promise<void> => {
  console.log("Deleting Will Service with ID:", serviceId);

  const response = await fetch(`${API_URL}/api/willService/${serviceId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete will service");
  }

  console.log("Deleted Will Service:", serviceId);
};

export const upsertServiceCategory = async (categoryData: IServiceCategory): Promise<IServiceCategory> => {
  console.log("Upserting Service Category:", categoryData);

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
  console.log("Upserted Service Category:", category);
  return category;
};

export const deleteServiceCategory = async (categoryId: string): Promise<void> => {
  console.log("Deleting Service Category with ID:", categoryId);

  const response = await fetch(`${API_URL}/api/serviceCategory/${categoryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete service category");
  }

  console.log("Deleted Service Category:", categoryId);
};