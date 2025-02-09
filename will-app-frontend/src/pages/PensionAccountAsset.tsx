import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IPensionAccountState , pensionAccountsState} from '../atoms/PensionAccountsState';
import PensionAccountForm from '../components/Forms/PensionAccountForm';

const PensionAccountAsset = () => {
    const [formState, setFormState] = useRecoilState<IPensionAccountState[]>(pensionAccountsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addPensionAccountAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                schemeName: "",
                bankName: "",
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
                                <PensionAccountForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addPensionAccountAsset} label="Add" />
            </div>
        </div>
    )
    
}

export default PensionAccountAsset;   