import { useState } from "react";
import CustomSelectBar from "../components/CustomSelectBar";
import { useRecoilValue } from "recoil";
import { beneficiariesState, IBeneficiaryState } from "../atoms/BeneficiariesState";
import NextButton from "../components/NextButton";
import { savePercentageAssetDistribution } from "../api/assetDistribution";
import { userState } from '../atoms/UserDetailsState';

const AssetDistributionPercentPage = () => {
  const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
  const [firstBeneficiary, setFirstBeneficiary] = useState<string[]>([]);
  const [backupBeneficiary, setBackupBeneficiary] = useState<string[]>([]);
  const [additionalInputs, setAdditionalInputs] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const user = useRecoilValue(userState);

  const backupBeneficiaryOptions = [
    { value: "spouse_children", label: "Their spouse and/or children" },
    { value: "equal_split", label: "Split between remaining beneficiaries equally" },
    { value: "percentage_split", label: "Split between remaining beneficiaries according to their previously mentioned percentages" },
  ];

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

  const handleBackupBeneficiaryChange = (value: string) => {
    setBackupBeneficiary([value]);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      try {
        const userId = user.userId;
        const beneficiaryData = {
          firstBeneficiary,
          additionalInputs,
          backupBeneficiary,
        };
  
        await savePercentageAssetDistribution(userId, beneficiaryData);
      } catch (error) {
        console.log(error);
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
        <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
          <h2 className="text-xl font-bold mb-5">
            If one of your beneficiaries passes away before you, who should inherit their share of the assets instead?
          </h2>
          <CustomSelectBar
            options={backupBeneficiaryOptions}
            onSelectChange={handleBackupBeneficiaryChange}
            multiple={false}
            selectedOptions={backupBeneficiary}
          />
          <div className="justify-between flex mt-10">
            <NextButton
              onClick={handleNextStep}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDistributionPercentPage;
