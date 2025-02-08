import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { debenturesState, IDebentureState } from "../../atoms/DebenturesState";

interface IDebentureFormProps {
    index: number
}

const DebentureForm: React.FC<IDebentureFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IDebentureState[]>(debenturesState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IDebentureState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Debenture">
            <div>
                <CustomSelect
                    label="Debenture Type"
                    options={["Single", "Joint"]}
                    value={item.type}
                    onChange={(e) => handleChange(index, "type", e)} />
                <CustomTextBox
                    value={item.financialServiceProviderName}
                    onChange={(e) => handleChange(index, "financialServiceProviderName", e)}
                    label="Bank / Financial Service Provider Name"
                    type="text" />
                <CustomTextBox
                    value={item.certificateNumber}
                    onChange={(e) => handleChange(index, "certificateNumber", e)}
                    label="Certificate / Folio Number"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default DebentureForm