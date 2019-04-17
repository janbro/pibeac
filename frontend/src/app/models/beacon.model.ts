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
