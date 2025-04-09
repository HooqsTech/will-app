import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import Swal from 'sweetalert2';
import { deleteAsset, upsertAsset } from '../api/asset';
import { artWorksState, IArtWorkState } from '../atoms/ArtWorksState';
import { routesState } from '../atoms/RouteState';
import { userState } from '../atoms/UserDetailsState';
import { artWorksValidationState, emptyArtWorkValidationState, IArtWorkValidationState } from '../atoms/validationStates/ArtWorksValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import ConfirmDelete from "../components/ConfirmDelete";
import CustomAccordion from '../components/CustomAccordion';
import ArtWorkForm from '../components/Forms/ArtWorkForm';
import NextButton from '../components/NextButton';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { IsEmptyString } from '../utils';

const ArtWorksPage = () => {
    const [formState, setFormState] = useRecoilState<IArtWorkState[]>(artWorksState);
    const [validationState, setValidationState] = useRecoilState<IArtWorkValidationState[]>(artWorksValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();

    const addBond = () => {
        setFormState((prevState) => [...prevState, {
            id: "",
            name: "",
            description: "",
        }]);
        setValidationState((prevState) => [...prevState, emptyArtWorkValidationState]);
        setCurrentItem(formState.length);
    };

    const saveArtWorkAsync = async (artWork: IArtWorkState, index: number) => {
        const data = {
            id: artWork.id,
            type: ASSET_TYPES.OTHER_ASSETS,
            subtype: ASSET_SUBTYPES.ART_WORKS,
            userId: user.userId,
            data: artWork
        };
        const upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    };

    const deleteArtWorkAsync = async (index: number) => {
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

    const setBondValidationState = (index: number, key: keyof IArtWorkValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid = true;
        formState.forEach((bond, index) => {
            if (IsEmptyString(bond.name)) {
                setBondValidationState(index, "name", "name is required");
                isValid = false;
            }
            if (IsEmptyString(bond.description)) {
                setBondValidationState(index, "description", "description is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const getArtWorkSubtitle = (index: number) => {
        const { name, description } = formState[index];
        const firstLine = name?.trim() || "";
        const secondLine = [description?.trim()].filter(Boolean).join(" - ");
        return [firstLine, secondLine].filter(Boolean).join("\n");
    };

    const handleNextClick = async () => {
        if (!validate()) return;
        formState.forEach(async (bond, index) => {
            await saveArtWorkAsync(bond, index);
        });

        // NAVIGATE TO NEXT ROUTE
        let routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        if (!routeValue?.nextPath) {
            Swal.fire({
                title: "Are you sure Proceed to Liabilities",
                text: "Ready to move to Liabilities Section? Click No to add more Assets",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "var(--color-will-green)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, go to Liabilities",
                cancelButtonText: "No",
                customClass: {
                    popup: "swal-sm",
                    title: "swal-title",
                    confirmButton: "swal-confirm-btn",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.LIABILITIES);
                }
                else {
                    navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.ASSETS)
                }
            });
        } else {
            navigate(ROUTE_PATHS.YOUR_WILL + routeValue.nextPath);
        }
    };

    const shouldExpandAccordion = (index: number) => currentItem === index;

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => prevItem === index ? -1 : index)
        setShowErrorBorder(false);
    }

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Art Works</h1>
            <div>
                {formState.map((_, index) => (
                    <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                        <div className='w-full h-full'>
                            <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                onChange={() => handleAccordionOnChange(index)}
                                label={`Art Work ${index + 1}`}
                                subTitle={
                                    currentItem !== index && !shouldExpandAccordion(index) ? getArtWorkSubtitle(index) : ""
                                }
                            >
                                <ArtWorkForm index={index} />
                            </CustomAccordion>
                        </div>
                        {!shouldExpandAccordion(index) && (
                            <ConfirmDelete onConfirm={() => deleteArtWorkAsync(index)} />
                        )}
                    </div>
                ))}
                <AddButton onClick={addBond} label={`Art Work ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default ArtWorksPage;