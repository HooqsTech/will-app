
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IIntellectualPropertyState, intellectualPropertiesState } from '../atoms/IntellectualPropertiesState';
import IntellectualPropertyForm from '../components/Forms/IntellectualPropertyForm';

const IntellectualProperties = () => {
    const [formState, setFormState] = useRecoilState<IIntellectualPropertyState[]>(intellectualPropertiesState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addImmovableAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                type: "",
                identificationNumber: "",
                description: ""
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
                            label={`Intellectual Property  ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <IntellectualPropertyForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addImmovableAsset} label="Add" />
            </div>
        </div>
    )
}

export default IntellectualProperties   