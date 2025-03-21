import { useRecoilState, useRecoilValue } from "recoil";
import { AssetDistributionPercentState } from "../atoms/AssetDistributionPercentState";
import CustomSelectBar from "../components/CustomSelectBar";
import { beneficiariesState, IBeneficiaryState } from "../atoms/BeneficiariesState";
import NextButton from "../components/NextButton";
import { savePercentageAssetDistribution } from "../api/assetDistribution";
import { userState } from '../atoms/UserDetailsState';

const AssetDistributionPercentPage = () => {
  const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
  const user = useRecoilValue(userState);
  const [assetDistribution, setAssetDistribution] = useRecoilState(AssetDistributionPercentState);

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
    setAssetDistribution((prev) => ({
      ...prev,
      firstBeneficiary: prev.firstBeneficiary.includes(value)
        ? prev.firstBeneficiary.filter((option) => option !== value)
        : [...prev.firstBeneficiary, value],
    }));
  };

  const handleInputChange = (value: string, input: string) => {
    setAssetDistribution((prev) => ({
      ...prev,
      additionalInputs: {
        ...prev.additionalInputs,
        [value]: input,
      },
    }));
  };

  const handleBackupBeneficiaryChange = (value: string) => {
    setAssetDistribution((prev) => ({
      ...prev,
      backupBeneficiary: [value],
    }));
  };

  const handleNextStep = async () => {
    if (assetDistribution.step === 1) {
      setAssetDistribution((prev) => ({ ...prev, step: 2 }));
    } else {
      try {
        const userId = user.userId;
        const { firstBeneficiary, additionalInputs, backupBeneficiary } = assetDistribution;
        await savePercentageAssetDistribution(userId, { firstBeneficiary, additionalInputs, backupBeneficiary });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      {assetDistribution.step === 1 && (
        <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
          <h2 className="text-xl font-bold mb-5">
            In what percentage and to whom, do you want to divide your assets amongst your beneficiaries?
          </h2>
          <CustomSelectBar
            options={beneficiaryOptionsFirst}
            onSelectChange={handleFirstSelectChange}
            onInputChange={handleInputChange}
            multiple={true}
            selectedOptions={assetDistribution.firstBeneficiary}
            showAdditionalInput={true}
            onPercentageInput={assetDistribution.additionalInputs}
          />
          <div className="justify-between flex mt-10">
            <NextButton onClick={handleNextStep} label="Save & continue" />
          </div>
        </div>
      )}
      {assetDistribution.step === 2 && (
        <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
          <h2 className="text-xl font-bold mb-5">
            If one of your beneficiaries passes away before you, who should inherit their share of the assets instead?
          </h2>
          <CustomSelectBar
            options={backupBeneficiaryOptions}
            onSelectChange={handleBackupBeneficiaryChange}
            multiple={false}
            selectedOptions={assetDistribution.backupBeneficiary}
          />
          <div className="justify-between flex mt-10">
            <NextButton onClick={handleNextStep} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDistributionPercentPage;
