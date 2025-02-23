import { IPropertiesState, propertiesState } from '../atoms/PropertiesState';
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import PropertiesForm from '../components/Forms/PropertiesForm';
import { useState } from 'react';
import { IAsset } from '../models/asset';
import { upsertAsset } from '../api/asset';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';

const PropertiesPage = () => {
    const [formState, setFormState] = useRecoilState<IPropertiesState[]>(propertiesState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const addImmovableAsset = () => {
        // var data: IAsset = {
        //     userid: 1,
        //     type: "immovableAssets",
        //     subtype: formState[currentItem]?.propertyType,
        //     data: {
        //         "assetId": 123,
        //         "ownershipType": formState[currentItem].ownershipType,
        //         "address": formState[currentItem].address,
        //         "city": formState[currentItem].city,
        //         "pincode": formState[currentItem].pincode
        //     }
        // }
        // upsertAsset(data);
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
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { address, pincode, city } = formState[index];

        const firstLine = address?.trim() || "";
        const secondLine = [city?.trim(), pincode?.trim()].filter(Boolean).join(" - ");

        return [firstLine, secondLine].filter(Boolean).join("\n");
    }

    return (
        <div className='flex justify-center w-full h-full'>
            <div className="w-xl h-full space-y-3">
                <div>
                    {
                        formState.map((_, index) => (
                            <CustomAccordion key={index} expanded={currentItem === index}
                                onChange={() => setCurrentItem((prevItem) => prevItem === index ? -1 : index)}
                                label={`Property ${index + 1}`}
                                subTitle={
                                    currentItem !== index ? getSubTitle(index) : ""
                                }
                                children={
                                    <PropertiesForm index={index} />
                                }
                            />
                        ))
                    }
                    <AddButton onClick={addImmovableAsset} label={`Property ${formState.length + 1}`} />
                </div>
                <div className='justify-between flex mt-10'>
                    <BackButton label='Back' onClick={() => {}} />
                    <NextButton label='Save & Next' onClick={() => {}} />
                </div>
            </div>
        </div>
    )
}

export default PropertiesPage   