import { IImmovableAssetState, immovableAssetsState } from '../atoms/ImmovableAssetsState';
import { useRecoilState } from 'recoil';
import CustomButton from './CustomButton';
import CustomAccordion from './CustomAccordion';
import ImmovableAssetForm from './Forms/ImmovableAssetForm';

const ImmovableAssets = () => {
    const [formState, setFormState] = useRecoilState<IImmovableAssetState[]>(immovableAssetsState);

    const addImmovableAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                propertyType: "",
                ownershipType: "",
                address: "",
                pincode: "",
                city: "",
            }, // Default values for new asset
        ]);
    };

    return (
        <div className="px-10">
            {
                formState.map((_, index) => (
                    <CustomAccordion label={`Immovable Asset ${index + 1}`} children={
                        <ImmovableAssetForm index={index} />
                    } />
                ))
            }
            <CustomButton className='mt-5' onClick={addImmovableAsset} label="Add" />
        </div>
    )
}

export default ImmovableAssets   