import { IImmovableAssetState, immovableAssetsState } from '../atoms/ImmovableAssetsState';
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import ImmovableAssetForm from '../components/Forms/ImmovableAssetForm';
import { useState } from 'react';

const ImmovableAssets = () => {
    const [formState, setFormState] = useRecoilState<IImmovableAssetState[]>(immovableAssetsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addImmovableAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                propertyType: "",
                ownershipType: "",
                address: "",
                pincode: "",
                city: "",
            },
        ]);
        setCurrentItem(formState.length)
    };

    const getSubTitle = (index: number) => {
        const { address, pincode, city } = formState[index];

        const firstLine = address?.trim() || "";
        const secondLine = [city?.trim(), pincode?.trim()].filter(Boolean).join(" - ");
      
        return [firstLine, secondLine].filter(Boolean).join("\n");
    }

    return (
        <div className='flex justify-center w-full'>
            <div className="px-10 w-2xl">
                {
                    formState.map((_, index) => (
                        <CustomAccordion expanded={currentItem === index}
                            onChange={() => setCurrentItem((prevItem) => prevItem === index ? -1 : index)}
                            label={`Immovable Asset ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <ImmovableAssetForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addImmovableAsset} label="Add" />
            </div>
        </div>
    )
}

export default ImmovableAssets   