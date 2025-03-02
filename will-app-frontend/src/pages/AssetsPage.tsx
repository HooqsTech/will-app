import { useRecoilState, useRecoilValue } from "recoil"
import CustomAccordion from "../components/CustomAccordion"
import { ISelectedAssetsState, selectedAssetsState } from "../atoms/SelectedAssetsState"
import CheckboxContainer from "../components/CheckboxContainer";
import NextButton from "../components/NextButton";
import { addSelectedAssetsAsync } from "../api/asset";
import { useState } from "react";
import { userState } from "../atoms/UserDetailsState";
import { routesState } from "../atoms/RouteState";
import { useNavigate, useNavigation } from "react-router";

const AssetsPage = () => {
    const [selectedAssets, setSelectedAssets] = useRecoilState(selectedAssetsState);
    const user = useRecoilValue(userState);
    const [loading, setLoading] = useState<boolean>(false);
    const routeData = useRecoilValue(routesState);
    const navigate = useNavigate();

    console.log('selectedAssets', selectedAssets)

    const handleChange = (key: keyof ISelectedAssetsState) => {
        setSelectedAssets((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    }

    const handleOnClick = async () => {
        // SAVE PERSONAL DETAILS
        setLoading(true);
        const result = await addSelectedAssetsAsync(selectedAssets, user.userId);
        setLoading(false);

        // NAVIGATE TO ADDRESS DETAILS
        if (result.bankAccounts === selectedAssets.bankAccounts) {
            navigate("/properties");
        }
    }

    return (
        <div className="w-xl h-full">
            <div>
                <CustomAccordion defaultExpanded label="Immovable Assets">
                    <CheckboxContainer checked={selectedAssets?.properties} label="Properties" onChange={() => handleChange("properties")} />
                </CustomAccordion>
                <CustomAccordion defaultExpanded label="Financial Assets">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer checked={selectedAssets?.bankAccounts} label="Bank Accounts" onChange={() => handleChange("bankAccounts")} />
                        <CheckboxContainer checked={selectedAssets?.fixedDeposits} label="Fixed Deposits" onChange={() => handleChange("fixedDeposits")} />
                        <CheckboxContainer checked={selectedAssets?.insurancePolicies} label="Insurance Policies" onChange={() => handleChange("insurancePolicies")} />
                        <CheckboxContainer checked={selectedAssets?.safetyDepositBoxes} label="Safety Deposit Boxes/Lockers" onChange={() => handleChange("safetyDepositBoxes")} />
                        <CheckboxContainer checked={selectedAssets?.dematAccounts} label="DEMAT accounts" onChange={() => handleChange("dematAccounts")} />
                        <CheckboxContainer checked={selectedAssets?.mutualFunds} label="Mutual Funds" onChange={() => handleChange("mutualFunds")} />
                        <CheckboxContainer checked={selectedAssets?.providentFunds} label="Provident Funds" onChange={() => handleChange("providentFunds")} />
                        <CheckboxContainer checked={selectedAssets?.pensionAccounts} label="Pension Accounts" onChange={() => handleChange("pensionAccounts")} />
                    </div>
                </CustomAccordion>
                <CustomAccordion defaultExpanded label="Business Assets">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer checked={selectedAssets?.businesses} label="Businesses" onChange={() => handleChange("businesses")} />
                        <CheckboxContainer checked={selectedAssets?.bonds} label="Bonds" onChange={() => handleChange("bonds")} />
                        <CheckboxContainer checked={selectedAssets?.debentures} label="Debentures" onChange={() => handleChange("debentures")} />
                        <CheckboxContainer checked={selectedAssets?.esops} label="ESOPs" onChange={() => handleChange("esops")} />
                        <CheckboxContainer checked={selectedAssets?.otherInvestments} label="Other investments" onChange={() => handleChange("otherInvestments")} />
                    </div>
                </CustomAccordion>
                <CustomAccordion defaultExpanded label="Other Assets">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer checked={selectedAssets?.vehicles} label="vehicles" onChange={() => handleChange("vehicles")} />
                        <CheckboxContainer checked={selectedAssets?.jewellery} label="Jewellery" onChange={() => handleChange("jewellery")} />
                        <CheckboxContainer checked={selectedAssets?.digitalAssets} label="Digital Assets" onChange={() => handleChange("digitalAssets")} />
                        <CheckboxContainer checked={selectedAssets?.intellectualProperties} label="Intellectual Properties" onChange={() => handleChange("intellectualProperties")} />
                        <CheckboxContainer checked={selectedAssets?.customAssets} label="Custom Assets" onChange={() => handleChange("customAssets")} />
                    </div>
                </CustomAccordion>
            </div>
            <NextButton loading={loading} onClick={handleOnClick} label="Save & Next" />
        </div>
    )
}

export default AssetsPage