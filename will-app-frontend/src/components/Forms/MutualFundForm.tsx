import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IMutualFundState, mutualFundsState } from "../../atoms/MutualFundsState";
import { IMutualFundValidationState, mutualFundValidationState } from "../../atoms/validationStates/MutualFundsValidationState";

interface IMutualFundFormProps {
    index: number
}

const MutualFundForm: React.FC<IMutualFundFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IMutualFundState[]>(mutualFundsState);
    const [validationState, setValidationState] = useRecoilState<IMutualFundValidationState[]>(mutualFundValidationState);
    
    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IMutualFundState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );

        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: "" } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomTextBox
                value={item.noOfHolders}
                helperText={validationStateItem.noOfHolders}
                onChange={(e) => handleChange(index, "noOfHolders", e)}
                label="No of Holders"
                type="text" />
            <CustomTextBox
                value={item.fundName}
                helperText={validationStateItem.fundName}
                onChange={(e) => handleChange(index, "fundName", e)}
                label="Fund Name"
                type="text" />
        </CustomFormContainer>
    )
}

export default MutualFundForm