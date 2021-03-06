import { Acronym } from "./acronym";
import { TagFilterMode } from "./demo/tag-filter-mode";
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

    search(acronymQuery: string, tagsFilter: Tag[], tagFilterMode: TagFilterMode, descriptionQuery: string): Acronym[] {
        let results = this.acronyms;
        results = this.filterOnAcronymQuery(results, acronymQuery);
        results = this.filterOnTags(results, tagsFilter, tagFilterMode);
        results = this.filterOnDescriptionQuery(results, descriptionQuery);
        return results;
    }

    searchForDisplay(acronymQuery: string, tagsFilter: Tag[], tagFilterMode: TagFilterMode, descriptionQuery: string): DisplayableAcronym[] {
        const results = this.search(acronymQuery,tagsFilter,tagFilterMode,descriptionQuery);
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

            // filter out acronyms which don't contain query string
            const lowerCaseQuery = acronymQuery.toLowerCase();
            const filteredResults = results.filter(acronym => {
                const lowerCaseName = acronym.short.toLowerCase();
                const match = (lowerCaseName.includes(lowerCaseQuery));
                return match;
            });

            // move exact matches to the front of the list
            for (const acronym of filteredResults) {
                const acronymLowerCase = acronym.short.toLowerCase();
                const exactMatch = (acronymLowerCase == lowerCaseQuery);
                if (exactMatch) {

                    // remove element
                    const index = filteredResults.indexOf(acronym);
                    filteredResults.splice(index,1);

                    // re-add at start of list
                    filteredResults.unshift(acronym);
                }
            }
            const sortedResults = filteredResults.sort((first: Acronym, second: Acronym)=>{
                const firstLowerCase = first.short.toLowerCase();
                const secondLowerCase = second.short.toLowerCase();
                const firstExactMatch = (firstLowerCase == lowerCaseQuery);
                const secondExactMatch = (secondLowerCase == lowerCaseQuery);
                const sameMatchType = (firstExactMatch == secondExactMatch);
        
                if (!sameMatchType) {
                    if (firstExactMatch) {
                        return -1;
                    } else if (secondExactMatch) {
                        return 1;
                    }
                }

                return 0;
            });

            return sortedResults;
        } else {
            return results;
        }
    }

    filterOnTags(results: Acronym[], tagsFilter: Tag[], tagFilterMode: TagFilterMode,): Acronym[] {
        let tagsFilterDefined = !((tagsFilter === null) || (tagsFilter === undefined));
        if (tagsFilterDefined) {
            const filterCount = tagsFilter.length;
            if (filterCount > 0) {
                const filteredResults = results.filter(acronym => {
                    const tags = acronym.tags;
                    const match = this.checkTagRequirementByMode(tags, tagsFilter, tagFilterMode);
                    return match;
                });
                return filteredResults;
            }
        }

        return results;

    }
    checkTagRequirementByMode(tags: Tag[], tagsFilter: Tag[], tagFilterMode: TagFilterMode) {
       if (tagFilterMode === TagFilterMode.ALL) {
        return this.checkIfHasAll(tags, tagsFilter);
       } else {
           return this.checkForOverlap(tags, tagsFilter);
       }
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

    checkIfHasAll(tags: Tag[], mustHave: Tag[]) {
        for (const requiredTag of mustHave) {
            let hasRequiredTag = false;

            // check to see if the required tag is in the list of tags
            for (const tag of tags) {
                if (tag == requiredTag) {
                    hasRequiredTag = true;
                    break;
                }
            }

            // by the time we reach here, we have either exhausted the list or broken upon finding the required tag
            // we only continue to the next tag if the first was found
            if (!hasRequiredTag) {
                return false;
            }
        }

        // if we reach this point, we have successfully found all tags
        return true;
    }

    checkForOverlap(firstTags: Tag[], secondTags: Tag[]) {
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