import { useNavigate } from "react-router";
import CustomTextBox from "../components/CustomTextBox";
import CustomButton from "../components/CustomButton";
import { useRecoilState } from "recoil";
import { currentStepper } from "../atoms/StepperState";
import CustomSelect from "../components/CustomSelect";
import CustomDatePicker from "../components/CustomDatePicker";
import { basicDetailsState, IBasicDetailsState } from "../atoms/BasicDetailsState";
import { Dayjs } from "dayjs";

const BasicDetails = () => {
    let navigate = useNavigate();
    const [_, setStepperState] = useRecoilState(currentStepper);
    const [formState, setFormState] = useRecoilState(basicDetailsState);

    const handleChange = (key: keyof IBasicDetailsState, value: string | Dayjs | null) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <div className="pb-10">
            <div className="px-10 ">
                <h3 className="mb-4 text-lg font-medium leading-none text-gray-900 ">Personal details</h3>
                <div className="grid gap-4 mb-4 sm:grid-cols-4">
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
            </div>
            <div className="px-10 pt-10">
                <h3 className="mb-4 text-lg font-medium leading-none text-gray-900 ">Address details</h3>
                <div className="grid gap-4 mb-4 sm:grid-cols-4">
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
                <CustomButton
                    onClick={() => {
                        setStepperState("Asset Details")
                        navigate("/asset-details")
                    }}
                    label="Next Step: Asset Details"
                />
            </div>
        </div>

    )
}

export default BasicDetails