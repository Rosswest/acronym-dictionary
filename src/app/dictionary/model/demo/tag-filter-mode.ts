export class TagFilterMode {
    public static readonly ANY = new TagFilterMode('Any');
    public static readonly ALL = new TagFilterMode('All');
    public static readonly ONLY = new TagFilterMode('Only');

    name: string;

    constructor(name: string) {
        this.name = name;
    }
}