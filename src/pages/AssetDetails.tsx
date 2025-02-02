import { useNavigate } from "react-router";
import CustomButton from "../components/CustomButton";
import { currentStepper } from "../atoms/StepperState";
import { useRecoilState } from "recoil";
import CustomAccordion from "../components/CustomAccordion";
import CustomTextBox from "../components/CustomTextBox";
import CustomSelect from "../components/CustomSelect";
import { Dayjs } from "dayjs";
import { IImmovableAssetState, immovableAssetsState } from "../atoms/ImmovableAssetsState";
import ImmovableAssets from "../components/ImmovableAssets";

const AssetDetails = () => {
    let navigate = useNavigate();
    const [_, setStepperState] = useRecoilState(currentStepper);

    return (
        <div className="px-10">
            <CustomAccordion children={<ImmovableAssets />} label="Immovable Assets" />
            <div className="pt-10">
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

export default AssetDetails