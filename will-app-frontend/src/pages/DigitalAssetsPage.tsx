import { IDigitalAssetState, digitalAssetsState } from '../atoms/DigitalAssetsState';
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import DigitalAssetsForm from '../components/Forms/DigitalAssetForm';
import { useState } from 'react';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { routesState } from '../atoms/RouteState';
import { useLocation, useNavigate } from 'react-router';
import { IAsset } from '../models/asset';
import { deleteAsset, upsertAsset } from '../api/asset';
import { userState } from '../atoms/UserDetailsState';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { emptyDigitalAssetValidationState, IDigitalAssetValidationState, digitalAssetsValidationState } from '../atoms/validationStates/DigitalAssetValidationState';
import { IsEmptyString } from '../utils';
import ConfirmDelete from "../components/ConfirmDelete";

const DigitalAssetsPage = () => {
    const [formState, setFormState] = useRecoilState<IDigitalAssetState[]>(digitalAssetsState);
    const [validationState, setValidationState] = useRecoilState<IDigitalAssetValidationState[]>(digitalAssetsValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveDigitalAssetAsync = async (asset: IDigitalAssetState, index: number) => {
        var data: IAsset = {
            id: asset.id,
            type: ASSET_TYPES.OTHER_ASSETS,
            subtype: ASSET_SUBTYPES.DIGITAL_ASSETS,
            userId: user.userId,
            data: asset
        };
        var upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    };

    const deleteDigitalAssetAsync = async (index: number) => {
        if (formState[index].id !== ""
            && formState[index].id !== undefined
        ) {
            await deleteAsset(formState[index].id);
        }

        setFormState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );

        setValidationState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );
    };

    const handleBackClick = async () => {
        var routeValue = routeState.find(s => s.nextPath === location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    };

    const setDigitalAssetValidationState = (index: number, key: keyof IDigitalAssetValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid: boolean = true;
        formState.forEach((asset, index) => {
            if (IsEmptyString(asset.type)) {
                setDigitalAssetValidationState(index, "type", "Asset type is required");
                isValid = false;
            }
            else if (IsEmptyString(asset.walletAddress)) {
                setDigitalAssetValidationState(index, "walletAddress", "Wallet address is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const handleNextClick = async () => {
        if (!validate()) return;

        formState.forEach(async (asset, index) => {
            await saveDigitalAssetAsync(asset, index);
        });

        let routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        navigate(ROUTE_PATHS.YOUR_WILL + (routeValue?.nextPath ?? ROUTE_PATHS.LIABILITIES));
    };

    const addDigitalAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                type: "",
                walletAddress: "",
                investmentTool: "",
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyDigitalAssetValidationState
        ]);
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { type, walletAddress } = formState[index];
        return [type?.trim(), walletAddress?.trim()].filter(Boolean).join(" - ");
    };

    const shouldExpandAccordion = (index: number) => {
        return currentItem === index;
    };

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => prevItem === index ? -1 : index);
        setShowErrorBorder(false);
    };

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Digital Assets</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Digital Asset ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <DigitalAssetsForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteDigitalAssetAsync(index)} />
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addDigitalAsset} label={`Digital Asset ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default DigitalAssetsPage;
