import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router";
import { addressDetailsState } from "../atoms/AddressDetailsState";
import AddressDetailsForm from "../components/Forms/AddressDetailsForm";
import { addAddressDetailsAsync } from "../api/user";
import { useState } from "react";
import { userState } from "../atoms/UserDetailsState";
import { IsEmptyString } from "../utils";
import { addressDetailsValidationState, IAddressDetailsValidationState } from "../atoms/validationStates/AddressDetailsValidationState";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import { ROUTE_PATHS } from "../constants";

const AddressDetailsPage = () => {
    const addressDetails = useRecoilValue(addressDetailsState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const setValidationState = useSetRecoilState(addressDetailsValidationState);

    const validate = (): boolean => {
        var isValid: boolean = true;
        if (IsEmptyString(addressDetails.address1)) {
            handleValidation("address1", "address 1 is required");
            isValid = false;
        }

        if (IsEmptyString(addressDetails.address2)) {
            handleValidation("address2", "address 2 is required");
            isValid = false;
        }

        if (IsEmptyString(addressDetails.pincode)) {
            handleValidation("pincode", "picode is required");
            isValid = false;
        }

        if (IsEmptyString(addressDetails.city)) {
            handleValidation("city", "city is required");
            isValid = false;
        }

        if (IsEmptyString(addressDetails.state)) {
            handleValidation("state", "state is required");
            isValid = false;
        }

        if (IsEmptyString(addressDetails.phoneNumber)) {
            handleValidation("phoneNumber", "phone number is required");
            isValid = false;
        }

        if (IsEmptyString(addressDetails.email)) {
            handleValidation("email", "email is required");
            isValid = false;
        }

        return isValid;
    }

    const handleValidation = (key: keyof IAddressDetailsValidationState, value: string | null) => {
        setValidationState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const addUserDetails = async () => {
        if (validate() == false) return;

        // SAVE PERSONAL DETAILS
        setLoading(true);
        const result = await addAddressDetailsAsync(addressDetails, user.userId);
        setLoading(false);

        // NAVIGATE TO IMMOVABLE ASSETS
        if (result.address1 === addressDetails.address1) {
            navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.ASSETS);
        }
    }

    return (
        <div className="flex flex-col md:w-lg w-full  items-start h-full">
            <div className="w-full md:w-lg space-y-8">
                <AddressDetailsForm />
                <div className="flex gap-2">
                    <BackButton onClick={() => navigate("/personal_details")} label="Back" />
                    <NextButton loading={loading} onClick={addUserDetails} />
                </div>
            </div>
        </div>
    )
}

export default AddressDetailsPage