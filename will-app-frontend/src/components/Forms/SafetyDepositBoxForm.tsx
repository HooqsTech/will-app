import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { ISafetyDepositBoxState, safetyDepositBoxesState } from "../../atoms/safetyDepositBoxesState";
import CustomSelect from "../CustomSelect";

interface ISafetyDepositBoxFormProps {
    index: number
}

const SafetyDepositBoxForm: React.FC<ISafetyDepositBoxFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<ISafetyDepositBoxState[]>(safetyDepositBoxesState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof ISafetyDepositBoxState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Safety Deposit Box / Locker">
            <div>
                <CustomSelect
                    label="Type"
                    options={["Single", "Joint"]}
                    value={item.depositBoxType}
                    onChange={(e) => handleChange(index, "depositBoxType", e)} />
                <CustomTextBox
                    value={item.bankName}
                    onChange={(e) => handleChange(index, "bankName", e)}
                    label="Bank Name"
                    type="text" />
                <CustomTextBox
                    value={item.branch}
                    onChange={(e) => handleChange(index, "branch", e)}
                    label="Branch"
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

export default SafetyDepositBoxForm