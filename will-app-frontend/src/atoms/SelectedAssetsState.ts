import { atom } from 'recoil';
import { ASSET_TYPES, ROUTE_PATHS } from '../constants';

export interface ISelectedAssetsState {
  properties: boolean;
  bankAccounts: boolean
  fixedDeposits: boolean
  insurancePolicies: boolean
  safetyDepositBoxes: boolean
  dematAccounts: boolean
  mutualFunds: boolean
  providentFunds: boolean
  pensionAccounts: boolean
  businesses: boolean
  bonds: boolean
  debentures: boolean
  esops: boolean
  otherInvestments: boolean
  vehicles: boolean
  jewellery: boolean
  digitalAssets: boolean
  intellectualProperties: boolean
  customAssets: boolean
  homeLoans: boolean
  personalLoans: boolean
  vehicleLoans: boolean
  educationLoans: boolean
  otherLiabilities: boolean
}

interface IRoutePathWithOrder {
  order: number
  routePath: string
  parentRoutePath?: string
  type: string
  id: string
  label: string
}

export const assetRoutesMap: Record<keyof ISelectedAssetsState, IRoutePathWithOrder> = {
  properties: {
    order: 1,
    routePath: ROUTE_PATHS.PROPERTIES,
    parentRoutePath: ROUTE_PATHS.YOUR_WILL,
    id: "properties",
    type: ASSET_TYPES.IMMOVABLE_ASSETS,
    label: "Properties"
  },
  bankAccounts: {
    order: 2,
    routePath: ROUTE_PATHS.BANK_ACCOUNTS,
    parentRoutePath: ROUTE_PATHS.YOUR_WILL,
    id: "bank_accounts",
    type: ASSET_TYPES.FINANCIAL_ASSETS,
    label: "Bank Accounts"
  },
  fixedDeposits: {
    order: 3,
    routePath: ROUTE_PATHS.FIXED_DEPOSITS,
    id: "fixed_deposits",
    type: ASSET_TYPES.FINANCIAL_ASSETS,
    label: "Fixed Deposits"
  },
  insurancePolicies: {
    order: 4,
    routePath: ROUTE_PATHS.INSURANCE_POLICIES,
    id: "insurance_polices",
    type: ASSET_TYPES.FINANCIAL_ASSETS,
    label: "Insurance Policies"
  },
  safetyDepositBoxes: {
    order: 5,
    routePath: ROUTE_PATHS.SAFE_DEPOSIT_BOXES,
    id: "safe_deposit_boxes",
    type: ASSET_TYPES.FINANCIAL_ASSETS,
    label: "Safety Deposit Boxes/Lockers"
  },
  dematAccounts: {
    order: 6,
    routePath: ROUTE_PATHS.DEMAT_ACCOUNTS,
    id: "demat_accounts",
    type: ASSET_TYPES.FINANCIAL_ASSETS,
    label: "Demat Accounts"
  },
  mutualFunds: {
    order: 7,
    routePath: ROUTE_PATHS.MUTUAL_FUNDS,
    id: "mutual_funds",
    type: ASSET_TYPES.FINANCIAL_ASSETS,
    label: "Mutual Funds"
  },
  providentFunds: {
    order: 8,
    routePath: ROUTE_PATHS.PROVIDENT_FUND,
    id: "provident_fund",
    type: ASSET_TYPES.FINANCIAL_ASSETS,
    label: "Provident Funds"
  },
  pensionAccounts: {
    order: 9,
    routePath: ROUTE_PATHS.PENSION_ACCOUNTS,
    id: "pension_accounts",
    type: ASSET_TYPES.FINANCIAL_ASSETS,
    label: "Pension Accounts"
  },
  businesses: {
    order: 10,
    routePath: ROUTE_PATHS.BUSINESS,
    id: "business",
    type: ASSET_TYPES.BUSINESS_ASSETS,
    label: "Businesses"
  },
  bonds: {
    order: 11,
    routePath: ROUTE_PATHS.BONDS,
    id: "bonds",
    type: ASSET_TYPES.BUSINESS_ASSETS,
    label: "Bonds"
  },
  debentures: {
    order: 12,
    routePath: ROUTE_PATHS.DEBENTURES,
    id: "debentures",
    type: ASSET_TYPES.BUSINESS_ASSETS,
    label: "Debentures"
  },
  esops: {
    order: 13,
    routePath: ROUTE_PATHS.ESCOPS,
    id: "esops",
    type: ASSET_TYPES.BUSINESS_ASSETS,
    label: "ESCOPS"
  },
  otherInvestments: {
    order: 14,
    routePath: ROUTE_PATHS.OTHER_INVESTMENTS,
    id: "other_investments",
    type: ASSET_TYPES.BUSINESS_ASSETS,
    label: "Other Investments"
  },
  vehicles: {
    order: 15,
    routePath: ROUTE_PATHS.VEHICLES,
    type: ASSET_TYPES.OTHER_ASSETS,
    id: "vehicles",
    label: "Vehicles"
  },
  jewellery: {
    order: 16,
    routePath: ROUTE_PATHS.JEWELLERIES,
    type: ASSET_TYPES.OTHER_ASSETS,
    id: "jewelleries",
    label: "Jewelleries"
  },
  digitalAssets: {
    order: 17,
    routePath: ROUTE_PATHS.DIGITAL_ASSETS,
    type: ASSET_TYPES.OTHER_ASSETS,
    id: "digital_assets",
    label: "Digital Assets"
  },
  intellectualProperties: {
    order: 18,
    routePath: ROUTE_PATHS.INTELLECTUAL_PROPERTY,
    type: ASSET_TYPES.OTHER_ASSETS,
    id: "intellectual_property",
    label: "Intellectual Property"
  },
  customAssets: {
    order: 19,
    routePath: ROUTE_PATHS.CUSTOM_ASSETS,
    type: ASSET_TYPES.OTHER_ASSETS,
    id: "custom_assets",
    label: "Custom Assets"
  },
  homeLoans: {
    order: 20,
    routePath: ROUTE_PATHS.HOME_LOANS,
    type: ASSET_TYPES.LIABILITIES,
    id: "home_loans",
    label: "Home Loans"
  },
  personalLoans: {
    order: 21,
    routePath: ROUTE_PATHS.PERSONAL_LOANS,
    type: ASSET_TYPES.LIABILITIES,
    id: "personal_loans",
    label: "Personal Loans"
  },
  vehicleLoans: {
    order: 21,
    routePath: ROUTE_PATHS.VEHICLE_LOANS,
    type: ASSET_TYPES.LIABILITIES,
    id: "vehicle_loans",
    label: "Vehicle Loans"
  },
  educationLoans: {
    order: 21,
    routePath: ROUTE_PATHS.EDUCATION_LOANS,
    type: ASSET_TYPES.LIABILITIES,
    id: "education_loans",
    label: "Education Loans"
  },
  otherLiabilities: {
    order: 21,
    routePath: ROUTE_PATHS.OTHER_LIABILITIES,
    type: ASSET_TYPES.LIABILITIES,
    id: "other_liabilities",
    label: "Other Liabilities"
  }
};

export const selectedAssetsState = atom<ISelectedAssetsState>({
  key: 'selectedAssetsState',
  default: {
    properties: false,
    fixedDeposits: false,
    insurancePolicies: false,
    safetyDepositBoxes: false,
    dematAccounts: false,
    mutualFunds: false,
    providentFunds: false,
    pensionAccounts: false,
    businesses: false,
    bonds: false,
    debentures: false,
    esops: false,
    otherInvestments: false,
    vehicles: false,
    jewellery: false,
    digitalAssets: false,
    intellectualProperties: false,
    customAssets: false,
    bankAccounts: false,
    homeLoans: false,
    vehicleLoans: false,
    educationLoans: false,
    personalLoans: false,
    otherLiabilities: false
  }
});