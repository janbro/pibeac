/**
 * Beacon data such as associated action
 */
export class Beacon {
    /**
     * MongoDB ObjectId
     */
    _id?: string;
    /**
     * Eddystone-UID
     */
    id: number;
    /**
     * Beacon name
     */
    name: string;
    /**
     * Owner id
     */
    owner?: string;
    /**
     * Whether or not to collect anonymous traffic data
     */
    collect_data: boolean;
    /**
     * What time period graph should be in seconds
     */
    graph_time_period?: string;
    /**
     * Action
     */
    action: {
        /**
         * Int value associated with beacon action
         */
        kind: number;
        /**
         * Value assigned to beacon
         */
        value: string;
    };
}
