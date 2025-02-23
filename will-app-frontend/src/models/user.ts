import { ISelectedAssets } from "./asset"

export interface IPersonalDetails {
  fullName: string,
  fatherName: string,
  userName: string,
  password: string,
  gender: string,
  dob: string,
  religion: string,
  aadhaarNumber: string
}

export interface IUserDetails {
  userId: string,
  personalDetails: IPersonalDetails,
  addressDetails: IAddressDetails,
  selectedAssets: ISelectedAssets,
  assets: IAssetDetails[]
}

export interface IAssetDetails {
  assetId: string,
  type: string,
  subtype: string,
  data: {
    size: string,
    location: string,
    ownershipType: string
  }

}

export interface IAddressDetails {
  address1: string,
  address2: string,
  pincode: string,
  city: string,
  state: string,
  phoneNumber: string,
  email: string
}