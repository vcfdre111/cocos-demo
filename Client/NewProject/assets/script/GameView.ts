

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

    // @property(cc.Button)
    // BetButtons: cc.Button[] = [null, null, null];

    @property(cc.Node)
    ChipButtonLabel: cc.Node[] = [null, null, null, null, null]

    @property(cc.Label)
    TotalBetLabel: cc.Label[] = [null, null, null]

    @property(cc.Prefab)
    TableChip: cc.Prefab[] = [null, null, null, null, null]

    ChipPool: cc.NodePool[] = [null, null, null, null, null];

    @property(cc.Prefab)
    WarningLabel: cc.Prefab = null;






    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.register_evnet();
        for (let i = 0; i < 5; ++i) {
            this.ChipPool[i] = new cc.NodePool();
        }

        let initCount = 1000;
        for (let i = 0; i < this.ChipPool.length; ++i) {
            for (let j = 0; j < initCount; j++) {
                let TempChip = cc.instantiate(this.TableChip[i]); // 创建节点
                this.ChipPool[i].put(TempChip); // 通过 put 接口放入对象池
            }
        }
        console.log(this.ChipPool);
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
                let time = 0;
                while (childs.length > 0 && time < 9) {
                    ++time;

                    childs.forEach(element => {


                        if (element.name == "chip_1") {
                            self.ChipPool[0].put(element);
                            console.log('chip putted to0')
                        } else if (element.name == "chip_10") {
                            self.ChipPool[1].put(element);
                            console.log('chip putted to 1')
                        } else if (element.name == "chip_50") {
                            self.ChipPool[2].put(element);
                            console.log('chip putted to 2')
                        } else if (element.name == "chip_100") {
                            self.ChipPool[3].put(element);
                            console.log('chip putted to 3')
                        } else if (element.name == "chip_500") {
                            self.ChipPool[4].put(element);
                            console.log('chip putted to 4')
                        } else {
                            console.log(element.name + '  been destroy');
                            element.destroy();
                        }
                    });
                }
                cc.game.emit("cardBack");
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
            let spacing = -115;
            for (let index = 0; index < 2; index++) {
                let newcard = cc.instantiate(self.CardPrefab);
                self.node.addChild(newcard);
                newcard.getComponent('card').setNum(cards[index]);
                newcard.setPosition(spacing, 240);

                spacing += 230;
            }
        })


        cc.game.on("total bet", function displayAllPlayerBet(bets: number[]) {
            for (let index = 0; index < self.TotalBetLabel.length; index++) {
                self.TotalBetLabel[index].string = bets[index].toString();

            }
        })

        cc.game.on("betToTable", function betToTable(area: number, chip: number, loacl: boolean) {
            let temp = -1;
            let position = cc.v2(0, -200);
            switch (+chip) {
                case 1:
                    temp = 0;
                    position = cc.v2(25, -250);
                    break;
                case 10:
                    temp = 1;
                    position = cc.v2(125, -250);
                    break;
                case 50:
                    temp = 2;
                    position = cc.v2(225, -250);
                    break;
                case 100:
                    temp = 3;
                    position = cc.v2(325, -250);
                    break;
                case 500:
                    temp = 4;
                    position = cc.v2(425, -250);
                    break;
            }
            let TempChip = null;
            if (self.ChipPool[temp].size() > 0) {
                TempChip = self.ChipPool[temp].get();
                console.log('created form pool');
            } else {
                TempChip = cc.instantiate(self.TableChip[temp]);
                console.log('created new one');
            }

            self.node.addChild(TempChip);
            if (loacl) {
                TempChip.setPosition(position);
            } else {
                TempChip.setPosition(-480, -320)
            }
            let goal;
            switch (+area) {
                case 0:
                    goal = cc.v2(-250, 0);
                    break;
                case 1:
                    goal = cc.v2(0, 0);
                    break;
                case 2:
                    goal = cc.v2(250, 0);
                    break;
                default:
                    break;
            }
            TempChip.getComponent('Chip').init(goal, self.ChipPool[temp]);
        })

        cc.game.on("callWarningLabel", function callWarningLabel(text: string) {
            let newlabel = cc.instantiate(self.WarningLabel);
            self.node.addChild(newlabel);
            newlabel.getComponent(cc.Label).string = text;
        })
    }

    // update (dt) {}




    /**
     * change chipbutton's label color by player select to red,
     * and reset other's to black
     * @param event recive button event
     * @param n recive button's number for array index
     */
    public hightLightChip(event, n: number) {
        this.ChipButtonLabel.forEach(element => {
            element.active = false;
        });
        this.ChipButtonLabel[+n].active = true;
    }


}
