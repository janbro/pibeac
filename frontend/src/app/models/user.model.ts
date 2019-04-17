/**
 * Customer who owns pibeacons
 */
export class User {
    /**
     * MongoDB ObjectId
     */
    id: number;
    /**
     * User name
     */
    username: string;
    /**
     * Name of user
     */
    name: string;
    /**
     * Email of user
     */
    email: string;
    /**
     * Beacon groups
     */
    beaconGroups?: [{
        /**
         * Beacon group name
         */
        name: string,
        /**
         * Beacon ObjectId for beacons in group
         */
        beacons: [string]
    }];
}
