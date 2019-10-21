

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameServerData extends cc.Component {


    @property
    private _PlayerName: string = "player1"
    @property
    public get PlayerName(): string {
        console.log("name getted")
        return this._PlayerName;
    }
    private _PlayerMoney: number = 5000;

    public set PlayerMoney(n: number) {
        console.log(n + " money setted")
        this._PlayerMoney += n;
    }
    public get PlayerMoney(): number {
        console.log("money getted")
        return this._PlayerMoney;
    }




}
