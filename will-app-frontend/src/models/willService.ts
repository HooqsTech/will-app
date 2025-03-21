export interface IWillService {
    serviceId: string;
    serviceName: string;
    serviceStandardPrice: number;
    serviceDiscountPrice?: number | null;
  }
  
  export interface IServiceCategory {
    categoryId: string;
    categoryName: string;
    categoryDescription: string;
    categoryStandardPrice: number;
    categoryDiscountPrice: number;
    services: IWillService[];
  }
  
  export interface IFormattedServiceCategory {
    categoryId: string;
    categoryName: string;
    categoryDescription: string;
    categoryStandardPrice: number;
    categoryDiscountPrice: number | null;
    services: IWillService[];
  }