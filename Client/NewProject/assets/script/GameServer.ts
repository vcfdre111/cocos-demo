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
    TotalRound: number = 0;



    @property
    PokerCard: number[] = [-1, -1];

    @property
    Winner: number = -1;

    @property
    TotalBets: number[] = [0, 0, 0];


    readonly EmptyAres: number[] = [0, 0, 0];

    @property
    LocalPlayerName: string = null;

    @property
    LocalPlayerMoney: number = null;



    ws: WebSocket = new WebSocket("ws://192.168.1.118:2346/");

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        let self = this;

        console.log("Game Start!");

        this.register_evnet();
        this.ws.onopen = function (event) {

        };
        this.ws.onmessage = function (event) {
            let temp = JSON.parse(event.data);
            if (temp.commend === 'change stage') {
                self.gameProcess(temp.stage);
            } else if (temp.commend === 'time countdown') {
                cc.game.emit("stageTime", temp.time);
            } else if (temp.commend === 'result card') {
                self.PokerCard = temp.card;
            } else if (temp.commend === 'updateInfomation') {
                self.updateInfomation(temp.name, temp.money);
                console.log(self.LocalPlayerName + "   " + self.LocalPlayerMoney)
            } else if (temp.commend === 'bet') {
                self.TotalBets[temp.area] += +temp.amount;
                cc.game.emit("total bet", self.TotalBets);
            } else if (temp.commend === 'addChip') {
                cc.game.emit("betToTable", temp.area, temp.amount, false);
            }


        };
    }


    start() {
        let name = 'player' + (Math.floor(Math.random() * 5)).toString();
        this.ws.send(JSON.stringify({
            'commend': 'login',
            'id': name
        }));
    }

    // update(dt) { }


    register_evnet() {
        let self = this;
        cc.game.on("receiveLocalBet", function receiveLocalBet(name: string, amount: number, area: number) {
            self.ws.send(JSON.stringify({
                'commend': 'bet',
                'amount': amount,
                'area': area
            }))


        })

        cc.game.on("getCard", function getCard() {
            cc.game.emit("returnCard", self.PokerCard)
        })
    }

    public gameProcess(stage: string) {
        switch (stage) {
            case "waiting":
                this.ws.send(JSON.stringify({
                    'commend': 'requireInfomation'
                }));
                cc.game.emit("updatePlayerInformation", this.LocalPlayerName, this.LocalPlayerMoney);
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
                this.ws.send(JSON.stringify({
                    'commend': 'requireInfomation'
                }))
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
        cc.game.emit("changeStage", stage)
        this.cardResult();
    }
    public showResult(stage: string) {
        cc.game.emit("changeStage", stage)
    }
    public roundEnd(stage: string) {
        console.log("round end");
        cc.game.emit("changeStage", stage)
        this.PokerCard = [-1, -1];
        this.Winner = -1;
        this.TotalBets = [...this.EmptyAres];
        cc.game.emit("total bet", this.TotalBets);
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
        cc.game.emit("sendWinner", this.Winner);
    }

    private updateInfomation(name: string, money: number) {

        this.LocalPlayerName = name;
        this.LocalPlayerMoney = money;
        cc.game.emit("updatePlayerInformation", this.LocalPlayerName, this.LocalPlayerMoney);
    }

}

