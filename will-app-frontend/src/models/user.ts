import { IAssetSelectionState } from "../atoms/AssetDistributionSpecificState";
import { ISelectedAssets } from "./asset";

export interface IPersonalDetails {
  firstName: string,
  lastName: string,
  fatherName: string,
  userName: string,
  password: string,
  gender: string,
  dob: string,
  religion: string,
  aadhaarNumber: string,
  title: string
}

export interface IUserDetails {
  userId: string,
  role: string,
  personalDetails: IPersonalDetails,
  addressDetails: IAddressDetails,
  selectedAssets: ISelectedAssets,
  beneficiaries: IBeneficiaryDetails[],
  executors: IExecutorDetails[],
  assets: IAssetDetails[],
  excludedPersons: IExcludedPersonDetails[],
  will_distribution: IWillDistributionDetails,
  specific_asset_distribution: IAssetSelectionState[],
  single_beneficiary_distribution: IsingleAssetDistributionDetail,
  percentage_distribution: IAssetDistributionPercentDetail,
  residuary_asset_distribution: IResiduaryDistributionDetail[],
  liabilitydistribution: IAssetSelectionState[]
}

export interface IResiduaryDistributionDetail {
  id: string,
  percentage: number
}
export interface IAssetDistributionPercentDetail {
  firstBeneficiary: string[];
  backupBeneficiary: string[];
  additionalInputs: Record<string, string>;
}

export interface IsingleAssetDistributionDetail {

  primarybeneficiaryid: string,
  secondarybeneficiaryid: string,
  tertiarybeneficiaryid: string,
}

export interface IWillDistributionDetails {
  id: string,
  distributiontype: "Single" | "Specific" | "Percentage";
  residuarydistributiontype?: string;
  fallbackrule?: string;
}

export interface IBeneficiaryDetails {
  id: string,
  type: string,
  data: any
}

export interface IExecutorDetails {
  id: string,
  type: string,
  data: any
}

export interface IExcludedPersonDetails {
  id: string,
  type: string,
  data: any
}

export interface IAssetDetails {
  id: string,
  type: string,
  subtype: string,
  data: any
}

export interface IAddressDetails {
  address1: string,
  address2: string,
  pincode: string,
  city: string,
  state: string,
  phoneNumber: string,
  email: string,
  sameAsPresentAddress: boolean,
  permAddress1: string,
  permAddress2: string
  permPincode: string,
  permCity: string,
  permState: string,
  permPhoneNumber: string,
  permEmail: string
}


export interface IAdminUserData {
  userid: string;
  phonenumber: string;
  createdat: string;
  updatedat: string;
  role: string;
  personaldetails: {
    id: string;
    userid: string;
    details: {
      dob: string;
      title: string;
      gender: string;
      lastName: string;
      religion: string;
      firstName: string;
      fatherName: string;
      aadhaarNumber: string;
    };
    createdat: string;
    updatedat: string;
  };
  addressdetails: {
    id: string;
    userid: string;
    address: {
      city: string;
      email: string;
      state: string;
      pincode: string;
      address1: string;
      address2: string;
      permCity: string;
      permEmail: string;
      permState: string;
      permPincode: string;
      phoneNumber: string;
      permAddress1: string;
      permAddress2: string;
      permPhoneNumber: string;
      sameAsPresentAddress: boolean;
    };
    createdat: string;
    updatedat: string;
  };
  payment_transactions: Array<{
    id: string;
    orderid: string;
    userid: string;
    selectedservices: Array<{
      serviceId: string;
      serviceName: string;
      serviceDiscountPrice: number;
      serviceStandardPrice: number;
    }>;
    totalprice: string;
    selectedcategories: {
      categoryId: string;
      categoryName: string;
      categoryDescription: string;
      categoryDiscountPrice: number;
      categoryStandardPrice: number;
    };
    createdat: string;
    updatedat: string;
  }>;
  pdfversioning: any[]; // You can replace 'any' if you have a structure later
}
