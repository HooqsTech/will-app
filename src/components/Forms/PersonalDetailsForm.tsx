import { useRecoilState } from "recoil";
import CustomTextBox from "../CustomTextBox"
import { basicDetailsState, IBasicDetailsState } from "../../atoms/BasicDetailsState";
import { Dayjs } from "dayjs";
import CustomSelect from "../CustomSelect";
import CustomDatePicker from "../CustomDatePicker";
import CustomFormContainer from "../CustomFormContainer";

const PersonalDetailsForm = () => {
    const [formState, setFormState] = useRecoilState(basicDetailsState);

    const handleChange = (key: keyof IBasicDetailsState, value: string | Dayjs | null) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <CustomFormContainer formLabel="Personal Details">
            <div>
                <CustomTextBox
                    value={formState.fullName}
                    onChange={(e) => handleChange("fullName", e)}
                    label="Full Name"
                    type="text" />
                <CustomTextBox
                    value={formState.fatherName}
                    onChange={(e) => handleChange("fatherName", e)}
                    label="Father Name" type="text" />
                <CustomSelect
                    label="Gender"
                    options={["Male", "Female", "Others"]}
                    value={formState.gender}
                    onChange={(e) => handleChange("gender", e)} />
                <CustomDatePicker
                    onChange={(e) => handleChange("dob", e)}
                    value={formState.dob}
                    label="DOB" />
                <CustomSelect
                    label="Religion"
                    options={["Hindu", "Muslim", "Christian", "Others"]}
                    value={formState.religion}
                    onChange={(e) => handleChange("religion", e)} />
                <CustomTextBox
                    value={formState.aadhaarNumber}
                    onChange={(e) => handleChange("aadhaarNumber", e)}
                    label="Aadhaar Number"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default PersonalDetailsForm   