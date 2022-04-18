export class WinLossStat {
    public wins: number;
    public losses: number;
    
    public get winRate() : number {
        return this.wins / (this.wins + this.losses);
    }
    
    constructor(wins = 0, losses = 0) {
        this.wins = wins;
        this.losses = losses;
    }
}