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
import DistributionBeneficiary from "../components/DistributionBeneficiary";

const ResiduaryEstatePercentPage = () => {
  const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
  
  const [step, setStep] = useState(1);
  const user = useRecoilValue(userState);
  const [residuaryDistribution, setResiduaryDistribution] = useRecoilState(residuaryAssetDistributionState);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const beneficiaryOptionsFirst = beneficiaryState
  .filter(beneficiary => !beneficiary.isGuardian)
  .map(beneficiary => ({
    value: beneficiary.id,
    label: beneficiary.type === "Person" ? beneficiary.fullName : beneficiary.organization,
  }));

  const handleFirstSelectChange = (value: string) => {
    setResiduaryDistribution((prev) => ({
      ...prev,
      firstBeneficiary: prev.firstBeneficiary.includes(value)
        ? prev.firstBeneficiary.filter((option) => option !== value)
        : [...prev.firstBeneficiary, value],
    }));
  };

  const handleInputChange = (value: string, input: string) => {
    setResiduaryDistribution((prev) => ({
      ...prev,
      additionalInputs: {
        ...prev.additionalInputs,
        [value]: input,
      },
    }));
  };

  const handleSelectDonationChange = (value: string) => {
    setResiduaryDistribution((prev) => ({
      ...prev,
      primaryDonation: [value]
    }));
  };

  const donationOptions = [
    { value: "already_pledged", label: "Already Pledged" },
    { value: "yes_pledged", label: "Yes, I would like to pledge" },
    { value: "no_pledged", label: "No, I will think about it later" },
  ];

  const handleNextStep = async () => {
    if (step === 1) {
      let toatlamount = 0;
      for (let key in residuaryDistribution.additionalInputs) {
        toatlamount += parseInt(residuaryDistribution.additionalInputs[key]);
      }
      if(toatlamount!= 100 && residuaryDistribution.firstBeneficiary.length > 1)
      {
        setError(true);
      }
      else
      {
        setStep(2);
      }
      
    } else {
      try {
        setLoading(true);
        const userId = user.userId;
       let beneficiaryDistributionitem = [];
      if (Object.keys(residuaryDistribution.additionalInputs).length === 0 || residuaryDistribution.firstBeneficiary.length === 1) {
          beneficiaryDistributionitem = [
              {
                  id : residuaryDistribution.firstBeneficiary[0],
                  percentage: 100
              }
          ];
      } else {
        beneficiaryDistributionitem = residuaryDistribution.firstBeneficiary.map((id) => ({
          id,
          percentage: Number(residuaryDistribution.additionalInputs[id] || 0),
        }));
      }


      await saveResiduaryAssetDistributionAPI(userId, beneficiaryDistributionitem);

        navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.LIABLITY_DISTRIBUTION);
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
          <div>
            <CustomSelectBar
              options={beneficiaryOptionsFirst}
              onSelectChange={handleFirstSelectChange}
              onInputChange={handleInputChange}
              multiple={true}
              selectedOptions={residuaryDistribution.firstBeneficiary}
              showAdditionalInput={true}
              onPercentageInput={residuaryDistribution.additionalInputs}
            />
            <DistributionBeneficiary />
          </div>
          {error && <p className="mt-3  text-red-500">Please make sure the sum of percentages add up to 100%</p>}
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
            selectedOptions={residuaryDistribution.primaryDonation}
          />
          <NextButton onClick={handleNextStep} label={loading ? "Saving..." : "Save & Continue"} />
        </>
      )}
    </div>
  );
};

export default ResiduaryEstatePercentPage;