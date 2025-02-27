import { useRecoilValue, useSetRecoilState } from "recoil";
import CustomButton from "../components/CustomButton";
import PersonalDetailsForm from "../components/Forms/PersonalDetailsForm";
import { useNavigate } from "react-router";
import { personalDetailsState } from "../atoms/PersonalDetailsState";
import { addPersonalDetailsAsync } from "../api/user";
import { userState } from "../atoms/UserDetailsState";
import { useState } from "react";
import { IPersonalDetailsValidationState, personalDetailsValidationState } from "../atoms/validationStates/PersonalDetailValidationState";
import { Dayjs } from "dayjs";
import { IsEmptyString } from "../utils";
import NextButton from "../components/NextButton";


const PersonalDetailsPage = () => {
    const personalDetails = useRecoilValue(personalDetailsState);
    const user = useRecoilValue(userState);
    const [loading, setLoading] = useState<boolean>(false);
    const setValidationState = useSetRecoilState(personalDetailsValidationState);

    const validate = (): boolean => {
        var isValid: boolean = true;
        if (IsEmptyString(personalDetails.fullName)) {
            handleValidation("fullName", "full name is required");
            isValid = false;
        }

        if (IsEmptyString(personalDetails.fatherName)) {
            handleValidation("fatherName", "father name is required");
            isValid = false;
        }

        if (IsEmptyString(personalDetails.gender)) {
            handleValidation("gender", "gender is required");
            isValid = false;
        }

        if (IsEmptyString(personalDetails.dob)) {
            handleValidation("dob", "date of birth is required");
            isValid = false;
        }

        if (IsEmptyString(personalDetails.aadhaarNumber)) {
            handleValidation("aadhaarNumber", "aaadhaar number is required");
            isValid = false;
        }

        if (IsEmptyString(personalDetails.religion)) {
            handleValidation("religion", "religion is required");
            isValid = false;
        }

        return isValid;
    }

    const handleValidation = (key: keyof IPersonalDetailsValidationState, value: string | Dayjs | null) => {
        setValidationState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };


    const navigate = useNavigate();

    const addUserDetails = async () => {
        if (validate() == false) return;

        // SAVE PERSONAL DETAILS
        setLoading(true);
        const result = await addPersonalDetailsAsync(personalDetails, user.userId);
        setLoading(false);

        // NAVIGATE TO ADDRESS DETAILS
        if (result.userName === personalDetails.userName) {
            navigate("/address_details");
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-lg space-y-8">
                <PersonalDetailsForm />
                <NextButton onClick={addUserDetails} loading={loading} label="Save & Next" />
            </div>
        </div>
    )
}

export default PersonalDetailsPage