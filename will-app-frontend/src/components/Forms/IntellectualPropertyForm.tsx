import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { IIntellectualPropertyState, intellectualPropertiesState } from "../../atoms/IntellectualPropertiesState";
import { IIntellectualPropertyValidationState, intellectualPropertyValidationState } from "../../atoms/validationStates/IntellectualPropertiesValidationState";

interface IIntellectualPropertyFormProps {
    index: number
}

const IntellectualPropertyForm: React.FC<IIntellectualPropertyFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IIntellectualPropertyState[]>(intellectualPropertiesState);
    const [validationState, setValidationState] = useRecoilState<IIntellectualPropertyValidationState[]>(intellectualPropertyValidationState);
    
    const item = formState[index];
    const validationItem = validationState[index];

    const handleChange = (index: number, key: keyof IIntellectualPropertyState, value: string) => {
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
                label="Account Type"
                options={["Brand Name", "Exclusive Product", "Invention", "Software", "Website", "Content", "Secret Formula"]}
                value={item.type}
                helperText={validationItem.type}
                required
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                value={item.identificationNumber}
                onChange={(e) => handleChange(index, "identificationNumber", e)}
                label="Identification Number"
                required
                helperText={validationItem.identificationNumber}
                type="text" />
                
            <CustomTextBox
                value={item.description}
                onChange={(e) => handleChange(index, "description", e)}
                helperText={validationItem.description}
                label="Description"
                required
                type="text" />
        </CustomFormContainer>
    )
}

export default IntellectualPropertyForm