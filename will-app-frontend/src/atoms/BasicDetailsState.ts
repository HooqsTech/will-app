import { atom } from 'recoil';
import { IUserDetails } from '../models/user';


export const basicDetailsState = atom<IUserDetails>({
    key: 'basicDetailsState',
    default: {
        "fullName" : "", 
        "fatherName" : "", 
        "phoneNumber" : "+91-9876543210",
        "userName" : "",
        "password" : "",
        "gender" : "",
        "dob" : "",
        "religion" : "",
        "aadhaarNumber" : "",
        "addressDetails" : {
            "address": "",
            "email": "",
            "phoneNumber": "+91-9876543210",
            "address_1": "",
            "address_2": "",
            "pincode": "",
            "city": "",
            "state": ""
        },
      }
});