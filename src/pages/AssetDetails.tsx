import { useNavigate } from "react-router";
import CustomTextBox from "../components/CustomTextBox"
import CustomButton from "../components/CustomButton";
import { currentStepper } from "../atoms/StepperState";
import { useRecoilState } from "recoil";

const AssetDetails = () => {
    let navigate = useNavigate();
    const [_, setStepperState] = useRecoilState(currentStepper);

    return (
        <div className="px-10 ">
            <h3 className="mb-4 text-lg font-medium leading-none text-gray-900 ">Asset details</h3>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <CustomTextBox label="Fist Name" type="text" />
                <CustomTextBox label="Last Name" type="text" />
            </div>
            <CustomButton
                onClick={() => {
                    setStepperState("Asset Details")
                    navigate("/asset-details")
                }}
                label="Next Step: Asset Details"
            />
        </div>
    )
}

export default AssetDetails