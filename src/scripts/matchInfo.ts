// To parse this data:
//
//   import { Convert, MatchInfo } from "./file";
//
//   const matchInfo = Convert.toMatchInfo(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface MatchInfo {
    metadata: Metadata;
    info:     Info;
}

export interface Info {
    gameCreation:       number;
    gameDuration:       number;
    gameEndTimestamp:   number;
    gameId:             number;
    gameMode:           string;
    gameName:           string;
    gameStartTimestamp: number;
    gameType:           string;
    gameVersion:        string;
    mapId:              number;
    participants:       Participant[];
    platformId:         string;
    queueId:            number;
    teams:              Team[];
    tournamentCode:     string;
}

export interface Participant {
    assists:                        number;
    baronKills:                     number;
    bountyLevel:                    number;
    challenges:                     { [key: string]: number };
    champExperience:                number;
    champLevel:                     number;
    championId:                     number;
    championName:                   string;
    championTransform:              number;
    consumablesPurchased:           number;
    damageDealtToBuildings:         number;
    damageDealtToObjectives:        number;
    damageDealtToTurrets:           number;
    damageSelfMitigated:            number;
    deaths:                         number;
    detectorWardsPlaced:            number;
    doubleKills:                    number;
    dragonKills:                    number;
    eligibleForProgression:         boolean;
    firstBloodAssist:               boolean;
    firstBloodKill:                 boolean;
    firstTowerAssist:               boolean;
    firstTowerKill:                 boolean;
    gameEndedInEarlySurrender:      boolean;
    gameEndedInSurrender:           boolean;
    goldEarned:                     number;
    goldSpent:                      number;
    individualPosition:             string;
    inhibitorKills:                 number;
    inhibitorTakedowns:             number;
    inhibitorsLost:                 number;
    item0:                          number;
    item1:                          number;
    item2:                          number;
    item3:                          number;
    item4:                          number;
    item5:                          number;
    item6:                          number;
    itemsPurchased:                 number;
    killingSprees:                  number;
    kills:                          number;
    lane:                           string;
    largestCriticalStrike:          number;
    largestKillingSpree:            number;
    largestMultiKill:               number;
    longestTimeSpentLiving:         number;
    magicDamageDealt:               number;
    magicDamageDealtToChampions:    number;
    magicDamageTaken:               number;
    neutralMinionsKilled:           number;
    nexusKills:                     number;
    nexusLost:                      number;
    nexusTakedowns:                 number;
    objectivesStolen:               number;
    objectivesStolenAssists:        number;
    participantId:                  number;
    pentaKills:                     number;
    perks:                          Perks;
    physicalDamageDealt:            number;
    physicalDamageDealtToChampions: number;
    physicalDamageTaken:            number;
    profileIcon:                    number;
    puuid:                          string;
    quadraKills:                    number;
    riotIdName:                     string;
    riotIdTagline:                  string;
    role:                           string;
    sightWardsBoughtInGame:         number;
    spell1Casts:                    number;
    spell2Casts:                    number;
    spell3Casts:                    number;
    spell4Casts:                    number;
    summoner1Casts:                 number;
    summoner1Id:                    number;
    summoner2Casts:                 number;
    summoner2Id:                    number;
    summonerId:                     string;
    summonerLevel:                  number;
    summonerName:                   string;
    teamEarlySurrendered:           boolean;
    teamId:                         number;
    teamPosition:                   string;
    timeCCingOthers:                number;
    timePlayed:                     number;
    totalDamageDealt:               number;
    totalDamageDealtToChampions:    number;
    totalDamageShieldedOnTeammates: number;
    totalDamageTaken:               number;
    totalHeal:                      number;
    totalHealsOnTeammates:          number;
    totalMinionsKilled:             number;
    totalTimeCCDealt:               number;
    totalTimeSpentDead:             number;
    totalUnitsHealed:               number;
    tripleKills:                    number;
    trueDamageDealt:                number;
    trueDamageDealtToChampions:     number;
    trueDamageTaken:                number;
    turretKills:                    number;
    turretTakedowns:                number;
    turretsLost:                    number;
    unrealKills:                    number;
    visionScore:                    number;
    visionWardsBoughtInGame:        number;
    wardsKilled:                    number;
    wardsPlaced:                    number;
    win:                            boolean;
}

export interface Perks {
    statPerks: StatPerks;
    styles:    Style[];
}

export interface StatPerks {
    defense: number;
    flex:    number;
    offense: number;
}

export interface Style {
    description: Description;
    selections:  Selection[];
    style:       number;
}

export enum Description {
    PrimaryStyle = "primaryStyle",
    SubStyle = "subStyle",
}

export interface Selection {
    perk: number;
    var1: number;
    var2: number;
    var3: number;
}

export interface Team {
    bans:       Ban[];
    objectives: Objectives;
    teamId:     number;
    win:        boolean;
}

export interface Ban {
    championId: number;
    pickTurn:   number;
}

export interface Objectives {
    baron:      Baron;
    champion:   Baron;
    dragon:     Baron;
    inhibitor:  Baron;
    riftHerald: Baron;
    tower:      Baron;
}

export interface Baron {
    first: boolean;
    kills: number;
}

export interface Metadata {
    dataVersion:  string;
    matchId:      string;
    participants: string[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertMatchInfo {
    public static toMatchInfo(json: string): MatchInfo {
        return cast(JSON.parse(json), r("MatchInfo"));
    }

    public static matchInfoToJson(value: MatchInfo): string {
        return JSON.stringify(uncast(value, r("MatchInfo")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "MatchInfo": o([
        { json: "metadata", js: "metadata", typ: r("Metadata") },
        { json: "info", js: "info", typ: r("Info") },
    ], false),
    "Info": o([
        { json: "gameCreation", js: "gameCreation", typ: 0 },
        { json: "gameDuration", js: "gameDuration", typ: 0 },
        { json: "gameEndTimestamp", js: "gameEndTimestamp", typ: 0 },
        { json: "gameId", js: "gameId", typ: 0 },
        { json: "gameMode", js: "gameMode", typ: "" },
        { json: "gameName", js: "gameName", typ: "" },
        { json: "gameStartTimestamp", js: "gameStartTimestamp", typ: 0 },
        { json: "gameType", js: "gameType", typ: "" },
        { json: "gameVersion", js: "gameVersion", typ: "" },
        { json: "mapId", js: "mapId", typ: 0 },
        { json: "participants", js: "participants", typ: a(r("Participant")) },
        { json: "platformId", js: "platformId", typ: "" },
        { json: "queueId", js: "queueId", typ: 0 },
        { json: "teams", js: "teams", typ: a(r("Team")) },
        { json: "tournamentCode", js: "tournamentCode", typ: "" },
    ], false),
    "Participant": o([
        { json: "assists", js: "assists", typ: 0 },
        { json: "baronKills", js: "baronKills", typ: 0 },
        { json: "bountyLevel", js: "bountyLevel", typ: 0 },
        { json: "challenges", js: "challenges", typ: m(3.14) },
        { json: "champExperience", js: "champExperience", typ: 0 },
        { json: "champLevel", js: "champLevel", typ: 0 },
        { json: "championId", js: "championId", typ: 0 },
        { json: "championName", js: "championName", typ: "" },
        { json: "championTransform", js: "championTransform", typ: 0 },
        { json: "consumablesPurchased", js: "consumablesPurchased", typ: 0 },
        { json: "damageDealtToBuildings", js: "damageDealtToBuildings", typ: 0 },
        { json: "damageDealtToObjectives", js: "damageDealtToObjectives", typ: 0 },
        { json: "damageDealtToTurrets", js: "damageDealtToTurrets", typ: 0 },
        { json: "damageSelfMitigated", js: "damageSelfMitigated", typ: 0 },
        { json: "deaths", js: "deaths", typ: 0 },
        { json: "detectorWardsPlaced", js: "detectorWardsPlaced", typ: 0 },
        { json: "doubleKills", js: "doubleKills", typ: 0 },
        { json: "dragonKills", js: "dragonKills", typ: 0 },
        { json: "eligibleForProgression", js: "eligibleForProgression", typ: true },
        { json: "firstBloodAssist", js: "firstBloodAssist", typ: true },
        { json: "firstBloodKill", js: "firstBloodKill", typ: true },
        { json: "firstTowerAssist", js: "firstTowerAssist", typ: true },
        { json: "firstTowerKill", js: "firstTowerKill", typ: true },
        { json: "gameEndedInEarlySurrender", js: "gameEndedInEarlySurrender", typ: true },
        { json: "gameEndedInSurrender", js: "gameEndedInSurrender", typ: true },
        { json: "goldEarned", js: "goldEarned", typ: 0 },
        { json: "goldSpent", js: "goldSpent", typ: 0 },
        { json: "individualPosition", js: "individualPosition", typ: "" },
        { json: "inhibitorKills", js: "inhibitorKills", typ: 0 },
        { json: "inhibitorTakedowns", js: "inhibitorTakedowns", typ: 0 },
        { json: "inhibitorsLost", js: "inhibitorsLost", typ: 0 },
        { json: "item0", js: "item0", typ: 0 },
        { json: "item1", js: "item1", typ: 0 },
        { json: "item2", js: "item2", typ: 0 },
        { json: "item3", js: "item3", typ: 0 },
        { json: "item4", js: "item4", typ: 0 },
        { json: "item5", js: "item5", typ: 0 },
        { json: "item6", js: "item6", typ: 0 },
        { json: "itemsPurchased", js: "itemsPurchased", typ: 0 },
        { json: "killingSprees", js: "killingSprees", typ: 0 },
        { json: "kills", js: "kills", typ: 0 },
        { json: "lane", js: "lane", typ: "" },
        { json: "largestCriticalStrike", js: "largestCriticalStrike", typ: 0 },
        { json: "largestKillingSpree", js: "largestKillingSpree", typ: 0 },
        { json: "largestMultiKill", js: "largestMultiKill", typ: 0 },
        { json: "longestTimeSpentLiving", js: "longestTimeSpentLiving", typ: 0 },
        { json: "magicDamageDealt", js: "magicDamageDealt", typ: 0 },
        { json: "magicDamageDealtToChampions", js: "magicDamageDealtToChampions", typ: 0 },
        { json: "magicDamageTaken", js: "magicDamageTaken", typ: 0 },
        { json: "neutralMinionsKilled", js: "neutralMinionsKilled", typ: 0 },
        { json: "nexusKills", js: "nexusKills", typ: 0 },
        { json: "nexusLost", js: "nexusLost", typ: 0 },
        { json: "nexusTakedowns", js: "nexusTakedowns", typ: 0 },
        { json: "objectivesStolen", js: "objectivesStolen", typ: 0 },
        { json: "objectivesStolenAssists", js: "objectivesStolenAssists", typ: 0 },
        { json: "participantId", js: "participantId", typ: 0 },
        { json: "pentaKills", js: "pentaKills", typ: 0 },
        { json: "perks", js: "perks", typ: r("Perks") },
        { json: "physicalDamageDealt", js: "physicalDamageDealt", typ: 0 },
        { json: "physicalDamageDealtToChampions", js: "physicalDamageDealtToChampions", typ: 0 },
        { json: "physicalDamageTaken", js: "physicalDamageTaken", typ: 0 },
        { json: "profileIcon", js: "profileIcon", typ: 0 },
        { json: "puuid", js: "puuid", typ: "" },
        { json: "quadraKills", js: "quadraKills", typ: 0 },
        { json: "riotIdName", js: "riotIdName", typ: "" },
        { json: "riotIdTagline", js: "riotIdTagline", typ: "" },
        { json: "role", js: "role", typ: "" },
        { json: "sightWardsBoughtInGame", js: "sightWardsBoughtInGame", typ: 0 },
        { json: "spell1Casts", js: "spell1Casts", typ: 0 },
        { json: "spell2Casts", js: "spell2Casts", typ: 0 },
        { json: "spell3Casts", js: "spell3Casts", typ: 0 },
        { json: "spell4Casts", js: "spell4Casts", typ: 0 },
        { json: "summoner1Casts", js: "summoner1Casts", typ: 0 },
        { json: "summoner1Id", js: "summoner1Id", typ: 0 },
        { json: "summoner2Casts", js: "summoner2Casts", typ: 0 },
        { json: "summoner2Id", js: "summoner2Id", typ: 0 },
        { json: "summonerId", js: "summonerId", typ: "" },
        { json: "summonerLevel", js: "summonerLevel", typ: 0 },
        { json: "summonerName", js: "summonerName", typ: "" },
        { json: "teamEarlySurrendered", js: "teamEarlySurrendered", typ: true },
        { json: "teamId", js: "teamId", typ: 0 },
        { json: "teamPosition", js: "teamPosition", typ: "" },
        { json: "timeCCingOthers", js: "timeCCingOthers", typ: 0 },
        { json: "timePlayed", js: "timePlayed", typ: 0 },
        { json: "totalDamageDealt", js: "totalDamageDealt", typ: 0 },
        { json: "totalDamageDealtToChampions", js: "totalDamageDealtToChampions", typ: 0 },
        { json: "totalDamageShieldedOnTeammates", js: "totalDamageShieldedOnTeammates", typ: 0 },
        { json: "totalDamageTaken", js: "totalDamageTaken", typ: 0 },
        { json: "totalHeal", js: "totalHeal", typ: 0 },
        { json: "totalHealsOnTeammates", js: "totalHealsOnTeammates", typ: 0 },
        { json: "totalMinionsKilled", js: "totalMinionsKilled", typ: 0 },
        { json: "totalTimeCCDealt", js: "totalTimeCCDealt", typ: 0 },
        { json: "totalTimeSpentDead", js: "totalTimeSpentDead", typ: 0 },
        { json: "totalUnitsHealed", js: "totalUnitsHealed", typ: 0 },
        { json: "tripleKills", js: "tripleKills", typ: 0 },
        { json: "trueDamageDealt", js: "trueDamageDealt", typ: 0 },
        { json: "trueDamageDealtToChampions", js: "trueDamageDealtToChampions", typ: 0 },
        { json: "trueDamageTaken", js: "trueDamageTaken", typ: 0 },
        { json: "turretKills", js: "turretKills", typ: 0 },
        { json: "turretTakedowns", js: "turretTakedowns", typ: 0 },
        { json: "turretsLost", js: "turretsLost", typ: 0 },
        { json: "unrealKills", js: "unrealKills", typ: 0 },
        { json: "visionScore", js: "visionScore", typ: 0 },
        { json: "visionWardsBoughtInGame", js: "visionWardsBoughtInGame", typ: 0 },
        { json: "wardsKilled", js: "wardsKilled", typ: 0 },
        { json: "wardsPlaced", js: "wardsPlaced", typ: 0 },
        { json: "win", js: "win", typ: true },
    ], false),
    "Perks": o([
        { json: "statPerks", js: "statPerks", typ: r("StatPerks") },
        { json: "styles", js: "styles", typ: a(r("Style")) },
    ], false),
    "StatPerks": o([
        { json: "defense", js: "defense", typ: 0 },
        { json: "flex", js: "flex", typ: 0 },
        { json: "offense", js: "offense", typ: 0 },
    ], false),
    "Style": o([
        { json: "description", js: "description", typ: r("Description") },
        { json: "selections", js: "selections", typ: a(r("Selection")) },
        { json: "style", js: "style", typ: 0 },
    ], false),
    "Selection": o([
        { json: "perk", js: "perk", typ: 0 },
        { json: "var1", js: "var1", typ: 0 },
        { json: "var2", js: "var2", typ: 0 },
        { json: "var3", js: "var3", typ: 0 },
    ], false),
    "Team": o([
        { json: "bans", js: "bans", typ: a(r("Ban")) },
        { json: "objectives", js: "objectives", typ: r("Objectives") },
        { json: "teamId", js: "teamId", typ: 0 },
        { json: "win", js: "win", typ: true },
    ], false),
    "Ban": o([
        { json: "championId", js: "championId", typ: 0 },
        { json: "pickTurn", js: "pickTurn", typ: 0 },
    ], false),
    "Objectives": o([
        { json: "baron", js: "baron", typ: r("Baron") },
        { json: "champion", js: "champion", typ: r("Baron") },
        { json: "dragon", js: "dragon", typ: r("Baron") },
        { json: "inhibitor", js: "inhibitor", typ: r("Baron") },
        { json: "riftHerald", js: "riftHerald", typ: r("Baron") },
        { json: "tower", js: "tower", typ: r("Baron") },
    ], false),
    "Baron": o([
        { json: "first", js: "first", typ: true },
        { json: "kills", js: "kills", typ: 0 },
    ], false),
    "Metadata": o([
        { json: "dataVersion", js: "dataVersion", typ: "" },
        { json: "matchId", js: "matchId", typ: "" },
        { json: "participants", js: "participants", typ: a("") },
    ], false),
    "Description": [
        "primaryStyle",
        "subStyle",
    ],
};
