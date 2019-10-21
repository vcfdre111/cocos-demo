import GameModel from "./GameModel";

const { ccclass, property } = cc._decorator;

export enum Phase {
    Waiting = 0,
    Betting = 1,
    BetEnd = 2,
    Result = 3,
    Ending = 4

}

@ccclass
export default class GameCtrl extends cc.Component {




    @property
    Model: GameModel = null;

    @property
    betTime = false;

    @property
    GameStage: number[] = [0, 0]

    @property
    Chip: number = 0;

    onLoad() {
        this.register_evnet();
        this.Model = this.getComponent("GameModel");
    }

    // start() { }

    /**
     * register evnet table
     */
    register_evnet() {
        let self = this


        cc.game.on("changeStage", function changeClientStage(stage: string) {
            switch (stage) {
                case "waiting":
                    cc.game.emit("changePhaseLabel", "Waiting Phase");
                    break;
                case "bet":
                    cc.game.emit("changePhaseLabel", "Betting Phase");
                    self.betTime = !self.betTime;
                    break;
                case "bet end":
                    cc.game.emit("changePhaseLabel", "Bet end");
                    self.betTime = !self.betTime;
                    break;
                case "show":
                    cc.game.emit("changePhaseLabel", "Result Phase");
                    self.getGameResult();
                    break;
                case "end":
                    cc.game.emit("changePhaseLabel", "Ending Phase");
                    cc.game.emit("clearCard");
                    cc.game.emit("clearBet");
                    for (let index = 0; index < 3; index++) {
                        self.changeBetLabel(index, 0);
                    }
                    break;
                default:
                    break;
            }

        })

        cc.game.on("stageTime", function stageTime(time: number) {
            cc.game.emit("updateTime", time)
        })

        cc.game.on("returnCard", function sendCard(card: number[]) {
            cc.game.emit("drawCard", card);
        })

        cc.game.on("updatePlayerInformation", function returnPlayerInformation(name: string, money: number) {
            cc.game.emit("setPlayerInformation", name, money);
            cc.game.emit("setName", self.Model.LocalPlayerName);
            cc.game.emit("updateMoney", self.Model.LocalPlayerMoney);
        })
    }


    // update (dt) {}






    public chipSelect(event, amount: number) {
        console.log(this.Chip = amount);
    }

    public betting(event, area: number) {
        if ((this.Model.LocalPlayerMoney - this.Chip >= 0) && this.betTime) {
            this.Model.LocalPlayerMoney -= this.Chip;
            cc.game.emit("addBet", this.Chip, area);
            cc.game.emit("receiveLocalBet", this.Model.LocalPlayerName, this.Chip, area);
            ;
        } else if (!this.betTime) {
            console.log("not bet time");
        } else {
            console.log("Betting fail,not enough money")
        }
        this.changeBetLabel(area, this.Model.getLocalbet()[area]);
        cc.game.emit("updateMoney", this.Model.LocalPlayerMoney);
    }

    public changeBetLabel(area: number, amount: number) {
        cc.game.emit("playerBetDisplay", area, amount);
    }

    public getGameResult() {
        cc.game.emit("getCard")

    }
}
