import { atom } from 'recoil';

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
}

interface IRoutePathWithOrder {
  order: number
  routePath: string
}

export const assetRoutesMap: Record<keyof ISelectedAssetsState, IRoutePathWithOrder> = {
  properties: {
    order: 1,
    routePath: "/properties",
  },
  bankAccounts: {
    order: 2,
    routePath: "/bank_accounts",
  },
  fixedDeposits: {
    order: 3,
    routePath: "/fixed_deposits",
  },
  insurancePolicies: {
    order: 4,
    routePath: "/insurance_policies",
  },
  safetyDepositBoxes: {
    order: 5,
    routePath: "/safe_deposit_boxes",
  },
  dematAccounts: {
    order: 6,
    routePath: "/demat_accounts",
  },
  mutualFunds: {
    order: 7,
    routePath: "/mutual_funds",
  },
  providentFunds: {
    order: 8,
    routePath: "/provident_fund",
  },
  pensionAccounts: {
    order: 9,
    routePath: "/pension_accounts",
  },
  businesses: {
    order: 10,
    routePath: "/business",
  },
  bonds: {
    order: 11,
    routePath: "/bonds",
  },
  debentures: {
    order: 12,
    routePath: "/debentures",
  },
  esops: {
    order: 13,
    routePath: "/esops",
  },
  otherInvestments: {
    order: 14,
    routePath: "/other_investments",
  },
  vehicles: {
    order: 15,
    routePath: "/vehicles",
  },
  jewellery: {
    order: 16,
    routePath: "/jewelry",
  },
  digitalAssets: {
    order: 17,
    routePath: "/digital_assets",
  },
  intellectualProperties: {
    order: 18,
    routePath: "/intellectual_property",
  },
  customAssets: {
    order: 19,
    routePath: "/custom_assets",
  },
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
    bankAccounts: false
  }
});