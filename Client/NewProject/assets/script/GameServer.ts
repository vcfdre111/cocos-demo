import GameServerData from "./GameServerData";
const { ccclass, property } = cc._decorator;

export enum Phase {
    Waiting = 0,
    Betting = 1,
    BetEnd = 2,
    Result = 3,
    Ending = 4

}

@ccclass
export default class GameServer extends cc.Component {


    @property
    protected GameStage: number = 0;

    @property
    TotalRound: number = 0;

    @property
    TimeRemain: number = 0;


    @property
    Data: GameServerData = null;

    @property
    PokerCard: number[] = [-1, -1];

    @property
    Winner: number = -1;
    @property
    TotalBets: number[] = [0, 0, 0];


    readonly EmptyAres: number[] = [0, 0, 0];



    ws: WebSocket = new WebSocket("ws://localhost:2346/");






    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        let self = this;
        this.Data = this.getComponent("GameServerData");

        console.log("Game Start!");

        this.register_evnet();
        this.ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
        };
        this.ws.onmessage = function (event) {
            self.gameProcess(event.data);
            console.log(typeof (event.data) + " " + event.data);
        };
    }





    start() {
        // this.gameProcess();
    }

    // update(dt) { }


    register_evnet() {
        let self = this;
        cc.game.on("receiveLocalBet", function receiveLocalBet(name: string, amount: number, area: number) {
            self.TotalBets[area] += +amount;
            self.Data.PlayerMoney = -amount;
        })

        cc.game.on("getCard", function getCard() {
            cc.game.emit("returnCard", self.PokerCard)
        })
    }

    public gameProcess(stage: string) {
        switch (stage) {
            case "waiting":
                cc.game.emit("updatePlayerInformation", this.getPlayerName(), this.getPlayerMoney())
                this.gameWait(stage);
                break;
            case "bet":
                this.bet(stage);
                break;
            case "bet end":
                this.betFinish(stage);
                break;
            case "show":
                this.showResult(stage);
                break;
            case "end":
                cc.game.emit("updatePlayerInformation", this.getPlayerName(), this.getPlayerMoney())
                this.roundEnd(stage);
            default:
                break;
        }
    }
    public gameWait(stage: string) {
        console.log("Now is " + (++this.TotalRound) + " round");
        cc.game.emit("changeStage", stage)
    }
    public bet(stage: string) {
        cc.game.emit("changeStage", stage)
    }
    public betFinish(stage: string) {
        console.log("Server bets " + this.TotalBets);
        cc.game.emit("changeStage", stage)
        this.PokerCard = this.creatCard();
        this.cardResult();
    }
    public showResult(stage: string) {
        this.dealWithMoney()
        cc.game.emit("changeStage", stage)
    }
    public roundEnd(stage: string) {
        console.log("round end");
        cc.game.emit("changeStage", stage)
        this.PokerCard = [-1, -1]
        this.Winner = -1;
        this.TotalBets = [...this.EmptyAres];
        console.log("round end bets " + this.TotalBets);
    }

    public getPlayerName(): string {
        return this.Data.PlayerName;
    }
    public getPlayerMoney() {
        return this.Data.PlayerMoney;
    }

    private creatCard() {
        let rdmArray = [2];

        for (let i = 0; i < 2; i++) {
            let rdm = 0;

            do {
                var exist = false;
                rdm = Math.floor(Math.random() * 52);


                if (rdmArray.indexOf(rdm) != -1) exist = true;

            } while (exist);

            rdmArray[i] = rdm;
        }
        return rdmArray;
    }
    private cardResult() {
        console.log("Dora: " + (this.PokerCard[0] % 13) + " Tora: " + (this.PokerCard[1] % 13));
        if ((this.PokerCard[0] % 13) > (this.PokerCard[1] % 13)) {
            this.Winner = 0;
        } else if ((this.PokerCard[0] % 13) < (this.PokerCard[1] % 13)) {
            this.Winner = 2;
        } else {
            this.Winner = 1;
        }
        console.log("Winner is " + this.Winner);

    }


    private dealWithMoney() {
        if (this.Winner === 1) {
            this.Data.PlayerMoney = (this.TotalBets[this.Winner] * 9);
        } else {
            this.Data.PlayerMoney = (this.TotalBets[this.Winner] * 2);
        }
    }



}

