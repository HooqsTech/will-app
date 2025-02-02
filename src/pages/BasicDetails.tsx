import { useNavigate } from "react-router";
import CustomTextBox from "../components/CustomTextBox";
import CustomButton from "../components/CustomButton";
import { useRecoilState } from "recoil";
import { currentStepper } from "../atoms/StepperState";
import CustomSelect from "../components/CustomSelect";
import CustomDatePicker from "../components/CustomDatePicker";

const BasicDetails = () => {
    let navigate = useNavigate();
    const [_, setStepperState] = useRecoilState(currentStepper);

    return (
        <div className="pb-10">
            <div className="px-10 ">
                <h3 className="mb-4 text-lg font-medium leading-none text-gray-900 ">Personal details</h3>
                <div className="grid gap-4 mb-4 sm:grid-cols-4">
                    <CustomTextBox label="Full Name" type="text" />
                    <CustomTextBox label="Father Name" type="text" />
                    <CustomSelect label="Gender" options={["Male", "Female", "Others"]} value="" onChange={() => { }} />
                    <CustomDatePicker label="DOB" />
                    <CustomSelect label="Religion" options={["Hindu", "Muslim", "Christian", "Others"]} value="" onChange={() => { }} />
                    <CustomTextBox label="Aadhaar Number" type="text" />
                </div>
            </div>
            <div className="px-10 pt-10">
                <h3 className="mb-4 text-lg font-medium leading-none text-gray-900 ">Address details</h3>
                <div className="grid gap-4 mb-4 sm:grid-cols-4">
                    <CustomTextBox label="Email" type="email" />
                    <CustomTextBox label="Phone Number" type="text" />
                    <CustomTextBox label="Address 1" type="text" />
                    <CustomTextBox label="Address 2" type="text" />
                    <CustomTextBox label="Pincode" type="text" />
                    <CustomTextBox label="City" type="text" />
                    <CustomTextBox label="State" type="text" />
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