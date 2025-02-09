
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IInsuranceDetailState , insuranceDetailsState} from '../atoms/InsuranceDetailsState';
import InsurancePolicyForm from '../components/Forms/InsurancePolicyForm';

const InsurancePolicyAsset = () => {
    const [formState, setFormState] = useRecoilState<IInsuranceDetailState[]>(insuranceDetailsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addInsurancePolicyAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                insuranceType: "",
                insuranceProvider: "",
                policyNumber: ""
            },
        ]);
        setCurrentItem(formState.length)
    };

    const getSubTitle = (index: number) => {
        return ""
    }

    return (
        <div className='flex justify-center w-full'>
            <div className="px-10 w-2xl">
                {
                    formState.map((_, index) => (
                        <CustomAccordion expanded={currentItem === index}
                            onChange={() => setCurrentItem((prevItem) => prevItem === index ? -1 : index)}
                            label={`Insurance Policy ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <InsurancePolicyForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addInsurancePolicyAsset} label="Add" />
            </div>
        </div>
    )
}

export default InsurancePolicyAsset;   