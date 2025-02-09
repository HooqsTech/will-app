
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IProvidentFundState , providentFundsState} from '../atoms/ProvidentFundsState';
import ProvidentFundForm from '../components/Forms/ProvidentFundForm';

const ProvidentFundAsset = () => {
    const [formState, setFormState] = useRecoilState<IProvidentFundState[]>(providentFundsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addProvidentFundAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                type: "",
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
                            label={`Bank Accounts ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <ProvidentFundForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addProvidentFundAsset} label="Add" />
            </div>
        </div>
    )
    
}

export default ProvidentFundAsset;   