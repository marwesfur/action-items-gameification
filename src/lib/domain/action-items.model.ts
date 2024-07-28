export interface Achievement {
    by: string;
    at: string;
    proof?: string;
}

export interface ActionItem {
    id: string;
    title: string;
    description: string;
    startedAt: string;
    archived: boolean;

    achievements: Achievement[];
}

export interface ActionItemResult {
    id: string;
    title: string;
    description: string;
    startedAt: string;

    firstPlace: PlaceInfo | undefined;
    secondPlace: PlaceInfo | undefined;
    thirdPlace: PlaceInfo | undefined;
    honorableMentions: PlaceInfo[];
}

export interface PlaceInfo {
    count: number;
    users: string[];
}