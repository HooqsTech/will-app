import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { digitalAssetsState, IDigitalAssetState } from "../../atoms/DigitalAssetsState";
import { digitalAssetsValidationState, IDigitalAssetValidationState } from "../../atoms/validationStates/DigitalAssetValidationState";

interface IBankAccountFormProps {
    index: number
}

const DigitalAssetForm: React.FC<IBankAccountFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IDigitalAssetState[]>(digitalAssetsState);
    const [validationState, setValidationState] = useRecoilState<IDigitalAssetValidationState[]>(digitalAssetsValidationState);
    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IDigitalAssetState, value: string) => {
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
                helperText={validationStateItem.type}
                label="Type"
                options={["Crypto", "NFT", "Digital Land Banks", "Virtual / Digital Gold"]}
                value={item.type}
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                helperText={validationStateItem.walletAddress}
                value={item.walletAddress}
                onChange={(e) => handleChange(index, "walletAddress", e)}
                label="Wallet Address"
                type="text" />
            {
                item.type === "Virtual / Digital Gold" &&
                <CustomTextBox
                    helperText={validationStateItem.type}
                    value={item.investmentTool}
                    onChange={(e) => handleChange(index, "investmentTool", e)}
                    label="Investment Tool"
                    type="text" />
            }
        </CustomFormContainer>
    )
}

export default DigitalAssetForm