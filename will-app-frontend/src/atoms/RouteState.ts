import { atom } from 'recoil';
import { assetRoutesMap, ISelectedAssetsState } from './SelectedAssetsState';

export interface IRouteState {
    currentPath: string;
    nextPath?: string;
    label: string;
    id: string;
    type: string;
}

export const routesState = atom<IRouteState[]>({
    key: 'routesState',
    default: [{
        currentPath: "",
        label: "",
        id: "",
        nextPath: "",
        type: ""
    }]
});

export const getRouteDataFromSelectedAssets = (selectedAssets: ISelectedAssetsState) => {
    const selectedKeys = Object.entries(selectedAssets)
        .filter(([_, value]) => value === true)
        .map(([key]) => key as keyof ISelectedAssetsState)

    const selectedPaths = selectedKeys.map((key) => assetRoutesMap[key]).sort((a, b) => a.order - b.order);

    return selectedPaths.map((path, index) => ({
        currentPath: path.routePath,
        nextPath: selectedPaths[index + 1]?.routePath || undefined, // Last route leads to summary
        id: path.id,
        label: path.label,
        type: path.type
    }));
}