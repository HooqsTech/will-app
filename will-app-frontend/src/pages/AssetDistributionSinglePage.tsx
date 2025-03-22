import { useRecoilState, useRecoilValue } from "recoil";
import { beneficiariesState, IBeneficiaryState } from "../atoms/BeneficiariesState";
import { AssetDistributionSingleState, IAssetDistributionSingleState } from "../atoms/AssetDistributionSingleState";
import CustomSelectBar from "../components/CustomSelectBar";
import NextButton from "../components/NextButton";
import { saveSingleBeneficiaryAssetDistribution } from "../api/assetDistribution";
import { userState } from "../atoms/UserDetailsState";
import { useNavigate } from "react-router";
import { ROUTE_PATHS } from "../constants";

const AssetDistributionSinglePage = () => {
    const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
    const [distribution, setDistribution] = useRecoilState<IAssetDistributionSingleState>(AssetDistributionSingleState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();

    const getFilteredOptions = (excludedIds: string[]) => 
        beneficiaryState
            .filter(beneficiary => !excludedIds.includes(beneficiary.id))
            .map(beneficiary => ({ value: beneficiary.id, label: beneficiary.fullName }));

    const handleSelectChange = (field: keyof IAssetDistributionSingleState, value: string) => {
        setDistribution(prev => ({ ...prev, [field]: value }));
    };

    const saveWillDistributionAsync = async () => {
        try {
            const updatedDistribution = { ...distribution, userId: user.userId };
            const savedData = await saveSingleBeneficiaryAssetDistribution(updatedDistribution);
            if (savedData) {
                setDistribution(prev => ({
                    ...prev,
                    id: savedData.id,
                    primaryBeneficiary: savedData.primaryBeneficiary,
                    secondaryBeneficiary: savedData.secondaryBeneficiary,
                    tertiaryBeneficiary: savedData.tertiaryBeneficiary,
                }));
            }
        } catch (error) {
            console.error("Error saving beneficiary distribution:", error);
        }
    };

    const handleNextStep = async () => {
        if ((distribution.step === 1 && !distribution.primaryBeneficiary) || 
            (distribution.step === 2 && !distribution.secondaryBeneficiary) || 
            (distribution.step === 3 && !distribution.tertiaryBeneficiary)) {
            alert("Please select a beneficiary before proceeding.");
            return;
        }

        if (distribution.step === 3) {
            await saveWillDistributionAsync();
            navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.RESIDUARY_SELECTION);
        } else {
            setDistribution(prev => ({ ...prev, step: prev.step + 1 }));
        }
    };

    return (
        <div className="flex flex-col justify-between px-6 w-full min-h-[calc(100vh-232px)] md:max-w-[560px] md:mx-auto">
            {distribution.step === 1 && (
                <>
                    <h2 className="text-xl font-bold mb-5">Who will inherit all of your assets?</h2>
                    <CustomSelectBar
                        options={getFilteredOptions([])}
                        onSelectChange={(value) => handleSelectChange("primaryBeneficiary", value)}
                        multiple={false}
                        selectedOptions={distribution.primaryBeneficiary ? [distribution.primaryBeneficiary] : []}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
            {distribution.step === 2 && (
                <>
                    <h2 className="text-xl font-bold mb-5">If {distribution.primaryBeneficiary ? beneficiaryState.find(b => b.id === distribution.primaryBeneficiary)?.fullName : "your primary beneficiary"} passes away, who should inherit?</h2>
                    <CustomSelectBar
                        options={getFilteredOptions([distribution.primaryBeneficiary || ""])}
                        onSelectChange={(value) => handleSelectChange("secondaryBeneficiary", value)}
                        multiple={false}
                        selectedOptions={distribution.secondaryBeneficiary ? [distribution.secondaryBeneficiary] : []}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
            {distribution.step === 3 && (
                <>
                    <h2 className="text-xl font-bold mb-5">Let’s add a tertiary beneficiary</h2>
                    <p>The tertiary beneficiary will inherit your estate if both previous beneficiaries pass away.</p>
                    <CustomSelectBar
                        options={getFilteredOptions([distribution.primaryBeneficiary || "", distribution.secondaryBeneficiary || ""])}
                        onSelectChange={(value) => handleSelectChange("tertiaryBeneficiary", value)}
                        multiple={false}
                        selectedOptions={distribution.tertiaryBeneficiary ? [distribution.tertiaryBeneficiary] : []}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
        </div>
    );
};

export default AssetDistributionSinglePage;