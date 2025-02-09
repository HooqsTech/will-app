import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { digitalAssetsState, IDigitalAssetState } from "../../atoms/DigitalAssetsState";

interface IBankAccountFormProps {
    index: number
}

const DigitalAssetForm: React.FC<IBankAccountFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IDigitalAssetState[]>(digitalAssetsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IDigitalAssetState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Bank Account">
            <div>
                <CustomSelect
                    label="Type"
                    options={["Crypto", "NFT", "Digital Land Banks", "Virtual / Digital Gold"]}
                    value={item.type}
                    onChange={(e) => handleChange(index, "type", e)} />
                <CustomTextBox
                    value={item.walletAddress}
                    onChange={(e) => handleChange(index, "walletAddress", e)}
                    label="Wallet Address"
                    type="text" />
                {
                    item.type === "Virtual / Digital Gold" &&
                    <CustomTextBox
                        value={item.investmentTool}
                        onChange={(e) => handleChange(index, "investmentTool", e)}
                        label="Investment Tool"
                        type="text" />
                }
            </div>
        </CustomFormContainer>
    )
}

export default DigitalAssetForm