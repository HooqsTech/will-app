import { useRecoilState } from "recoil";
import { addressDetailsState, IAddressDetailsState } from "../../atoms/AddressDetailsState";
import CustomFormContainer from "../CustomFormContainer";
import CustomTextBox from "../CustomTextBox";
import { Dayjs } from "dayjs";
import { addressDetailsValidationState } from "../../atoms/validationStates/AddressDetailsValidationState";
import CustomCheckbox from "../CustomCheckbox";

const AddressDetailsForm = () => {
    const [formState, setFormState] = useRecoilState(addressDetailsState);
    const [validationState, setValidationState] = useRecoilState(addressDetailsValidationState);

    const handleChange = (key: keyof IAddressDetailsState, value: string | Dayjs | null | boolean) => {
        changeState(key, value)

        if (formState.sameAsPresentAddress === true) {
            setPermanentAddressFromPresentAddress()
        }

        if (key === "sameAsPresentAddress" && value === true) {
            setPermanentAddressFromPresentAddress()
        }
    }

    const changeState = (key: keyof IAddressDetailsState, value: string | Dayjs | null | boolean) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));

        setValidationState((prevState) => ({
            ...prevState,
            [key]: "",
        }));
    };

    const setPermanentAddressFromPresentAddress = () => {
        changeState("permAddress1", formState.address1)
        changeState("permAddress2", formState.address2)
        changeState("permCity", formState.city)
        changeState("permState", formState.state)
        changeState("permEmail", formState.email)
        changeState("permPincode", formState.pincode)
        changeState("permPhoneNumber", formState.phoneNumber)
    }

    return (
        <CustomFormContainer formLabel="Address Details">
            <div className="flex flex-col gap-4">
                <p className="font-semibold">Present Address</p>
                <CustomTextBox
                    value={formState.address1}
                    onChange={(e) => handleChange("address1", e)}
                    required
                    maxLength={100}
                    helperText={validationState.address1}
                    label="Address 1"
                    type="text" />
                <CustomTextBox
                    value={formState.address2}
                    required
                    onChange={(e) => handleChange("address2", e)}
                    maxLength={100}
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
                    maxLength={25}
                    label="City"
                    type="text" />
                <CustomTextBox
                    value={formState.state}
                    required
                    helperText={validationState.state}
                    maxLength={25}
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
            </div>
            <div>
                <CustomCheckbox onChange={() => {
                    handleChange("sameAsPresentAddress", !formState.sameAsPresentAddress);
                }} checked={formState.sameAsPresentAddress ?? false} label="Same as present address?" />
            </div>
            <div className="flex flex-col gap-4">
                <p className="font-semibold">Permanent Address</p>
                <CustomTextBox
                    value={formState.permAddress1}
                    onChange={(e) => handleChange("permAddress1", e)}
                    maxLength={100}
                    disabled={formState.sameAsPresentAddress}
                    required
                    helperText={validationState.permAddress1}
                    label="Address 1"
                    type="text" />
                <CustomTextBox
                    value={formState.permAddress2}
                    disabled={formState.sameAsPresentAddress}
                    maxLength={100}
                    required
                    onChange={(e) => handleChange("permAddress2", e)}
                    helperText={validationState.permAddress2}
                    label="Address 2"
                    type="text" />
                <CustomTextBox
                    restrictAlphabets
                    value={formState.permPincode}
                    disabled={formState.sameAsPresentAddress}
                    required
                    helperText={validationState.permPincode}
                    onChange={(e) => handleChange("permPincode", e)}
                    maxLength={6}
                    label="Pincode"
                    type="text" />
                <CustomTextBox
                    value={formState.permCity}
                    required
                    helperText={validationState.permCity}
                    disabled={formState.sameAsPresentAddress}
                    onChange={(e) => handleChange("permCity", e)}
                    maxLength={25}
                    label="City"
                    type="text" />
                <CustomTextBox
                    value={formState.permState}
                    required
                    helperText={validationState.permState}
                    disabled={formState.sameAsPresentAddress}
                    maxLength={25}
                    onChange={(e) => handleChange("permState", e)}
                    label="State"
                    type="text" />
                <CustomTextBox
                    value={formState.permEmail}
                    required
                    helperText={validationState.permEmail}
                    onChange={(e) => handleChange("permEmail", e)}
                    disabled={formState.sameAsPresentAddress}
                    label="Email"
                    type="email" />
                <CustomTextBox
                    value={formState.permPhoneNumber}
                    restrictAlphabets
                    required
                    disabled={formState.sameAsPresentAddress}
                    maxLength={10}
                    helperText={validationState.permPhoneNumber}
                    onChange={(e) => handleChange("permPhoneNumber", e)}
                    label="Phone Number"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default AddressDetailsForm