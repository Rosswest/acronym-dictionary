import { Acronym } from "./acronym";
import { DisplayableAcronym } from "./displayable-acronym";
import { Tag } from "./tag";

export class Dictionary {

    acronyms: Acronym[];
    tags: Tag[];

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.acronyms = [];
        this.tags = [];
    }

    search(acronymQuery: string, tagsFilter: Tag[], descriptionQuery: string): Acronym[] {
        let results = this.acronyms;
        results = this.filterOnAcronymQuery(results, acronymQuery);
        results = this.filterOnTags(results, tagsFilter);
        results = this.filterOnDescriptionQuery(results, descriptionQuery);
        return results;
    }

    searchForDisplay(acronymQuery: string, tagsFilter: Tag[], descriptionQuery: string): DisplayableAcronym[] {
        const results = this.search(acronymQuery,tagsFilter,descriptionQuery);
        const convertedResults = [];
        for (const result of results) {
            const displayItem = new DisplayableAcronym(result);
            convertedResults.push(displayItem);
        }
        return convertedResults;
    }

    filterOnAcronymQuery(results: Acronym[], acronymQuery: string): Acronym[] {
        const hasAcronymQuery = !((acronymQuery === null) || (acronymQuery === undefined));
        if (hasAcronymQuery) {
            const lowerCaseQuery = acronymQuery.toLowerCase();
            const filteredResults = results.filter(acronym => {
                const lowerCaseName = acronym.short.toLowerCase();
                const match = (lowerCaseName.includes(lowerCaseQuery));
                return match;
            });
            return filteredResults;
        } else {
            return results;
        }
    }

    filterOnTags(results: Acronym[], tagsFilter: Tag[]): Acronym[] {
        let tagsFilterDefined = !((tagsFilter === null) || (tagsFilter === undefined));
        if (tagsFilterDefined) {
            const filterCount = tagsFilter.length;
            if (filterCount > 0) {
                const filteredResults = results.filter(acronym => {
                    const tags = acronym.tags;
                    const match = this.checkOverlap(tags, tagsFilter);
                    return match;
                });
                return filteredResults;
            }
        }

        return results;

    }

    filterOnDescriptionQuery(results: Acronym[], descriptionQuery: string): Acronym[] {
        const hasDescriptionQuery = !((descriptionQuery === null) || (descriptionQuery === undefined));
        if (hasDescriptionQuery) {
            const lowerCaseQuery = descriptionQuery.toLowerCase();
            const filteredResults = results.filter(acronym => {
                const lowerCaseDescription = acronym.description.toLowerCase();
                const match = (lowerCaseDescription.includes(lowerCaseQuery));
                return match;
            });
            return filteredResults;
        } else {
            return results;
        }
    }

    checkOverlap(firstTags: Tag[], secondTags: Tag[]) {
        for (const first of firstTags) {
            for (const second of secondTags) {
                if (first == second) {
                    return true;
                }
            }
        }

        return false;
    }



}