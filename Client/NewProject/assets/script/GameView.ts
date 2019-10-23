

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends cc.Component {

    @property(cc.Label)
    PlayerName: cc.Label = null;

    @property(cc.Label)
    PlayerMoney: cc.Label = null;

    @property(cc.Label)
    PhaseLabel: cc.Label = null;

    @property(cc.Label)
    Time: cc.Label = null;

    @property(cc.Label)
    PlayerDBet: cc.Label = null;

    @property(cc.Label)
    PlayerDrBet: cc.Label = null;

    @property(cc.Label)
    PlayerTBet: cc.Label = null;

    @property(cc.Prefab)
    CardPrefab: cc.Prefab = null;

    @property(cc.Button)
    BetButtons: cc.Button[] = [null, null, null];

    @property(cc.Node)
    ChipButtonLabel: cc.Node[] = [null, null, null, null, null]

    @property(cc.Label)
    TotalBetLabel: cc.Label[] = [null, null, null]






    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.register_evnet();
    }

    // start() { }
    register_evnet() {
        let self = this;
        cc.game.on("changePhaseLabel",
            /**
             * change phase label to current phase
             * @param n recive phase name
             */
            function changePhaseLabel(n: string) {
                self.PhaseLabel.string = n;
            })

        cc.game.on("clearCard",
            /**
             * destory all displayed card
             */
            function clearCard() {
                let childs: cc.Node[] = self.node.children;
                childs.forEach(element => {
                    element.destroy();
                });
            })

        cc.game.on("setName",

            /**
             * set player's name label
             * @param n recive player's name
             */
            function setName(n: string) {
                self.PlayerName.string = n;
            })

        cc.game.on("updateMoney",

            /**
             * update player's money
             * @param money recive player's money
             */
            function updateMoney(money: number) {
                self.PlayerMoney.string = money.toString();
            })

        cc.game.on("updateTime",

            /**
             * update current phase's time
             * @param n recive remaining time
             */

            function updateTime(n: number) {

                self.Time.string = (+n).toString();
            })

        cc.game.on("playerBetDisplay",


            function playerBetDisplay(area: number, bet: number) {
                switch (+area) {
                    case 0:
                        self.PlayerDBet.string = bet.toString();
                        break;
                    case 1:
                        self.PlayerDrBet.string = bet.toString();
                        break;
                    case 2:
                        self.PlayerTBet.string = bet.toString();
                        break;
                    default:
                        break;
                }
            })

        cc.game.on("drawCard", function drawCard(cards: number[]) {
            let spacing = -150;
            for (let index = 0; index < 2; index++) {
                let newcard = cc.instantiate(self.CardPrefab);
                self.node.addChild(newcard);
                newcard.getComponent('card').setNum(cards[index]);
                newcard.setPosition(spacing, 210);

                spacing += 300;
            }
        })

        cc.game.on("total bet", function displayAllPlayerBet(bets: number[]) {
            for (let index = 0; index < self.TotalBetLabel.length; index++) {
                self.TotalBetLabel[index].string = bets[index].toString();

            }
        })

    }

    // update (dt) {}


    /**
     * draw cards form prefab by card's length times
     * @param cards recive card number array from server
     */
    public drawCard(cards: number[]) {
        let spacing = -150;
        for (let index = 0; index < 2; index++) {
            let newcard = cc.instantiate(this.CardPrefab);
            this.node.addChild(newcard);
            newcard.getComponent('card').setNum(cards[index]);
            newcard.setPosition(spacing, 210);

            spacing += 300;
        }
    }

    /**
     * change chipbutton's label color by player select to red,
     * and reset other's to black
     * @param event recive button event
     * @param n recive button's number for array index
     */
    public hightLightChip(event, n: number) {
        this.ChipButtonLabel.forEach(element => {
            element.color = cc.color(0, 0, 0, 255);
        });
        this.ChipButtonLabel[+n].color = cc.color(255, 0, 0, 255);
    }


}
