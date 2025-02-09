
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IMutualFundState , mutualFundsState} from '../atoms/MutualFundsState';
import MutualFundForm from '../components/Forms/MutualFundForm';

const MutualFundAsset = () => {
    const [formState, setFormState] = useRecoilState<IMutualFundState[]>(mutualFundsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addMutualFundAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                noOfHolders: "",
                fundName: "",
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
                            label={`Mutual Fund ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <MutualFundForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addMutualFundAsset} label="Add" />
            </div>
        </div>
    )
    
}

export default MutualFundAsset;   