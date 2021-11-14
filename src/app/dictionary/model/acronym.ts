import { Tag } from "./tag";

export class Acronym {
    short: string;
    full: string;
    tags: Tag[];
    description: string;
    comments: string;

    constructor(short: string, full: string, tags: Tag[], description: string, comments: string) {
        this.short = short;
        this.full = full;
        this.tags = tags;
        this.description = description;
        this.comments = comments;
    }
}