
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameModel extends cc.Component {

    @property
    public LocalPlayerName: string = "null";

    @property
    public LocalPlayerMoney: number = 0;

    @property
    LocalPlayerBet: number[] = [0, 0, 0];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.register_evnet();
    }

    // start() {}
    register_evnet() {
        let self = this;
        cc.game.on("addBet", function addBet(amount: number, area: number) {
            self.LocalPlayerMoney - +amount;
            self.LocalPlayerBet[area] += +amount;
            console.log(self.LocalPlayerBet);
        })

        cc.game.on("clearBet", function clearBet() {
            self.LocalPlayerBet = [0, 0, 0];
        })

        cc.game.on("setPlayerInformation", function setPlayerInformation(n: string, m: number) {
            self.LocalPlayerName = n;
            self.LocalPlayerMoney = m;
        })
    }






    public getLocalbet(): number[] {
        return this.LocalPlayerBet;
    }
}
