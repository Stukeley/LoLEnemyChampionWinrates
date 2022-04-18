export class RateLimit {
    private _requestCount = 0;
    
    public get requestCount() {
        return this._requestCount;
    }

    public set requestCount(value) {
        this._requestCount = value;

        if (this._requestCount == 100) {
            setTimeout(() => {
                console.log("Pausing for 2 minutes");
            }, 120000);
        }
        else if (this._requestCount % 20 == 0) {
            setTimeout(() => {
                console.log("Pausing for 1 second");
            }, 1000);
        }
    }
}