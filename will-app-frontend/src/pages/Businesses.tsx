
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import DigitalAssetForm from '../components/Forms/DigitalAssetForm';
import { digitalAssetsState, IDigitalAssetState } from '../atoms/DigitalAssetsState';
import { escopsState, IEscopState } from '../atoms/EscopsState';
import EscopForm from '../components/Forms/EscopForm';
import { bondsState, IBondState } from '../atoms/BondsState';
import BondForm from '../components/Forms/BondForm';
import { businessesState, IBusinessState } from '../atoms/BusinessesState';
import BusinessForm from '../components/Forms/BusinessForm';

const Businesses = () => {
    const [formState, setFormState] = useRecoilState<IBusinessState[]>(businessesState);
    const [currentItem, setCurrentItem] = useState<number>(0);

    const addItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                type: "",
                companyName: "",
                address: "",
                holdingPercentage: "",
                partnership: "",
                pan: "",
                natureOfHolding: "",
                typeOfSecurity: ""
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
                            label={`Business ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <BusinessForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addItem} label="Add" />
            </div>
        </div>
    )
}

export default Businesses   