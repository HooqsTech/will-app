import { useRecoilState, useRecoilValue } from "recoil"
import CustomAccordion from "../components/CustomAccordion"
import { ISelectedAssetsState, selectedAssetsState } from "../atoms/SelectedAssetsState"
import CheckboxContainer from "../components/CheckboxContainer";
import NextButton from "../components/NextButton";
import { addSelectedAssetsAsync } from "../api/asset";
import { useState } from "react";
import { userState } from "../atoms/UserDetailsState";

const AssetsPage = () => {
    const [selectedAssets, setSelectedAssets] = useRecoilState(selectedAssetsState);
    const user = useRecoilValue(userState);
    const [loading, setLoading] = useState<boolean>(false);

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
        // if (result.userName === personalDetails.userName) {
        //     navigate("/address_details");
        // }
    }

    return (
        <div className="w-xl h-full">
            <div>
                <CustomAccordion defaultExpanded label="Immovable Assets">
                    <CheckboxContainer checked={selectedAssets?.hasProperties} label="Properties" onChange={() => handleChange("hasProperties")} />
                </CustomAccordion>
                <CustomAccordion defaultExpanded label="Financial Assets">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer checked={selectedAssets?.hasBankAccounts} label="Bank Accounts" onChange={() => handleChange("hasBankAccounts")} />
                        <CheckboxContainer checked={selectedAssets?.hasFixedDeposits} label="Fixed Deposits" onChange={() => handleChange("hasFixedDeposits")} />
                        <CheckboxContainer checked={selectedAssets?.hasInsurancePolicies} label="Insurance Policies" onChange={() => handleChange("hasInsurancePolicies")} />
                        <CheckboxContainer checked={selectedAssets?.hasSafetyDepositBoxes} label="Safety Deposit Boxes/Lockers" onChange={() => handleChange("hasSafetyDepositBoxes")} />
                        <CheckboxContainer checked={selectedAssets?.hasDematAccounts} label="DEMAT accounts" onChange={() => handleChange("hasDematAccounts")} />
                        <CheckboxContainer checked={selectedAssets?.hasMutualFunds} label="Mutual Funds" onChange={() => handleChange("hasMutualFunds")} />
                        <CheckboxContainer checked={selectedAssets?.hasProvidentFunds} label="Provident Funds" onChange={() => handleChange("hasProvidentFunds")} />
                        <CheckboxContainer checked={selectedAssets?.hasPensionAccounts} label="Pension Accounts" onChange={() => handleChange("hasPensionAccounts")} />
                    </div>
                </CustomAccordion>
                <CustomAccordion defaultExpanded label="Business Assets">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer checked={selectedAssets?.hasBusinesses} label="Businesses" onChange={() => handleChange("hasBusinesses")} />
                        <CheckboxContainer checked={selectedAssets?.hasBonds} label="Bonds" onChange={() => handleChange("hasBonds")} />
                        <CheckboxContainer checked={selectedAssets?.hasDebentures} label="Debentures" onChange={() => handleChange("hasDebentures")} />
                        <CheckboxContainer checked={selectedAssets?.hasEsops} label="ESOPs" onChange={() => handleChange("hasEsops")} />
                        <CheckboxContainer checked={selectedAssets?.hasOtherInvestments} label="Other investments" onChange={() => handleChange("hasOtherInvestments")} />
                    </div>
                </CustomAccordion>
                <CustomAccordion defaultExpanded label="Other Assets">
                    <div className="flex flex-col gap-2">
                        <CheckboxContainer checked={selectedAssets?.hasVehicles} label="vehicles" onChange={() => handleChange("hasVehicles")} />
                        <CheckboxContainer checked={selectedAssets?.hasJewellery} label="Jewellery" onChange={() => handleChange("hasJewellery")} />
                        <CheckboxContainer checked={selectedAssets?.hasDigitalAssets} label="Digital Assets" onChange={() => handleChange("hasDigitalAssets")} />
                        <CheckboxContainer checked={selectedAssets?.hasIntellectualProperties} label="Intellectual Properties" onChange={() => handleChange("hasIntellectualProperties")} />
                        <CheckboxContainer checked={selectedAssets?.hasCustomAssets} label="Custom Assets" onChange={() => handleChange("hasCustomAssets")} />
                    </div>
                </CustomAccordion>
            </div>
            <NextButton loading={loading} onClick={handleOnClick} label="Save & Next" />
        </div>
    )
}

export default AssetsPage