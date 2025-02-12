
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import BankAccountForm from '../components/Forms/BankAccountForm';
import { useState } from 'react';
import { IBankDetailsState , bankDetailsState} from '../atoms/BankDetailsState';

const BankAccountAsset = () => {
    const [formState, setFormState] = useRecoilState<IBankDetailsState[]>(bankDetailsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addBankDetailAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                accountType: "",
                accountNumber: "",
                bankName: "",
                branch: "",
                city: ""
            },
        ]);
        setCurrentItem(formState.length)
    };

    const getSubTitle = (index: number) => {
        const { bankName, accountType, accountNumber } = formState[index];

        const firstLine = bankName?.trim() || "";
        const secondLine = [accountType?.trim(), accountNumber?.trim()].filter(Boolean).join(" - ");
      
        return [firstLine, secondLine].filter(Boolean).join("\n");
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
                                <BankAccountForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addBankDetailAsset} label="Add" />
            </div>
        </div>
    )
}

export default BankAccountAsset;   