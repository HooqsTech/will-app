import { useRecoilState } from "recoil";
import CustomTextBox from "../CustomTextBox"
import { personalDetailsState, IPersonalDetailsState } from "../../atoms/PersonalDetailsState";
import dayjs, { Dayjs } from "dayjs";
import CustomSelect from "../CustomSelect";
import CustomDatePicker from "../CustomDatePicker";
import CustomFormContainer from "../CustomFormContainer";
import { personalDetailsValidationState } from "../../atoms/validationStates/PersonalDetailValidationState";

const PersonalDetailsForm = () => {
    const [formState, setFormState] = useRecoilState(personalDetailsState);
    const [validationState, setValidationState] = useRecoilState(personalDetailsValidationState);

    const handleChange = (key: keyof IPersonalDetailsState, value: string | Dayjs | null) => {
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
        <CustomFormContainer formLabel="Personal Details">
            <CustomTextBox
                required
                value={formState.fullName}
                onChange={(e) => handleChange("fullName", e)}
                label="Full Name"
                helperText={validationState.fullName}
                type="text" />
            <CustomTextBox
                required
                value={formState.fatherName}
                onChange={(e) => handleChange("fatherName", e)}
                helperText={validationState.fatherName}
                label="Father Name" type="text" />
            <CustomSelect
                label="Gender"
                required
                options={["Male", "Female", "Others"]}
                helperText={validationState.gender}
                value={formState.gender}
                onChange={(e) => handleChange("gender", e)} />
            <CustomDatePicker
                required
                onChange={(e) => handleChange("dob", e)}
                value={formState.dob ? dayjs(formState.dob) : null}
                helperText={validationState.dob}
                label="DOB" />
            <CustomSelect
                required
                label="Religion"
                options={["Hindu", "Muslim", "Christian", "Others"]}
                value={formState.religion}
                helperText={validationState.religion}
                onChange={(e) => handleChange("religion", e)} />
            <CustomTextBox
                required
                value={formState.aadhaarNumber}
                helperText={validationState.aadhaarNumber}
                onChange={(e) => handleChange("aadhaarNumber", e)}
                label="Aadhaar Number"
                restrictAlphabets
                maxLength={12}
                type="text" />
        </CustomFormContainer>
    )
}

export default PersonalDetailsForm   