import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { IIntellectualPropertyState, intellectualPropertiesState } from "../../atoms/IntellectualPropertiesState";

interface IIntellectualPropertyFormProps {
    index: number
}

const IntellectualPropertyForm: React.FC<IIntellectualPropertyFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IIntellectualPropertyState[]>(intellectualPropertiesState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IIntellectualPropertyState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Intellectual Property">
            <div>
                <CustomSelect
                    label="Account Type"
                    options={["Brand Name", "Exclusive Product", "Invention", "Software", "Website", "Content", "Secret Formula"]}
                    value={item.type}
                    onChange={(e) => handleChange(index, "type", e)} />
                <CustomTextBox
                    value={item.identificationNumber}
                    onChange={(e) => handleChange(index, "identificationNumber", e)}
                    label="Identification Number"
                    type="text" />
                <CustomTextBox
                    value={item.description}
                    onChange={(e) => handleChange(index, "description", e)}
                    label="Description"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default IntellectualPropertyForm