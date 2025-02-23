export interface IAsset {
    userid: number,
    type: string,
    subtype: string,
    data: any
}

export interface ISelectedAssets {
    hasProperties: boolean;
    hasFixedDeposits: boolean
    hasInsurancePolicies: boolean
    hasSafetyDepositBoxes: boolean
    hasDematAccounts: boolean
    hasMutualFunds: boolean
    hasProvidentFunds: boolean
    hasPensionAccounts: boolean
    hasBusinesses: boolean
    hasBonds: boolean
    hasDebentures: boolean
    hasEsops: boolean
    hasOtherInvestments: boolean
    hasVehicles: boolean
    hasJewellery: boolean
    hasDigitalAssets: boolean
    hasIntellectualProperties: boolean
    hasCustomAssets: boolean
    hasBankAccounts: boolean
}