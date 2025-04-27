import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { beneficiariesState, IBeneficiaryState } from "../atoms/BeneficiariesState";
import CustomSelectBar from "../components/CustomSelectBar";
import NextButton from "../components/NextButton";
import { userState } from "../atoms/UserDetailsState";
import { useNavigate } from "react-router";
import { IResiduaryEstateSingleState, ResiduaryEstateSingleState } from "../atoms/ResiduaryEstateSingleState";
import { saveResiduaryAssetDistributionAPI } from "../api/assetDistribution";
import { ROUTE_PATHS } from "../constants";
import DistributionBeneficiary from "../components/DistributionBeneficiary";

const ResiduaryEstateSinglePage = () => {
    const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
    const [distribution, setDistribution] = useRecoilState<IResiduaryEstateSingleState>(ResiduaryEstateSingleState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    // State for selected beneficiary and donation choice
    // const [primaryBeneficiary, setPrimaryBeneficiary] = useState<string | null>(distribution.primaryBeneficiary || null);
    // const [primaryDonation, setPrimaryDonation] = useState<string | null>(distribution.donationItem || null);

    const getFilteredOptions = () =>
        beneficiaryState
            .filter(beneficiary => !beneficiary.isGuardian)
            .map(beneficiary => ({
            value: beneficiary.id,
            label: beneficiary.type === "Person"
                ? beneficiary.firstName + " " + beneficiary.lastName
                : beneficiary.organization,
            }));

    const donationOptions = [
        { value: "already_pledged", label: "Already Pledged" },
        { value: "yes_pledged", label: "Yes, I would like to pledge" },
        { value: "no_pledged", label: "No, I will think about it later" },
    ];

    // Handle selections
    const handleSelectChange = (value: string) => {
        setDistribution((prev) => ({
            ...prev,
            primaryBeneficiary: [value]
          }));
    };

    const handleSelectDonationChange = (value: string) => {
        setDistribution((prev) => ({
            ...prev,
            donationItem: [value]
          }));
    };

    const saveWillDistributionAsync = async () => {
        try {
            if (distribution.primaryBeneficiary.length == 0) return;

            const userId = user.userId;
            await saveResiduaryAssetDistributionAPI(userId, [{ id: distribution.primaryBeneficiary[0], percentage: 100 }]);

        } catch (error) {
            console.error("Error saving beneficiary distribution:", error);
        }
    };

    const handleNextStep = async () => {
        if (step === 1) {
            if (distribution.primaryBeneficiary.length == 0) {
                return;
            }
            setStep(2);
        } else if (step === 2) {
            await saveWillDistributionAsync();
            navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.LIABLITY_DISTRIBUTION);

        }
    };

    return (
        <div className="flex flex-col justify-between px-6 w-full min-h-[calc(100vh-232px)] md:max-w-[560px] md:mx-auto">
            {step === 1 && (
                <>
                    <h2 className="text-xl font-bold mb-5">Who will be inheriting your entire residuary estate?</h2>
                    <div className="mb-5">
                        <CustomSelectBar
                            options={getFilteredOptions()}
                            onSelectChange={handleSelectChange}
                            multiple={false}
                            selectedOptions={distribution.primaryBeneficiary}
                        />
                        <DistributionBeneficiary />
                    </div>
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
            {step === 2 && (
                <>
                    <h2 className="text-xl font-bold mb-5">Would you like to pledge your organs for donation?</h2>
                    <CustomSelectBar
                        options={donationOptions}
                        onSelectChange={handleSelectDonationChange}
                        multiple={false}
                        selectedOptions={distribution.donationItem}
                    />
                    <NextButton onClick={handleNextStep} label="Save & Continue" />
                </>
            )}
        </div>
    );
};

export default ResiduaryEstateSinglePage;
