import {RateLimit} from "./rateLimit";
import {MatchInfo} from "./matchInfo";
import {WinLossStat} from "./winLossStat";

const API_KEY = "API_KEY_HERE";

let regionGeneral = "Europe";
let region = "eun1";
let summonerNames = ["Borpa", "Milkshake"]

let championNames: {[key: string] : WinLossStat} = {};

const rateLimit = new RateLimit();

async function fetchAndParseData() {
  // Iterate over summonerNames
  for (let name of summonerNames) {
    let accountId = await getAccountPuuid(name);
    
    let matchList : string[] = await getMatchList(accountId);
    
    for (let matchId of matchList) {
      let matchInfo = await getMatchInfo(matchId);
      
      parseMatchInfo(matchInfo);
    }
  }
  
  let orderedChampionNames = orderDictionaryByWinrate(championNames);
  
  // Display results
  for (let championName of orderedChampionNames) {
    console.log(championName + ": " + (championNames[championName].winRate * 100).toFixed(2) + "%");
  }
  
  // Display results in the div called data
  let data = document.getElementById("data");
  data.innerHTML = "";
  for (let championName of orderedChampionNames) {
    let winRate = (championNames[championName].winRate * 100).toFixed(2);
    data.innerHTML += "<p>" + championName + ": " + winRate + "%</p>";
  }
}

async function getAccountPuuid(summonerName:string) {
  let url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`;
  
  // Send a request to url using axios
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept-Language": "en,pl-PL;q=0.9,pl;q=0.8,en-US;q=0.7",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  }).then(response => {
    return response.json();
  });
  
  rateLimit.requestCount++;

  return response.puuid;
}

async function getMatchList(puuid:string) {
  let url = `https://${regionGeneral}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}?api_key=${API_KEY}`;
  
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept-Language": "en,pl-PL;q=0.9,pl;q=0.8,en-US;q=0.7",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  }).then(response => {
    return response.json();
  });
  
  rateLimit.requestCount++;
  
  return response;
}

async function getMatchInfo(matchId:string) {
  let url = `https://${regionGeneral}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`;
  
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept-Language": "en,pl-PL;q=0.9,pl;q=0.8,en-US;q=0.7",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  }).then(response => {
    return response.json();
  });
  
  rateLimit.requestCount++;
  
  return response;
}

function parseMatchInfo(matchInfo:MatchInfo) {
  let summoner = matchInfo.info.participants.filter(participant => summonerNames.indexOf(participant.summonerName) !== -1)[0];
  
  let summonerTeamId = summoner.teamId;
  
  let enemyTeamParticipants = matchInfo.info.participants.filter(participant => participant.teamId !== summonerTeamId);
  
  let enemyTeamChampionNames = enemyTeamParticipants.map(participant => participant.championName);
  
  let didSummonerWin = summoner.win;
  
  for (let championName of enemyTeamChampionNames) {
    if (championNames[championName] === undefined) {
      championNames[championName] = new WinLossStat();
    }
    
    if (didSummonerWin) {
      championNames[championName].losses++;
    } else {
      championNames[championName].wins++;
    }
  }
}

function orderDictionaryByWinrate(championNames: { [p: string]: WinLossStat }) {
  let orderedChampionNames = Object.keys(championNames).sort((a, b) => {
    let winrateA = championNames[a].winRate;
    let winrateB = championNames[b].winRate;
    
    if (winrateA > winrateB) {
      return -1;
    } else if (winrateA < winrateB) {
      return 1;
    } else {
      return 0;
    }
  });
  
  return orderedChampionNames;
}

module.exports = {
  fetchAndParseData
};