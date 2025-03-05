import { useRecoilState } from "recoil";
import { addressDetailsState, IAddressDetailsState } from "../../atoms/AddressDetailsState";
import CustomFormContainer from "../CustomFormContainer";
import CustomTextBox from "../CustomTextBox";
import { Dayjs } from "dayjs";
import { addressDetailsValidationState } from "../../atoms/validationStates/AddressDetailsValidationState";

const AddressDetailsForm = () => {
    const [formState, setFormState] = useRecoilState(addressDetailsState);
    const [validationState, setValidationState] = useRecoilState(addressDetailsValidationState);

    const handleChange = (key: keyof IAddressDetailsState, value: string | Dayjs | null) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));

        setValidationState((prevState) => ({
            ...prevState,
            [key]: "",
        }));
    };

    return (
        <CustomFormContainer formLabel="Address Details">
            <CustomTextBox
                value={formState.address1}
                onChange={(e) => handleChange("address1", e)}
                required
                helperText={validationState.address1}
                label="Address 1"
                type="text" />
            <CustomTextBox
                value={formState.address2}
                required
                onChange={(e) => handleChange("address2", e)}
                helperText={validationState.address2}
                label="Address 2"
                type="text" />
            <CustomTextBox
                restrictAlphabets
                value={formState.pincode}
                required
                helperText={validationState.pincode}
                onChange={(e) => handleChange("pincode", e)}
                maxLength={6}
                label="Pincode"
                type="text" />
            <CustomTextBox
                value={formState.city}
                required
                helperText={validationState.city}
                onChange={(e) => handleChange("city", e)}
                label="City"
                type="text" />
            <CustomTextBox
                value={formState.state}
                required
                helperText={validationState.state}
                onChange={(e) => handleChange("state", e)}
                label="State"
                type="text" />
            <CustomTextBox
                value={formState.email}
                required
                helperText={validationState.email}
                onChange={(e) => handleChange("email", e)}
                label="Email"
                type="email" />
            <CustomTextBox
                value={formState.phoneNumber}
                restrictAlphabets
                required
                maxLength={10}
                helperText={validationState.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e)}
                label="Phone Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default AddressDetailsForm