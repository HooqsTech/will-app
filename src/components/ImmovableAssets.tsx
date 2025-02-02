import { IImmovableAssetState, immovableAssetsState } from '../atoms/ImmovableAssetsState';
import { useRecoilState } from 'recoil';
import CustomSelect from './CustomSelect';
import CustomTextBox from './CustomTextBox';
import CustomButton from './CustomButton';
import CustomAccordion from './CustomAccordion';

const ImmovableAssets = () => {
    const [formState, setFormState] = useRecoilState<IImmovableAssetState[]>(immovableAssetsState);

    const handleChange = (index: number, key: keyof IImmovableAssetState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

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
                formState.map((item, index) => (
                    <CustomAccordion label={`Immovable Asset ${index + 1}`} children={
                        <div className="grid gap-4 mb-4 sm:grid-cols-4">
                            <CustomSelect
                                label="Property Type"
                                options={["Apartment", "House / Plot", "Commercial / Land"]}
                                value={item.propertyType}
                                onChange={(e) => handleChange(index, "propertyType", e)} />
                            <CustomSelect
                                label="Ownership Type"
                                options={["Single", "Joint"]}
                                value={item.ownershipType}
                                onChange={(e) => handleChange(index, "ownershipType", e)} />
                            <CustomTextBox
                                value={item.address}
                                onChange={(e) => handleChange(index, "address", e)}
                                label="Address"
                                type="text" />
                            <CustomTextBox
                                value={item.pincode}
                                onChange={(e) => handleChange(index, "pincode", e)}
                                label="Pincode"
                                type="text" />
                            <CustomTextBox
                                value={item.city}
                                onChange={(e) => handleChange(index, "city", e)}
                                label="City"
                                type="text" />
                        </div>
                    } />
                ))
            }
            <CustomButton className='mt-5' onClick={addImmovableAsset} label="Add" />
        </div>
    )
}

export default ImmovableAssets   