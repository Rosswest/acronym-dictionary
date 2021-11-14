import { Acronym } from "../acronym";
import { Dictionary } from "../dictionary";
import { Tag } from "../tag";

export class CsvDictionaryPopulator {
    
    file: any;
    csvRegex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;

    constructor(file: any) {
        this.file = file;
    }
    
    public populateDictionary(dictionary: Dictionary) {
        dictionary.reset();
        const tags = dictionary.tags;
        const acronyms = dictionary.acronyms;

        const lines = this.readLinesFromFile();

        const parsedTags = this.parseTags(lines);
        const parsedAcronyms = this.parseAcronyms(lines, tags);
    }

    parseAcronyms(lines: string[], tags: Tag[]) {
        const acronyms = [];
        for (const line of lines) {
            const acronym = this.parseAcronym(line, tags);
            acronyms.push(acronym);
        }
        return acronyms;
    }

    splitCsvLine(line: string): string[] {
        const tokens = line.match(this.csvRegex);
        if (tokens === null || tokens === undefined) {
            return [];
        }
        return tokens;
    }

    parseAcronym(line: string, tags: Tag[]) {
        const tokens = this.splitCsvLine(line);
        //20% chance to have each tag assigned
        const short = tokens[0]; // TODO
        const full = tokens[1]; // TODO
        const tagTokens = tokens[2].split(','); // TODO
        const tagsToAssign = this.findTags(tags, tagTokens);
        const acronym = new Acronym(short, full, tagsToAssign, full, "Comment goes here");
        return acronym;
    }

    private parseTags(lines: string[]): Tag[] {
        const uniqueTagStrings = new Set<string>();

        // parse unique tags from the file
        for (const line of lines) {
            const tagToken = this.parseTagToken(line);
            uniqueTagStrings.add(tagToken);
        }
        
        // create Tag objects from parsed tags
        const tags: Tag[] = [];
        uniqueTagStrings.forEach(token=>{
            const tag = new Tag(token, 'custom', new Date());
            tags.push(tag)
        });
        return tags;
        
    }
    parseTagToken(line: string): string {
        const tokens = this.splitCsvLine(line);
        const tagToken = tokens[2]; //TODO
        return tagToken;
    }

    private readLinesFromFile(): string[] {
        //TODO
        return [];
    }

    findTags(tags: Tag[], tokens?: string[]): Tag[] {
        const results: Tag[] = [];
        if (tokens === null || tokens === undefined) {
            return results;
        }

        for (const tag of tags) {
            if (tokens.includes(tag.name)) {
                results.push(tag);
            }
        }

        return results
    }
    
}

