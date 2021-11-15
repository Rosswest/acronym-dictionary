import { Acronym } from "../acronym";
import { Dictionary } from "../dictionary";
import { Tag } from "../tag";
import { PseudoRandomNumberGenerator } from "./pseudo-random-number-generator";

export class DemoDictionaryPopulator {

    private static readonly MIN_DATE_TIMESTAMP = 1262304000; // Midnight, Jan 1st 2010
    private static readonly MAX_DATE_TIMESTAMP = 1640995200; // Midnight, Jan 1st 2022
    private static readonly DATE_RANGE = DemoDictionaryPopulator.MAX_DATE_TIMESTAMP - DemoDictionaryPopulator.MIN_DATE_TIMESTAMP;
    private static readonly DEFAULT_SEED = 176345346;

    private rng: PseudoRandomNumberGenerator;

    private static readonly TAGS_TO_INSERT = [
        "General",
        "Tech",
        "Organization",
        "Logistics",
        "Uncommon",
        "Rare"
    ];

    private static readonly ACRONYMS_TO_INSERT = [
        { short: "AFK", full: "Away From Keyboard" },
        { short: "BBIAB", full: "Be Back In A Bit" },
        { short: "BBL", full: "Be Back Later" },
        { short: "BBS", full: "Be Back Soon" },
        { short: "BEG", full: "Big Evil Grin" },
        { short: "BRB", full: "Be Right Back" },
        { short: "BTW", full: "By The Way" },
        { short: "EG", full: "Evil Grin" },
        { short: "FISH", full: "First In, Still Here" },
        { short: "IDK", full: "I Don't Know" },
        { short: "IMO", full: "In My Opinion" },
        { short: "IRL", full: "In Real Life" },
        { short: "KISS", full: "Keep It Simple, Stupid" },
        { short: "LMK", full: "Let Me Know" },
        { short: "LOL", full: "Laughing Out Loud" },
        { short: "NYOB", full: "None of Your Business" },
        { short: "OFC", full: "Of Course" },
        { short: "OMG", full: "Oh My God" },
        { short: "PANS", full: "Pretty Awesome New Stuff" },
        { short: "POS", full: "Parents Over Shoulder" },
        { short: "ROFL", full: "Rolling On the Floor Laughing" },
        { short: "SMH", full: "Shaking My Head" },
        { short: "TTYL", full: "Talk To You Later" },
        { short: "YOLO", full: "You Only Live Once" },
        { short: "WTH", full: "What The Heck" },
        { short: "ASAP", full: "As Soon As Possible" },
        { short: "AWOL", full: "Absent Without Leave" },
        { short: "CIA", full: "Central Intelligence Agency" },
        { short: "CPL", full: "Corporal" },
        { short: "CPS", full: "Child Protective Services" },
        { short: "CPT", full: "Captain" },
        { short: "CSI", full: "Crime Scene Investigation" },
        { short: "DAFB", full: "Dover Air Force Base" },
        { short: "DMV", full: "Division of Motor Vehicles" },
        { short: "DNC", full: "Democratic National Committee" },
        { short: "DOD", full: "Department of Defense" },
        { short: "DON", full: "Department of the Navy" },
        { short: "DZ", full: "Drop Zone" },
        { short: "FBI", full: "Federal Bureau of Investigation" },
        { short: "FUBAR", full: "F***ed Up Beyond All Recognition" },
        { short: "GIB", full: "GI Bill" },
        { short: "MAJ", full: "Major" },
        { short: "MIA", full: "Missing In Action" },
        { short: "OSHA", full: "Occupational Safety and Health Administration" },
        { short: "NAFTA", full: "North American Free Trade Agreement" },
        { short: "NASA", full: "National Aeronautics and Space Administration" },
        { short: "Navy SEALs", full: "Navy Sea Air Land forces" },
        { short: "POTUS", full: "President of the United States" },
        { short: "POW", full: "Prisoner Of War" },
        { short: "RNC", full: "Republican National Committee" },
        { short: "REAP", full: "Reserve Education Assistance Program" },
        { short: "SCOTUS", full: "Supreme Court of the United States" },
        { short: "SGT", full: "Sergeant" },
        { short: "SWAT", full: "Special Weapons And Tactics" },
        { short: "UN", full: "United Nations" },
        { short: "USAF", full: "United States Air Force" },
        { short: "ABS", full: "Anti-lock Braking System" },
        { short: "ADD", full: "Attention Deficit Disorder" },
        { short: "ADHD", full: "Attention Deficit Hyperactivity Disorder" },
        { short: "AIDS", full: "Acquired Immune Deficiency Syndrome" },
        { short: "AMA", full: "Against Medical Advice" },
        { short: "CDC", full: "Centers for Disease Control and Prevention" },
        { short: "DARE", full: "Drug Abuse Resistance Education" },
        { short: "DOA", full: "Dead On Arrival" },
        { short: "DOB", full: "Date Of Birth" },
        { short: "DIY", full: "Do It Yourself" },
        { short: "ESL", full: "English As A Second Language" },
        { short: "FAQ", full: "Frequently Asked Questions" },
        { short: "GIF", full: "Graphics Interchange Format" },
        { short: "HIV", full: "Human Immunodeficiency Virus" },
        { short: "ID", full: "Identification" },
        { short: "IQ", full: "Intelligence Quotient" },
        { short: "MD", full: "Medical Doctor" },
        { short: "OTC", full: "Over The Counter" },
        { short: "PPV", full: "Pay Per View" },
        { short: "PS", full: "Post Script" },
        { short: "RADAR", full: "Radio Detection And Ranging" },
        { short: "SONAR", full: "Sound Navigation And Ranging" },
        { short: "SUV", full: "Sports Utility Vehicle" },
        { short: "TBA", full: "To Be Announced" },
        { short: "UFO", full: "Unidentified Flying Object" },
        { short: "ADP", full: "Automated Data Processing" },
        { short: "AKA", full: "Also Known As" },
        { short: "CAPTCHA", full: "Completely Automated Public Turing Test to tell Computers and Humans Apart" },
        { short: "CC", full: "Copy To" },
        { short: "CST", full: "Central Standard Time" },
        { short: "DAEMON", full: "Disk And Execution Monitor" },
        { short: "DBA", full: "Doing Business As" },
        { short: "DND", full: "Do Not Disturb" },
        { short: "EDS", full: "Electronic Data Systems" },
        { short: "EOD", full: "End of Day" },
        { short: "EST", full: "Eastern Standard Time" },
        { short: "ETA", full: "Estimated Time of Arrival" },
        { short: "FYI", full: "For Your Information" },
        { short: "FAQ", full: "Frequently Asked Questions" },
        { short: "HR", full: "Human Resources" },
        { short: "MBA", full: "Masters of Business Administration" },
        { short: "MST", full: "Mountain Standard Time" },
        { short: "NASDAQ", full: "National Association of Securities Dealers Automated Quotation" },
        { short: "OT", full: "Overtime" },
        { short: "POS", full: "Point Of Service" },
        { short: "PR", full: "Public Relations" },
        { short: "PST", full: "Pacific Standard Time" },
        { short: "SWOT", full: "Strengths, Weaknesses, Opportunities, Threats" },
        { short: "TBD", full: "To Be Determined" },
        { short: "TED", full: "Tell me, Explain to me, Describe to me" },
        { short: "AA", full: "Alcoholics Anonymous" },
        { short: "AAAS", full: "American Association for the Advancement of Science" },
        { short: "AARP", full: "American Association of Retired Persons" },
        { short: "ADA", full: "American Dental Association" },
        { short: "AFL", full: "American Football League" },
        { short: "AMA", full: "American Medical Association" },
        { short: "APA", full: "American Psychological Association" },
        { short: "ESPN", full: "Entertainment and Sports Programming Network" },
        { short: "F2F", full: "Face to Face" },
        { short: "FLAG", full: "Foreign Language Association of Georgia" },
        { short: "MADD", full: "Mothers Against Drunk Driving" },
        { short: "MLA", full: "Modern Language Association" },
        { short: "NBA", full: "National Basketball Association" },
        { short: "NFL", full: "National Football League" },
        { short: "NHL", full: "National Hockey League" },
        { short: "PAWS", full: "Progressive Animal Welfare Society" },
        { short: "PGA", full: "Professional Golfer’s Association" },
        { short: "SPCA", full: "Society for the Prevention of Cruelty to Animals" },
        { short: "SO", full: "Significant Other" },
        { short: "WWE", full: "World Wrestling Entertainment" },
        { short: "ZIP code", full: "Zone Improvement Plan code" },
        { short: "FIS", full: "First In, test" },
        { short: "FI", full: "First In" },
        { short: "JRE", tagsToAdd: ['Tech'], full: "Java Runtime Environment" },
        { short: "JDK", tagsToAdd: ['Tech'], full: "Java Development Kit" },
        { short: "POJO", tagsToAdd: ['Tech'], full: "Plain Old Java Object" }

    ];

    constructor() {
        this.rng = new PseudoRandomNumberGenerator(DemoDictionaryPopulator.DEFAULT_SEED);
    }

    public populateDictionary(dictionary: Dictionary) {
        dictionary.reset();
        const tags = dictionary.tags;
        const acronyms = dictionary.acronyms;

        for (const tagToken of DemoDictionaryPopulator.TAGS_TO_INSERT) {
            const creationDate = this.generateDate();
            const tag = new Tag(tagToken, "westross", creationDate);
            tags.push(tag);
        }

        for (const acronymData of DemoDictionaryPopulator.ACRONYMS_TO_INSERT) {
            ``
            //20% chance to have each tag assigned
            const tagsToAssign = this.findTags(tags, acronymData.tagsToAdd);
            for (const tag of tags) {
                const r = this.rng.getRandom();
                const shouldAssign = (r < 0.2);
                if (shouldAssign) {
                    tagsToAssign.push(tag);
                }
            }
            const short = acronymData.short;
            const full = acronymData.full;
            const acronym = new Acronym(short, full, tagsToAssign, full, "Comment goes here");
            acronyms.push(acronym);
        }
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

    private generateDate(): Date {
        const timestampIncrement = this.rng.getRandomInRange(0, DemoDictionaryPopulator.DATE_RANGE);
        const timestamp = DemoDictionaryPopulator.MIN_DATE_TIMESTAMP + timestampIncrement;
        const date = new Date(timestamp);
        return date;
    }
}