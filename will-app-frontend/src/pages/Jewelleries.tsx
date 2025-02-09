
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IJewelleryState, jewelleriesState } from '../atoms/JewelleriesState';
import JewelleryForm from '../components/Forms/JewelleryForm';

const Jewelleries = () => {
    const [formState, setFormState] = useRecoilState<IJewelleryState[]>(jewelleriesState);
    const [currentItem, setCurrentItem] = useState<number>(0);

    const addItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                type: "",
                description: "",
                preciousMetalInWeight: ""
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
                            label={`Jewellery ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <JewelleryForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addItem} label="Add" />
            </div>
        </div>
    )
}

export default Jewelleries   