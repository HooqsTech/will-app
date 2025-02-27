import { useNavigate } from "react-router";
import CustomButton from "../components/CustomButton";
import { currentStepper } from "../atoms/StepperState";
import { useRecoilState } from "recoil";
import CustomAccordion from "../components/CustomAccordion";
import PropertiesPage from "./PropertiesPage";
import CustomTabs from "../components/CustomTabs";

const AssetDetails = () => {
    let navigate = useNavigate();
    const [_, setStepperState] = useRecoilState(currentStepper);

    return (
        <div className="px-10">
            <CustomTabs
                tabItems={
                    [
                        {
                            label: "Immovable Assets",
                            value: "immovable-assets",
                            children: <PropertiesPage />
                        },
                        {
                            label: "Immovable Assets",
                            value: "immovable-assets1",
                            children: <PropertiesPage />
                        },
                        {
                            label: "Immovable Assets",
                            value: "immovable-assets2",
                            children: <PropertiesPage />
                        },
                        {
                            label: "Immovable Assets",
                            value: "immovable-assets3",
                            children: <PropertiesPage />
                        }
                    ]
                }
            />
            {/* <div className="pt-10">
                <CustomButton
                    onClick={() => {
                        setStepperState("Asset Details")
                        navigate("/asset-details")
                    }}
                    label="Next Step: Asset Details"
                />
            </div> */}
        </div>
    )
}

export default AssetDetails