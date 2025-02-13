import { useRecoilState } from "recoil";
import CustomTextBox from "../CustomTextBox"
import { basicDetailsState } from "../../atoms/BasicDetailsState";
import dayjs, { Dayjs } from "dayjs";
import CustomSelect from "../CustomSelect";
import CustomDatePicker from "../CustomDatePicker";
import CustomFormContainer from "../CustomFormContainer";
import { IUserDetails } from "../../models/user";

const PersonalDetailsForm = () => {
    const [formState, setFormState] = useRecoilState(basicDetailsState);

    const handleChange = (key: keyof IUserDetails, value: string | Dayjs | null) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <CustomFormContainer formLabel="Personal Details">
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
                value={formState.gender ?? "Male"}
                onChange={(e) => handleChange("gender", e)} />
            <CustomDatePicker
                onChange={(e) => handleChange("dob", e)}
                value={formState.dob ? dayjs(formState.dob): dayjs()}
                label="DOB" />
            <CustomSelect
                label="Religion"
                options={["Hindu", "Muslim", "Christian", "Others"]}
                value={formState.religion ?? "Hindu"}
                onChange={(e) => handleChange("religion", e)} />
            <CustomTextBox
                value={formState.aadhaarNumber}
                onChange={(e) => handleChange("aadhaarNumber", e)}
                label="Aadhaar Number"
                type="text" />
                
        </CustomFormContainer>
    )
}

export default PersonalDetailsForm   