
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import FixedDepositForm from '../components/Forms/FixedDepositForm';
import { useState } from 'react';
import { IFixedDepositState , fixedDepositsState} from '../atoms/FixedDepositState';

const FixedDepositAsset = () => {
    const [formState, setFormState] = useRecoilState<IFixedDepositState[]>(fixedDepositsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addFixedDepositAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                noOfHolders: "",
                accountNumber: "",
                bankName: "",
                branch: "",
                city: ""
            },
        ]);
        setCurrentItem(formState.length)
    };

    const getSubTitle = (index: number) => {
        const { bankName, branch, accountNumber } = formState[index];

        const firstLine = bankName?.trim() || "";
        const secondLine = [accountNumber?.trim(), branch?.trim()].filter(Boolean).join(" - ");
      
        return [firstLine, secondLine].filter(Boolean).join("\n");
    }

    return (
        <div className='flex justify-center w-full'>
            <div className="px-10 w-2xl">
                {
                    formState.map((_, index) => (
                        <CustomAccordion expanded={currentItem === index}
                            onChange={() => setCurrentItem((prevItem) => prevItem === index ? -1 : index)}
                            label={`Fixed Deposits ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <FixedDepositForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addFixedDepositAsset} label="Add" />
            </div>
        </div>
    )
}

export default FixedDepositAsset;   