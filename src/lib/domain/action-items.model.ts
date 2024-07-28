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