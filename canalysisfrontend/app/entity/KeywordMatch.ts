import {KeywordMatchLocation} from "@/app/entity/KeywordMatchLocation";

export interface KeywordMatch {
    keyword: string;
    pages: number[];
    locations?: KeywordMatchLocation[];
}
