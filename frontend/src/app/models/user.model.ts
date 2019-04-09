export class User {
    id: number;
    username: string;
    name: string;
    email: string;
    beaconGroups?: [{
        name: string,
        beacons: [string]
    }];
}
