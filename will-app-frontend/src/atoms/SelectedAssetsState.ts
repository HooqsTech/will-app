import { atom } from 'recoil';

export interface ISelectedAssetsState {
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

export const selectedAssetsState = atom<ISelectedAssetsState>({
  key: 'selectedAssetsState',
  default: {
    hasProperties: false,
    hasFixedDeposits: false,
    hasInsurancePolicies: false,
    hasSafetyDepositBoxes: false,
    hasDematAccounts: false,
    hasMutualFunds: false,
    hasProvidentFunds: false,
    hasPensionAccounts: false,
    hasBusinesses: false,
    hasBonds: false,
    hasDebentures: false,
    hasEsops: false,
    hasOtherInvestments: false,
    hasVehicles: false,
    hasJewellery: false,
    hasDigitalAssets: false,
    hasIntellectualProperties: false,
    hasCustomAssets: false,
    hasBankAccounts: false
  }
});