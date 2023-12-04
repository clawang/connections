export interface GameData {
    categories: Array<GameLevel>;
    title: string;
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