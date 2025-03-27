export interface IWillService {
    serviceId: string;
    serviceName: string;
    serviceStandardPrice: number;
    serviceDiscountPrice?: number | null;
  }

  export interface ICategory {
    categoryId: string;
    categoryName: string;
    categoryDescription: string;
    categoryStandardPrice: number;
    categoryDiscountPrice?: number| null;
  }
  
  export interface IServiceCategory {
    categoryId: string;
    categoryName: string;
    categoryDescription: string;
    categoryStandardPrice: number;
    categoryDiscountPrice?: number| null;
    services: IWillService[];
  }
  
  export interface IFormattedServiceCategory {
    categoryId: string;
    categoryName: string;
    categoryDescription: string;
    categoryStandardPrice: number;
    categoryDiscountPrice?: number | null;
    services: IWillService[];
  }

  
export interface ITransaction {
  id?: string;
  orderid: string;
  userid: string;
  selectedservices: IWillService[];
  selectedcategories: ICategory[];
  paymentid?: string;
  createdat?: string;
  updatedat?: string;
  totalprice: string;
}

export interface IPath {
  path: string;
}