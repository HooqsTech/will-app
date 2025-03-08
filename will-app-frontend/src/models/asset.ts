export interface IAsset {
    id: string
    userId: string
    type: string,
    subtype: string,
    data: any
}

export interface ISelectedAssets {
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
    vehicleLoans: boolean
    educationLoans: boolean
    personalLoans: boolean
    otherLiabilities: boolean
}