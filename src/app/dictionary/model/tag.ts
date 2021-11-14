export class Tag {
    name: string;
    createdBy: string;
    creationDate: Date;

    constructor(token: string, createdBy: string, creationDate: Date) {
        this.name = token;
        this.createdBy = createdBy;
        this.creationDate = creationDate;
    }
}