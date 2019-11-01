const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimCtrl extends cc.Component {

    @property
    armatureDisplay: dragonBones.ArmatureDisplay;

    @property
    armature: dragonBones.Armature;

    @property(cc.AudioClip)
    ShowCard: cc.AudioClip = null;

    @property(cc.AudioClip)
    WinnerAudio: cc.AudioClip[] = [null, null, null];

    cards: number[];
    // LIFE-CYCLE CALLBACKS:
    winner: number;

    onLoad() {
        this.armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        this.armature = this.armatureDisplay.armature();
        this.register_evnet();
    }

    register_evnet() {

        let self = this;

        this.addListener(this);


        cc.game.on('drawCardAnim', function drawCardAnim(card: number[]) {
            self.cards = card;
            self.armatureDisplay.playAnimation('Switch', -1);
        })

        cc.game.on("cardBack", function cardBack() {
            self.armatureDisplay.armatureName = "Expecting";
            self.addListener();
            self.armatureDisplay.playAnimation('Card_L', -1);
        })

        cc.game.on("sendWinner", function setWinner(n: number) {
            self.winner = n;
        })
        cc.game.on("winAnim", function winAnim() {
            self.armatureDisplay.armatureName = "DragonTiger";
            self.addListener();
            switch (self.winner) {
                case 0:
                    self.armatureDisplay.playAnimation('Dragon', -1);
                    break;
                case 1:
                    self.armatureDisplay.playAnimation('Draw', -1);
                    break;
                case 2:
                    self.armatureDisplay.playAnimation('Tiger', -1);
                    break;
                default:
                    break;
            }
        })
    }
    addListener(self) {
        self = this;
        self.armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, function name(event) {
            switch (self.armatureDisplay.animationName) {
                case 'Card_L':
                    self.armatureDisplay.playAnimation('Card_R', -1);
                    break;
                case 'Switch':
                    cc.game.emit("drawCard", self.cards);
                    cc.game.emit("winAnim");
                    break;


                default:
                    break;
            }
        })
        self.armatureDisplay.addEventListener(dragonBones.EventObject.START, function name(event) {
            switch (self.armatureDisplay.animationName) {
                case 'Switch':
                    cc.audioEngine.playEffect(self.ShowCard, false);
                    break;
                case 'Dragon': case 'Draw': case 'Tiger':
                    cc.audioEngine.playEffect(self.WinnerAudio[self.winner], false);
                default:
                    break;
            }
        })
    }
    //start() {}

    // update (dt) {}
}
