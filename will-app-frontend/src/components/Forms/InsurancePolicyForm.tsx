import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IInsuranceDetailState, insuranceDetailsState } from "../../atoms/InsuranceDetailsState";
import CustomSelect from "../CustomSelect";

interface IInsurancePolicyFormProps {
    index: number
}

const InsurancePolicyForm: React.FC<IInsurancePolicyFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IInsuranceDetailState[]>(insuranceDetailsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IInsuranceDetailState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Insurance Policy">
            <div>
                <CustomSelect
                    label="Insurance Type"
                    options={["Life", "Health"]}
                    value={item.insuranceType}
                    onChange={(e) => handleChange(index, "insuranceType", e)} />
                <CustomTextBox
                    value={item.insuranceProvider}
                    onChange={(e) => handleChange(index, "insuranceProvider", e)}
                    label="Insurance Provider"
                    type="text" />
                <CustomTextBox
                    value={item.policyNumber}
                    onChange={(e) => handleChange(index, "policyNumber", e)}
                    label="Policy Number"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default InsurancePolicyForm