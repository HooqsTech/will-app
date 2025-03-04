import { useRecoilState } from "recoil";
import { IInsurancePolicyState, insurancePoliciesState } from "../../atoms/InsurancePoliciesState";
import CustomFormContainer from "../CustomFormContainer";
import CustomSelect from "../CustomSelect";
import CustomTextBox from "../CustomTextBox";
import { IInsurancePolicyValidationState, insurancePoliciesValidationState } from "../../atoms/validationStates/InsurancePoliciesValidationState";

interface IInsurancePolicyFormProps {
    index: number
}

const InsurancePolicyForm: React.FC<IInsurancePolicyFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IInsurancePolicyState[]>(insurancePoliciesState);
    const [validationState, setValidationState] = useRecoilState<IInsurancePolicyValidationState[]>(insurancePoliciesValidationState);

    const item = formState[index];
    const validationItem = validationState[index];

    const handleChange = (index: number, key: keyof IInsurancePolicyState, value: string) => {
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
                label="Insurance Type"
                options={["Life", "Health"]}
                helperText={validationItem.insuranceType}
                value={item.insuranceType}
                onChange={(e) => handleChange(index, "insuranceType", e)} />
            <CustomTextBox
                value={item.insuranceProvider}
                helperText={validationItem.insuranceProvider}
                onChange={(e) => handleChange(index, "insuranceProvider", e)}
                label="Insurance Provider"
                type="text" />
            <CustomTextBox
                value={item.policyNumber}
                helperText={validationItem.policyNumber}
                onChange={(e) => handleChange(index, "policyNumber", e)}
                label="Policy Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default InsurancePolicyForm