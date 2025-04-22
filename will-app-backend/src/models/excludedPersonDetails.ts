export interface ExcludedPersonData {
    title: "Mr" | "Mrs" | "Miss" | "";
    firstName: string;
    lastName: string;
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
            title: person.data?.title || "",
            id: person.data?.id || "",
            firstName: person.data?.firstName || "",
            lastName: person.data?.lastName || "",
            fullName: person.data?.title + ". " + person.data?.firstName + " " + person.data?.lastName || "",
            relationship: person.data?.relationship || "",
            reason: person.data?.reason || "",
        }
    }));
}