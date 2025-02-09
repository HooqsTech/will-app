
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IDematAccountState , dematAccountsState} from '../atoms/DematAccountsState';
import DematAccountForm from '../components/Forms/DematAccountForm';

const DematAccountAsset = () => {
    const [formState, setFormState] = useRecoilState<IDematAccountState[]>(dematAccountsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addDematAccountAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                brokerName: "",
                accountNumber: ""
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
                                <DematAccountForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addDematAccountAsset} label="Add" />
            </div>
        </div>
    )
    
}

export default DematAccountAsset;   