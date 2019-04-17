/**
 * Stores foot traffic for specific beacon
 */
export class Traffic {
    /**
     * MongoDB ObjectId
     */
    _id?: string;
    /**
     * Eddystone-UID
     */
    beacon_id: string;
    /**
     * UTC Time
     */
    time: number;
    /**
     * Detected device distances
     */
    detected_dev_dists: [number];
}
