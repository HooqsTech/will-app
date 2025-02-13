import { useRecoilState } from "recoil";
import { basicDetailsState } from "../../atoms/BasicDetailsState";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IAddressDetails } from "../../models/user";

const AddressDetailsForm = () => {
    const [formState, setFormState] = useRecoilState(basicDetailsState);

    const handleChange = (key: keyof IAddressDetails, value: string | null | undefined) => {
        setFormState((prevState) => ({
            ...prevState,
            addressDetails: {
                ...prevState.addressDetails
                ,[key]: value
            }
        }));
    };
    

    return (
        <CustomFormContainer formLabel="Address Details">
            
            <CustomTextBox
                value={formState.addressDetails.address}
                onChange={(e) => handleChange("address", e)}
                label="Address"
                type="text" />
            <CustomTextBox
                value={formState.addressDetails.address_1}
                onChange={(e) => handleChange("address_1", e)}
                label="Address 1"
                type="text" />
            <CustomTextBox
                value={formState.addressDetails.address_2}
                onChange={(e) => handleChange("address_2", e)}
                label="Address 2"
                type="text" />
            <CustomTextBox
                value={formState.addressDetails.pincode}
                onChange={(e) => handleChange("pincode", e)}
                label="Pincode"
                type="text" />
            <CustomTextBox
                value={formState.addressDetails.city}
                onChange={(e) => handleChange("city", e)}
                label="City"
                type="text" />
            <CustomTextBox
                value={formState.addressDetails.state}
                onChange={(e) => handleChange("state", e)}
                label="State"
                type="text" />
            <CustomTextBox
                value={formState.addressDetails.email}
                onChange={(e) => handleChange("email", e)}
                label="Email"
                type="email" />
            <CustomTextBox
                value={formState.addressDetails.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e)}
                label="Phone Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default AddressDetailsForm