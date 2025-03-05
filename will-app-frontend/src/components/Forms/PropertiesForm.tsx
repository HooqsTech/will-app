import { useRecoilState } from "recoil";
import { IPropertiesState, propertiesState } from "../../atoms/PropertiesState";
import CustomFormContainer from "../CustomFormContainer"
import CustomSelect from "../CustomSelect"
import CustomTextBox from "../CustomTextBox"
import { IPropertiesValidationState, propertiesValidationState } from "../../atoms/validationStates/PropertiesValidationState";

interface IPropertiesFormProps {
    index: number;
}

const PropertiesForm: React.FC<IPropertiesFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IPropertiesState[]>(propertiesState);
    const [validationState, setValidationState] = useRecoilState<IPropertiesValidationState[]>(propertiesValidationState);

    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IPropertiesState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );

        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: "" } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomSelect
                label="Property Type"
                helperText={validationStateItem.propertyType}
                required
                options={["Apartment", "House / Plot", "Commercial / Land"]}
                value={item.propertyType}
                onChange={(e) => handleChange(index, "propertyType", e)} />
            <CustomSelect
                label="Ownership Type"
                helperText={validationStateItem.ownershipType}
                required
                options={["Single", "Joint"]}
                value={item.ownershipType}
                onChange={(e) => handleChange(index, "ownershipType", e)} />
            <CustomTextBox
                value={item.address}
                helperText={validationStateItem.address}
                required
                onChange={(e) => handleChange(index, "address", e)}
                label="Address"
                type="text" />
            <CustomTextBox
                value={item.pincode}
                helperText={validationStateItem.pincode}
                required
                onChange={(e) => handleChange(index, "pincode", e)}
                label="Pincode"
                maxLength={6}
                restrictAlphabets
                type="text" />
            <CustomTextBox
                value={item.city}
                required
                helperText={validationStateItem.city}
                onChange={(e) => handleChange(index, "city", e)}
                label="City"
                type="text" />
        </CustomFormContainer>
    )
}

export default PropertiesForm