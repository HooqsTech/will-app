import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import CustomAssetForm from '../components/Forms/CustomAssetForm';
import { customAssetsState, ICustomAssetState } from '../atoms/CustomAssets';

const CustomAssets = () => {
    const [formState, setFormState] = useRecoilState<ICustomAssetState[]>(customAssetsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addImmovableAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                description: "",
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
                            label={`Custom Asset ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <CustomAssetForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton onClick={addImmovableAsset} label="Add" />
            </div>
        </div>
    )
}

export default CustomAssets   