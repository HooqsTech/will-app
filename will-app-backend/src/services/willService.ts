import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Get all services grouped by categories
export const getAllWillServices = async () => {
    const categories = await prisma.service_categories.findMany({
        include: {
            services: true, // Fetch related services under each category
        },
    });

    return categories.map(category => ({
        categoryId: category.id,
        categoryName: category.categoryname,
        categoryDescription: category.description, // New column
        categoryStandardPrice: category.standardprice,
        categoryDiscountPrice: category.discountedprice,
        services: category.services.map(service => ({
            serviceId: service.id,
            serviceName: service.servicename,
            serviceStandardPrice: service.standardprice,
            serviceDiscountPrice: service.discountedprice
        }))
    }));
};

// Get a specific service by ID, including category details
export const getWillServiceById = async (id: string) => {
    return await prisma.services.findUnique({
        where: { id },
        include: {
            service_categories: true, // Include the related category details
        },
    });
};

// Upsert (Insert or Update) a Will Service
export const upsertWillService = async (
    id: string | null,
    categoryId: string,
    serviceName: string,
    standardPrice: number,
    discountedPrice: number | null
) => {
    const serviceId = id ?? uuidv4();

    try {
        const upsertedService = await prisma.services.upsert({
            where: { id: serviceId },
            update: {
                servicename: serviceName,
                categoryid: categoryId,
                standardprice: standardPrice,
                discountedprice: discountedPrice
            },
            create: {
                id: serviceId,
                servicename: serviceName,
                categoryid: categoryId,
                standardprice: standardPrice,
                discountedprice: discountedPrice
            },
        });

        return upsertedService;
    } catch (error) {
        console.error("Error upserting Will Service:", error);
        throw error;
    }
};

// Upsert (Insert or Update) a Service Category
export const upsertServiceCategory = async (
    id: string | null,
    categoryName: string,
    description: string, // New column
    standardPrice: number,
    discountedPrice: number | null
) => {
    const categoryId = id ?? uuidv4();

    try {
        const upsertedCategory = await prisma.service_categories.upsert({
            where: { id: categoryId },
            update: {
                categoryname: categoryName,
                description: description, // New column
                standardprice: standardPrice,
                discountedprice: discountedPrice
            },
            create: {
                id: categoryId,
                categoryname: categoryName,
                description: description, // New column
                standardprice: standardPrice,
                discountedprice: discountedPrice
            },
        });

        return upsertedCategory;
    } catch (error) {
        console.error("Error upserting Service Category:", error);
        throw error;
    }
};

// Delete a will service by ID
export const deleteWillServiceById = async (id: string) => {
    const existingService = await prisma.services.findUnique({
        where: { id },
    });

    if (!existingService) {
        throw new Error("Service not found");
    }

    await prisma.services.delete({
        where: { id },
    });

    return { serviceId: id, message: "Service deleted successfully" };
};

// Delete a service category by ID
export const deleteServiceCategoryById = async (id: string) => {
    const existingCategory = await prisma.service_categories.findUnique({
        where: { id },
    });

    if (!existingCategory) {
        throw new Error("Service category not found");
    }

    await prisma.service_categories.delete({
        where: { id },
    });

    return { categoryId: id, message: "Service category deleted successfully" };
};


export const calculateTotalPrice = async (
    categoryId: string | null, 
    serviceIds?: string[], 
    isNewTransaction?: boolean
  ) => {
      let categoryTotal = 0; // Initialize categoryTotal
  
      // Ensure categoryId is a string (avoid treating an array as an ID)
      if (Array.isArray(categoryId)) {
          categoryId = categoryId[0];
      }
  
      // If categoryId is not null, fetch the category price
      if (categoryId) {
          const category = await prisma.service_categories.findUnique({
              where: { id: categoryId },
              select: { discountedprice: true, standardprice: true },
          });
  
          const categoryPrice = category?.discountedprice?.toNumber() ?? category?.standardprice?.toNumber() ?? 0;
          categoryTotal = isNewTransaction ? categoryPrice : 0;
      }
      
      if (!serviceIds || serviceIds.length === 0) {
          return categoryTotal;
      }
  
      // Fetch all service prices
      const services = await prisma.services.findMany({
          where: {
              id: { in: serviceIds },
          },
          select: {
              discountedprice: true,
          },
      });
  
      if (!services.length) {
          return categoryTotal;
      }
  
      // Convert Decimal to number and sum up the discounted prices of services
      const totalServicePrice = services.reduce((sum, service) => sum + (service.discountedprice?.toNumber() ?? 0), 0);
  
      // Calculate final total price (service total + category discount)
      const totalPrice = totalServicePrice + categoryTotal;
  
      return totalPrice;
  };