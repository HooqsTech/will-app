
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { ISafetyDepositBoxState , safetyDepositBoxesState} from '../atoms/SafetyDepositBoxesState';
import SafetyDepositBoxForm from '../components/Forms/SafetyDepositBoxForm';

const SafetyDepositAsset = () => {
    const [formState, setFormState] = useRecoilState<ISafetyDepositBoxState[]>(safetyDepositBoxesState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addSafetyDepositAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                depositBoxType: "",
                bankName: "",
                branch: "",
                city: ""
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
                            label={`Safety Deposit Box ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <SafetyDepositBoxForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addSafetyDepositAsset} label="Add" />
            </div>
        </div>
    )
}

export default SafetyDepositAsset;   