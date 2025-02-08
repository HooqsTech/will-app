import { useRecoilState } from "recoil";
import { basicDetailsState, IBasicDetailsState } from "../../atoms/BasicDetailsState";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { Dayjs } from "dayjs";

const AddressDetailsForm = () => {
    const [formState, setFormState] = useRecoilState(basicDetailsState);

    const handleChange = (key: keyof IBasicDetailsState, value: string | Dayjs | null) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <CustomFormContainer formLabel="Address Details">
            <div>
                <CustomTextBox
                    value={formState.email}
                    onChange={(e) => handleChange("email", e)}
                    label="Email"
                    type="email" />
                <CustomTextBox
                    value={formState.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e)}
                    label="Phone Number"
                    type="text" />
                <CustomTextBox
                    value={formState.address1}
                    onChange={(e) => handleChange("address1", e)}
                    label="Address 1"
                    type="text" />
                <CustomTextBox
                    value={formState.address2}
                    onChange={(e) => handleChange("address2", e)}
                    label="Address 2"
                    type="text" />
                <CustomTextBox
                    value={formState.pincode}
                    onChange={(e) => handleChange("pincode", e)}
                    label="Pincode"
                    type="text" />
                <CustomTextBox
                    value={formState.city}
                    onChange={(e) => handleChange("city", e)}
                    label="City"
                    type="text" />
                <CustomTextBox
                    value={formState.state}
                    onChange={(e) => handleChange("state", e)}
                    label="State"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default AddressDetailsForm