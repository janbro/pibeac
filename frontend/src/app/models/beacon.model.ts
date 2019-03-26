export class Beacon {
    _id: string;
    id: number;
    name: string;
    owner: string;
    action: {
        kind: number;
        value: string;
    };
}
