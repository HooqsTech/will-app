export interface ExcludedPersonData {
    fullName: string;
    relationship: string;
    reason: string;
    id: string;
}

export interface IExcludedPerson {
    id: string;
    data: ExcludedPersonData;
}

export function parseExcludedPersons(excludedPersonsData: any[]): IExcludedPerson[] {
    return excludedPersonsData.map((person: IExcludedPerson) => ({
        id: person.id || "",
        data: {
            id: person.data?.id || "",
            fullName: person.data?.fullName || "",
            relationship: person.data?.relationship || "",
            reason: person.data?.reason || "",
        }
    }));
}