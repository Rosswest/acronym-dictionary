export class DictionaryUtils {

    /**
     * Returns whether or not the object would be considered 'empty' based on its data type
     * @param data The object to consider
     * @returns Whether the object is 'em
     */
    public static isEmpty(data: any): boolean {

        // general cases
        if (data === null || data === undefined) {
            return true;
        }

        // case for strings
        if (typeof data === 'string') {
            if (data === '') {
                return true;
            }
        }

        // case for arrays and strings
        if (data.length !== undefined && data.length !== null) {
            if (data.length === 0) {
                return true;
            }
        }

        return false;
    }
}