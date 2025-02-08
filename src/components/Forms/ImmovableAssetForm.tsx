import { useRecoilState } from "recoil";
import { IImmovableAssetState, immovableAssetsState } from "../../atoms/ImmovableAssetsState";
import CustomFormContainer from "../CustomFormContainer"
import CustomSelect from "../CustomSelect"
import CustomTextBox from "../CustomTextBox"

interface IImmovableAssetFormProps {
    index: number;
}

const ImmovableAssetForm: React.FC<IImmovableAssetFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IImmovableAssetState[]>(immovableAssetsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IImmovableAssetState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Immovable Asset">
            <div>
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
        </CustomFormContainer>
    )
}

export default ImmovableAssetForm