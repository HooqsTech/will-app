import { atom } from 'recoil';

export interface IPdfVersionState {
    userid: string,
    folderpath: string
    latestversion: number | null
    versionid: string
    downloadurl: string | null
}

export const pdfVersionsState = atom<IPdfVersionState[]>({
    key: 'pdfVersionsState',
    default: [{
        userid: "",
        folderpath: "",
        latestversion: null,
        versionid: "",
        downloadurl: ""
    }]
});
