export interface IPersonalDetails {
    full_name: string | null;
    father_name: string | null;
    gender: string | null;
    dob: string | null;
    religion: string | null;
    aadhaar_number: string | null;
    username: string | null;
    phone_number: string | null;
  }

export interface IUserDetails {
    fullName : string | null, 
    fatherName : string | null, 
    phoneNumber : string | null, 
    userName : string | null, 
    password : string | null, 
    gender : string | null, 
    dob : string | null, 
    religion : string | null, 
    aadhaarNumber : string | null, 
    addressDetails : IAddressDetails
}

export interface IAddressDetails {
  address: string | null,
  email: string | null,
  phoneNumber: string | null,
  address_1: string | null,
  address_2: string | null,
  pincode: string | null,
  city: string | null,
  state: string | null
}