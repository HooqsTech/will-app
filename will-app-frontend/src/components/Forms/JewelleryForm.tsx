import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { IJewelleryState, jewelleriesState } from "../../atoms/JewelleriesState";

interface IJewelleryFormProps {
    index: number
}

const JewelleryForm: React.FC<IJewelleryFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IJewelleryState[]>(jewelleriesState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IJewelleryState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <div>
                <CustomSelect
                    label="Jewellery Type"
                    options={["Gold", "Silver", "Others"]}
                    value={item.type}
                    onChange={(e) => handleChange(index, "type", e)} />
                <CustomTextBox
                    value={item.description}
                    onChange={(e) => handleChange(index, "description", e)}
                    label="Description"
                    type="text" />
                <CustomTextBox
                    value={item.preciousMetalInWeight}
                    onChange={(e) => handleChange(index, "preciousMetalInWeight", e)}
                    label="Precious Metal Weight in Grams"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default JewelleryForm