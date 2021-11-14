import { Acronym } from "./acronym";

export class DisplayableAcronym extends Acronym {
    tagString: string;

    updateTagString(): void {
        this.tagString = this.tags.map(tag=>tag.name).join(', ');
    }

    constructor(base: Acronym) {
        super(base.short,base.full,base.tags,base.description,base.comments);
        this.updateTagString();
    }
}