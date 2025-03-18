export interface IAsset {
    id: string;
    type: string;
    subtype: AssetSubtype;
    data: any;
}

export type AssetSubtype =
    | "properties"
    | "bank_accounts"
    | "fixed_deposits"
    | "insurance_policies"
    | "safety_deposit_boxes"
    | "demat_accounts"
    | "mutual_funds"
    | "provident_funds"
    | "pension_accounts"
    | "businesses"
    | "bonds"
    | "debentures"
    | "esops"
    | "other_investments"
    | "vehicles"
    | "jewellery"
    | "digital_assets"
    | "intellectual_properties"
    | "custom_assets"
    | "home_loans"
    | "vehicle_loans"
    | "education_loans"
    | "personal_loans"
    | "other_liabilities";

// Asset Interfaces
export interface PropertyAsset {
    id: number;
    city: string;
    address: string;
    pincode: string;
    propertyType: string;
    ownershipType: string;
}

export interface BankAccountAsset {
    id: number;
    city: string;
    branch: string;
    bankName: string;
    accountType: string;
    accountNumber: string;
}

export interface FixedDepositAsset {
    id: number;
    city: string;
    branch: string;
    bankName: string;
    accountNumber: string;
    noOfHolders: number;
}

export interface InsurancePolicyAsset {
    id: number;
    type: string;
    policyNumber: string;
    insuranceProvider: string;
}

export interface SafeDepositBoxAsset {
    id: number;
    city: string;
    depositBoxType: string;
    branch: string;
    bankName: string;
}

export interface DematAccountAsset {
    id: number;
    brokerName: string;
    accountNumber: string;
}

export interface MutualFundAsset {
    id: number;
    fundName: string;
    noOfHolders: number;
}

export interface ProvidentFundAsset {
    id: number;
    city: string;
    type: string;
    branch: string;
    bankName: string;
    accountNumber: string;
}

export interface PensionAccountAsset {
    id: number;
    bankName: string;
    schemeName: string;
}

export interface BusinessAsset {
    id: number;
    type: string;
    address: string;
    companyName: string;
}

export interface BondAsset {
    id: number;
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export interface DebentureAsset {
    id: number;
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export interface ESOPAsset {
    id: number;
    companyName: string;
    vestedEsops: number;
    unitsGranted: number;
    unvestedEsops: number;
}

export interface VehicleAsset {
    id: number;
    type: string;
    brandOrModel: string;
    registrationNumber: string;
}

export interface JewelryAsset {
    id: number;
    type: string;
    description: string;
    weightInGrams: number;
}

export interface DigitalAsset {
    id: number;
    type: string;
    walletAddress: string;
}

export interface IntellectualPropertyAsset {
    id: number;
    type: string;
    description: string;
    identificationNumber: string;
}

export interface CustomAsset {
    id: number;
    description: string;
}

export interface OtherInvestmentAsset {
    id: number;
    type: string;
    certificateNumber: string;
    financialServiceProviderName: string;
}
// Liability Interfaces
export interface HomeLoanAsset {
    id: number;
    loanAmount: number;
    nameOfBank: string;
    accountNumber: string;
    remainingAmount: number;
}

export interface VehicleLoanAsset {
    id: number;
    loanAmount: number;
    nameOfBank: string;
    accountNumber: string;
    remainingAmount: number;
}

export interface EducationLoanAsset {
    id: number;
    loanAmount: number;
    nameOfBank: string;
    remainingAmount: number;
}

export interface PersonalLoanAsset {
    id: number;
    loanAmount: number;
    nameOfBank: string;
    accountNumber: string;
    remainingAmount: number;
}

export interface OtherLiabilityAsset {
    id: number;
    loanAmount: number;
    description: string;
    nameOfLender: string;
    accountNumber?: string;
    remainingAmount: number;
}

/**
 * Parses an array of assets from JSON data.
 */
export function parseAssets(assetsData: any[]): IAsset[] {
    return assetsData.map((asset: any) => ({
        id: asset.id,
        userId: asset.userId,
        type: asset.type,
        subtype: asset.subtype as AssetSubtype,
        data: parseAssetData(asset.subtype, asset.data)
    }));
}

/**
 * Parses asset data based on its subtype.
 */
function parseAssetData(subtype: string, data: any): any {
    switch (subtype) {
        case "properties": return data as PropertyAsset[];
        case "bankAccounts": return data as BankAccountAsset[];
        case "fixedDeposits": return data as FixedDepositAsset[];
        case "insurancePolicies": return data as InsurancePolicyAsset[];
        case "safetyDepositBoxes": return data as SafeDepositBoxAsset[];
        case "dematAccounts": return data as DematAccountAsset[];
        case "mutualFunds": return data as MutualFundAsset[];
        case "providentFunds": return data as ProvidentFundAsset[];
        case "pensionAccounts": return data as PensionAccountAsset[];
        case "businesses": return data as BusinessAsset[];
        case "bonds": return data as BondAsset[];
        case "debentures": return data as DebentureAsset[];
        case "esops": return data as ESOPAsset[];
        case "vehicles": return data as VehicleAsset[];
        case "jewellery": return data as JewelryAsset[];
        case "digitalAssets": return data as DigitalAsset[];
        case "intellectualProperties": return data as IntellectualPropertyAsset[];
        case "customAssets": return data as CustomAsset[];
        case "other_investments": return data as OtherInvestmentAsset[];

        case "homeLoans": return data as HomeLoanAsset[];
        case "vehicleLoans": return data as VehicleLoanAsset[];
        case "educationLoans": return data as EducationLoanAsset[];
        case "personalLoans": return data as PersonalLoanAsset[];
        case "otherLiabilities": return data as OtherLiabilityAsset[];
        default: return data;
    }
}
