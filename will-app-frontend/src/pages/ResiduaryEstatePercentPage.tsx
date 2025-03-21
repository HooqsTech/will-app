import { useState } from "react";
import CustomSelectBar from "../components/CustomSelectBar";
import { useRecoilState, useRecoilValue } from "recoil";
import { beneficiariesState, IBeneficiaryState } from "../atoms/BeneficiariesState";
import NextButton from "../components/NextButton";
import { userState } from '../atoms/UserDetailsState';
import { residuaryAssetDistributionState } from "../atoms/ResiduaryAssetDistribution";
import { saveResiduaryAssetDistributionAPI } from "../api/assetDistribution";
import { ROUTE_PATHS } from "../constants";
import { useNavigate } from "react-router";

const ResiduaryEstatePercentPage = () => {
  const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
  const [firstBeneficiary, setFirstBeneficiary] = useState<string[]>([]);
  const [additionalInputs, setAdditionalInputs] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const user = useRecoilValue(userState);
  const [primaryDonation, setPrimaryDonation] = useState<string[]>([]);
  const [_, setResiduaryDistribution] = useRecoilState(residuaryAssetDistributionState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const beneficiaryOptionsFirst = beneficiaryState.map((beneficiary) => ({
    value: beneficiary.id,
    label: beneficiary.fullName,
  }));

  const handleFirstSelectChange = (value: string) => {
    setFirstBeneficiary((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((option) => option !== value)
        : [...prevSelected, value]
    );
  };

  const handleInputChange = (value: string, input: string) => {
    setAdditionalInputs((prevInputs) => ({
      ...prevInputs,
      [value]: input,
    }));
  };

  const handleSelectDonationChange = (value: string) => {
    setPrimaryDonation([value]);
  };

  const donationOptions = [
    { value: "already_pledged", label: "Already Pledged" },
    { value: "yes_pledged", label: "Yes, I would like to pledge" },
    { value: "no_pledged", label: "No, I will think about it later" },
  ];

  const handleNextStep = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      try {
        setLoading(true);
        const userId = user.userId;

        // Prepare the beneficiary list with percentages
        const beneficiariesWithPercentage = firstBeneficiary.map((id) => ({
          id,
          percentage: Number(additionalInputs[id] || 0),
        }));

        const updatedData = await saveResiduaryAssetDistributionAPI(userId, beneficiariesWithPercentage);

        // Update Recoil state with API response
        setResiduaryDistribution(updatedData);

        navigate(ROUTE_PATHS.MY_PLAN);
      } catch (error) {
        console.error("Failed to save residuary distribution.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {step === 1 && (
        <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
          <h2 className="text-xl font-bold mb-5">
            In what percentage and to whom, do you want to divide your assets amongst your beneficiaries?
          </h2>
          <CustomSelectBar
            options={beneficiaryOptionsFirst}
            onSelectChange={handleFirstSelectChange}
            onInputChange={handleInputChange}
            multiple={true}
            selectedOptions={firstBeneficiary}
            showAdditionalInput={true}
            onPercentageInput={additionalInputs}
          />
          <div className="justify-between flex mt-10">
            <NextButton
              onClick={handleNextStep}
              label="Save & continue"
            />
          </div>
        </div>
      )}
      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-5">Would you like to pledge your organs for donation?</h2>
          <CustomSelectBar
            options={donationOptions}
            onSelectChange={(value) => handleSelectDonationChange(value)}
            multiple={false}
            selectedOptions={primaryDonation}
          />
          <NextButton onClick={handleNextStep} label={loading ? "Saving..." : "Save & Continue"} />
        </>
      )}
    </div>
  );
};

export default ResiduaryEstatePercentPage;