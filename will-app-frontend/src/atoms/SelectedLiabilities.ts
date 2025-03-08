import { atom } from 'recoil';
import { ASSET_TYPES } from '../constants';

export interface ISelectedLiabilitiesState {
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
    type: string
    id: string
    label: string
}

export const assetRoutesMap: Record<keyof ISelectedAssetsState, IRoutePathWithOrder> = {
    properties: {
        order: 1,
        routePath: "/properties",
        id: "properties",
        type: ASSET_TYPES.IMMOVABLE_ASSETS,
        label: "Properties"
    },
    bankAccounts: {
        order: 2,
        routePath: "/bank_accounts",
        id: "bank_accounts",
        type: ASSET_TYPES.FINANCIAL_ASSETS,
        label: "Bank Accounts"
    },
    fixedDeposits: {
        order: 3,
        routePath: "/fixed_deposits",
        id: "fixed_deposits",
        type: ASSET_TYPES.FINANCIAL_ASSETS,
        label: "Fixed Deposits"
    },
    insurancePolicies: {
        order: 4,
        routePath: "/insurance_policies",
        id: "insurance_polices",
        type: ASSET_TYPES.FINANCIAL_ASSETS,
        label: "Insurance Policies"
    },
    safetyDepositBoxes: {
        order: 5,
        routePath: "/safe_deposit_boxes",
        id: "safe_deposit_boxes",
        type: ASSET_TYPES.FINANCIAL_ASSETS,
        label: "Safety Deposit Boxes/Lockers"
    },
    dematAccounts: {
        order: 6,
        routePath: "/demat_accounts",
        id: "demat_accounts",
        type: ASSET_TYPES.FINANCIAL_ASSETS,
        label: "Demat Accounts"
    },
    mutualFunds: {
        order: 7,
        routePath: "/mutual_funds",
        id: "mutual_funds",
        type: ASSET_TYPES.FINANCIAL_ASSETS,
        label: "Mutual Funds"
    },
    providentFunds: {
        order: 8,
        routePath: "/provident_fund",
        id: "provident_fund",
        type: ASSET_TYPES.FINANCIAL_ASSETS,
        label: "Provident Funds"
    },
    pensionAccounts: {
        order: 9,
        routePath: "/pension_accounts",
        id: "pension_accounts",
        type: ASSET_TYPES.FINANCIAL_ASSETS,
        label: "Pension Accounts"
    },
    businesses: {
        order: 10,
        routePath: "/business",
        id: "business",
        type: ASSET_TYPES.BUSINESS_ASSETS,
        label: "Businesses"
    },
    bonds: {
        order: 11,
        routePath: "/bonds",
        id: "bonds",
        type: ASSET_TYPES.BUSINESS_ASSETS,
        label: "Bonds"
    },
    debentures: {
        order: 12,
        routePath: "/debentures",
        id: "debentures",
        type: ASSET_TYPES.BUSINESS_ASSETS,
        label: "Debentures"
    },
    esops: {
        order: 13,
        routePath: "/esops",
        id: "esops",
        type: ASSET_TYPES.BUSINESS_ASSETS,
        label: "ESCOPS"
    },
    otherInvestments: {
        order: 14,
        routePath: "/other_investments",
        id: "other_investments",
        type: ASSET_TYPES.BUSINESS_ASSETS,
        label: "Other Investments"
    },
    vehicles: {
        order: 15,
        routePath: "/vehicles",
        type: ASSET_TYPES.OTHER_ASSETS,
        id: "vehicles",
        label: "Vehicles"
    },
    jewellery: {
        order: 16,
        routePath: "/jewelleries",
        type: ASSET_TYPES.OTHER_ASSETS,
        id: "jewelleries",
        label: "Jewelleries"
    },
    digitalAssets: {
        order: 17,
        routePath: "/digital_assets",
        type: ASSET_TYPES.OTHER_ASSETS,
        id: "digital_assets",
        label: "Digital Assets"
    },
    intellectualProperties: {
        order: 18,
        routePath: "/intellectual_property",
        type: ASSET_TYPES.OTHER_ASSETS,
        id: "intellectual_property",
        label: "Intellectual Property"
    },
    customAssets: {
        order: 19,
        routePath: "/custom_assets",
        type: ASSET_TYPES.OTHER_ASSETS,
        id: "custom_assets",
        label: "Custom Assets"
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