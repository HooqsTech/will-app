
import { useRecoilState } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import DigitalAssetForm from '../components/Forms/DigitalAssetForm';
import { digitalAssetsState, IDigitalAssetState } from '../atoms/DigitalAssetsState';
import { IVehicleState, vehiclesState } from '../atoms/VehiclesState';
import VehicleForm from '../components/Forms/VehicleForm';

const Vehicles = () => {
    const [formState, setFormState] = useRecoilState<IVehicleState[]>(vehiclesState);
    const [currentItem, setCurrentItem] = useState<number>(0);

    const addItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                brandOrModel: "",
                registrationNumber: ""
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
                            label={`Vehcile ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <VehicleForm index={index} />
                            }
                        />
                    ))
                }
                <CustomButton className='mt-5' onClick={addItem} label="Add" />
            </div>
        </div>
    )
}

export default Vehicles   