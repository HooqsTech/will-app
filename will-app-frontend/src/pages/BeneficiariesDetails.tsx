import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { beneficiariesState, IBeneficiaryState } from '../atoms/BeneficiariesState';
import BeneficiaryForm from '../components/Forms/BeneficiaryForm';
import { IBeneficiary } from '../models/beneficiary';
import { upsertBeneficiary } from '../api/beneficiary';

const BeneficiariesPage = () => {
    const [formState, setFormState] = useRecoilState<IBeneficiaryState[]>(beneficiariesState);
    const [currentItem, setCurrentItem] = useState<number>(0);

    const addItem = () => {
        var data: IBeneficiary = {
            userid: 1,
            type: "beneficiaries",
            subtype: '',
            data: { ...formState, "beneficiaryId": 123 }
        }

        upsertBeneficiary(data);

        setFormState((prevState) => [
            ...prevState,
            {
                type: "",
                fullName: "",
                gender: "",
                dateOfBirth: null,
                email: "",
                phone: "",
                relationship: "",
                charityType: "",
                organization: "",
                otherOrganization: "",
                donationAmount: null,
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
                            label={`Beneficiary ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <BeneficiaryForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addItem} label="Add" />
            </div>
        </div>
    )
}

export default BeneficiariesPage   