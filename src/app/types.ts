export interface GameData {
    categories: Array<GameLevel>;
    title: string;
    time_created?: Date|null;
}

export interface GameLevel {
    level: number;
    members: Array<string>;
    title: string;
}

export interface GameItem {
    level: number;
    title: string;
    selected: boolean;
    id: number;
    mistake: boolean;
}