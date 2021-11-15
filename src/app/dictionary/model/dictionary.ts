import { isEmpty } from "rxjs/operators";
import { Acronym } from "./acronym";
import { TagFilterMode } from "./demo/tag-filter-mode";
import { DictionaryUtils } from "./dictionary-utils";
import { DisplayableAcronym } from "./displayable-acronym";
import { Tag } from "./tag";

export class Dictionary {

    acronyms: Acronym[];
    tags: Tag[];

    constructor() {
        this.reset();
    }

    public static fromJSON(data: any): Dictionary {
        const dictionary = new Dictionary();
        Object.assign(dictionary, data)
        Object.setPrototypeOf(dictionary, Dictionary.prototype);
        const tagMap = new Map<string, Tag>();

        for (const tag of dictionary.tags) {
            Object.setPrototypeOf(tag, Tag.prototype);
            tagMap.set(tag.name, tag);
        }

        for (const acronym of dictionary.acronyms) {
            Object.setPrototypeOf(acronym, Acronym.prototype);
            const actualTags: Tag[] = [];
            for (const tag of acronym.tags) {
                //replace raw data with actual tag
                const actualTag: Tag = tagMap.get(tag.name)!;
                actualTags.push(actualTag);
            }
            acronym.tags = actualTags;
        }

        return dictionary;

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
        const results = this.search(acronymQuery, tagsFilter, tagFilterMode, descriptionQuery);
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
                    filteredResults.splice(index, 1);

                    // re-add at start of list
                    filteredResults.unshift(acronym);
                }
            }
            const sortedResults = filteredResults.sort((first: Acronym, second: Acronym) => {
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
        // determine if tags were passed in
        let hasFilterTags = !DictionaryUtils.isEmpty(tagsFilter);

        // if we have tags to filter on
        if (hasFilterTags) {
            const filteredResults = results.filter(acronym => {
                const tags = acronym.tags;
                const match = this.checkTagRequirementByMode(tags, tagsFilter, tagFilterMode);
                return match;
            });
            return filteredResults;
        }

        // edge case: if we don't have tags to filter on, but filter mode is ONLY, return only untagged acronyms
        if (!hasFilterTags && tagFilterMode == TagFilterMode.ONLY) {
            const filteredResults = results.filter(acronym => {
                const tags = acronym.tags;
                const hasNoTags = tags.length == 0;
                return hasNoTags;
            });
            return filteredResults;
        }

        return results;

    }

    checkTagRequirementByMode(tags: Tag[], tagsFilter: Tag[], tagFilterMode: TagFilterMode) {
        if (tagFilterMode === TagFilterMode.ALL) {
            return this.checkIfHasAll(tags, tagsFilter);
        } else if (tagFilterMode === TagFilterMode.ANY) {
            return this.checkForOverlap(tags, tagsFilter);
        } else if (tagFilterMode === TagFilterMode.ONLY) {
            return this.checkIfHasOnly(tags, tagsFilter);
        } else {
            throw new Error("Unsupported Tag Filter Mode: " + tagFilterMode);
            return [];
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


    checkIfHasOnly(tags: Tag[], mustHave: Tag[]) {
        const check = new Set<Tag>();

        // add all tags to the set
        for (const tag of tags) {
            check.add(tag);
        }

        // ensure we have the tags, and remove then once found
        for (const tag of mustHave) {
            if (check.has(tag)) {
                check.delete(tag);
            } else {
                // the tag isn't here, so return false  
                return false;
            }
        }

        // if there are any tags left in the set, then we have undesired tags
        const onlyHasDesiredTags = (check.size === 0)
        return onlyHasDesiredTags;
    }

}