// import { AddressDetails } from '../models/userResponseModel';

// export const upsertAddressDetails = async (addressData: AddressDetails): Promise<AddressDetails> => {
//   const { city, email, state, address, pincode, address_1, address_2, phone_number } = addressData;

//   const response = await fetch("http://localhost:5000/api/address/upsert", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       city,
//       email,
//       state,
//       address,
//       pincode,
//       address_1,
//       address_2,
//       phone_number,
//     }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to upsert address details");
//   }

//   const updatedAddress: AddressDetails = await response.json();
//   return updatedAddress;
// };

// // Get address details by user_id
// export const getAddressDetails = async (userId: string): Promise<AddressDetails[]> => {
//   const response = await fetch(`http://localhost:5000/api/address/${userId}`, {
//     method: "GET",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch address details");
//   }

//   // Parse the 'data' field from string to AddressData object if it is a string, handling null cases
//   const address: AddressDetails[] = await response.json(); // Directly map the response to AddressDetails interface

//   return address;
// };

// // Delete address details by id
// export const deleteAddressDetails = async (id: string): Promise<void> => {
//   const response = await fetch(`http://localhost:5000/api/address/${id}`, {
//     method: "DELETE",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to delete address details");
//   }
// };
