import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { beneficiariesState, IBeneficiaryState } from "../atoms/BeneficiariesState";
import { AssetDistributionSingleState, IAssetDistributionSingleState } from "../atoms/AssetDistributionSingleState";
import CustomSelectBar from "../components/CustomSelectBar";
import NextButton from "../components/NextButton";
import { saveSingleBeneficiaryAssetDistribution } from "../api/assetDistribution";
import { userState } from "../atoms/UserDetailsState";
import { useNavigate } from "react-router";

const AssetDistributionSinglePage = () => {
    const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
    const [distribution, setDistribution] = useRecoilState<IAssetDistributionSingleState>(AssetDistributionSingleState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    // State for beneficiaries
    const [primaryBeneficiary, setPrimaryBeneficiary] = useState<string[]>(distribution.primaryBeneficiary ? [distribution.primaryBeneficiary] : []);
    const [secondaryBeneficiary, setSecondaryBeneficiary] = useState<string[]>(distribution.secondaryBeneficiary ? [distribution.secondaryBeneficiary] : []);
    const [tertiaryBeneficiary, setTertiaryBeneficiary] = useState<string[]>(distribution.tertiaryBeneficiary ? [distribution.tertiaryBeneficiary] : []);

    const getFilteredOptions = (excludedIds: string[]) => 
        beneficiaryState
            .filter(beneficiary => !excludedIds.includes(beneficiary.id))
            .map(beneficiary => ({ value: beneficiary.id, label: beneficiary.fullName }));

    // Handle selections
    const handleSelectChange = (setBeneficiary: (value: string[]) => void, value: string) => {
        setBeneficiary([value]);
    };

    const saveWillDistributionAsync = async () => {
        const updatedDistribution = {
            ...distribution,
            userId: user.userId,
            primaryBeneficiary: primaryBeneficiary[0] || null,
            secondaryBeneficiary: secondaryBeneficiary[0] || null,
            tertiaryBeneficiary: tertiaryBeneficiary[0] || null,
        };

        try {
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
        if ((step === 1 && !primaryBeneficiary.length) || 
            (step === 2 && !secondaryBeneficiary.length) || 
            (step === 3 && !tertiaryBeneficiary.length)) {
            alert("Please select a beneficiary before proceeding.");
            return;
        }

        if (step === 3) {
            await saveWillDistributionAsync();
            navigate("/next-route");
        } else {
            setStep(prevStep => prevStep + 1);
        }
    };

    return (
        <div className="flex flex-col justify-between px-6 w-full min-h-[calc(100vh-232px)] md:max-w-[560px] md:mx-auto">
            {step === 1 && (
                <>
                    <h2 className="text-xl font-bold mb-5">Who will inherit all of your assets?</h2>
                    <CustomSelectBar
                        options={getFilteredOptions([])}
                        onSelectChange={(value) => handleSelectChange(setPrimaryBeneficiary, value)}
                        multiple={false}
                        selectedOptions={primaryBeneficiary}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
            {step === 2 && (
                <>
                    <h2 className="text-xl font-bold mb-5">If {primaryBeneficiary.length ? beneficiaryState.find(b => b.id === primaryBeneficiary[0])?.fullName : "your primary beneficiary"} passes away, who should inherit?</h2>
                    <CustomSelectBar
                        options={getFilteredOptions(primaryBeneficiary)}
                        onSelectChange={(value) => handleSelectChange(setSecondaryBeneficiary, value)}
                        multiple={false}
                        selectedOptions={secondaryBeneficiary}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
            {step === 3 && (
                <>
                    <h2 className="text-xl font-bold mb-5">Let’s add a tertiary beneficiary</h2>
                    <p>The tertiary beneficiary will inherit your estate if both previous beneficiaries pass away.</p>
                    <CustomSelectBar
                        options={getFilteredOptions([...primaryBeneficiary, ...secondaryBeneficiary])}
                        onSelectChange={(value) => handleSelectChange(setTertiaryBeneficiary, value)}
                        multiple={false}
                        selectedOptions={tertiaryBeneficiary}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
        </div>
    );
};

export default AssetDistributionSinglePage;
