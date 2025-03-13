import { useState } from "react";
import CustomSelectBar from "../components/CustomSelectBar";
import { useRecoilValue } from "recoil";
import { beneficiariesState, IBeneficiaryState } from "../atoms/BeneficiariesState";
import NextButton from "../components/NextButton";

const AssetDistributionSinglePage = () => {
  
    const beneficiaryState = useRecoilValue<IBeneficiaryState[]>(beneficiariesState);
    const [firstBeneficiary, setFirstBeneficiary] = useState<string[]>([]);
    const [secondBeneficiary, setSecondBeneficiary] = useState<string[]>([]);
    const [thirdBeneficiary, setThirdBeneficiary] = useState<string[]>([]);
    const [step, setStep] = useState(1);

    const beneficiaryOptionsFirst = beneficiaryState.map((beneficiary) => ({
      value: beneficiary.id,
      label: beneficiary.fullName,
    }));
    
    const beneficiaryOptionsSecond = beneficiaryState
      .filter((beneficiary) => !firstBeneficiary.includes(beneficiary.id))
      .map((beneficiary) => ({
        value: beneficiary.id,
        label: beneficiary.fullName,
      }));
    
    const beneficiaryOptionsThird = beneficiaryState
      .filter(
        (beneficiary) =>
          !firstBeneficiary.includes(beneficiary.id) &&
          !secondBeneficiary.includes(beneficiary.id)
      )
      .map((beneficiary) => ({
        value: beneficiary.id,
        label: beneficiary.fullName,
      }));

  const handleFirstSelectChange = (value: string) => {
    
    setFirstBeneficiary([value]);
  };
  const handleSecondSelectChange = (value: string) => {
    
    setSecondBeneficiary([value]);
  };
  const handleThirdSelectChange = (value: string) => {
    
    setThirdBeneficiary([value]);
  };
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  
  return (
    <div>
      {step == 1 && (
      <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
        <h2 className="text-xl font-bold mb-5">Who will inherit all of your assets?</h2>
        <CustomSelectBar
          options={beneficiaryOptionsFirst}
          onSelectChange={handleFirstSelectChange}
          multiple={false}
          selectedOptions={firstBeneficiary}
        />
        <div className="flex mt-10 w-full gap-16">
        <NextButton className="bg-blue-600 text-white px-21 py-2 rounded-lg hover:bg-blue-700" onClick={handleNextStep} label="Save & continue"/>
        </div>
      </div>)}
      {step == 2 && (
      <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
        <h2 className="text-xl font-bold mb-5">If dsfref passes away before you, who should the inheritance be passed on to?</h2>
        <CustomSelectBar
          options={beneficiaryOptionsSecond}
          onSelectChange={handleSecondSelectChange}
          multiple={false}
          selectedOptions={secondBeneficiary}
        />
        <div className="flex mt-10 w-full gap-16">
        <NextButton className="bg-blue-600 text-white px-21 py-2 rounded-lg hover:bg-blue-700" onClick={handleNextStep} label="Save & continue"/>
        </div>
      </div>
      )}
      {step == 3 && (
      <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
        <h2 className="text-xl font-bold mb-5">Let’s add a tertiary beneficiary</h2>
        <p>The tertiary beneficiary will inherit your entire estate in the unlikely event that both your selected beneficiaries pass away before you.</p>
        <CustomSelectBar
          options={beneficiaryOptionsThird}
          onSelectChange={handleThirdSelectChange}
          multiple={false}
          selectedOptions={thirdBeneficiary}
        />
        <div className="flex mt-10 w-full gap-16">
            <NextButton className="bg-blue-600 text-white px-21 py-2 rounded-lg hover:bg-blue-700" onClick={handleNextStep} label="Save & continue"/>
        </div>
      </div>
      )}
    </div>
  );
}

export default AssetDistributionSinglePage;