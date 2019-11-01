const { ccclass, property } = cc._decorator;

@ccclass
export default class Chip extends cc.Component {
    motherPool: cc.NodePool;
    @property(cc.AudioClip)
    BetBtnAudio: cc.AudioClip = null;

    public init(goal: cc.Vec2, mother: cc.NodePool) {
        let actoin = cc.moveTo(0.2, this.random(goal.x), this.random(goal.y - 20));
        this.node.runAction(actoin);
        this.motherPool = mother;
        let self = this;
        this.node.getComponent("Chip").scheduleOnce(function name() {
            cc.audioEngine.playEffect(self.BetBtnAudio, false);
        }, 0.2)

    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    //start () {}

    random(center: number) {
        return Math.floor(Math.random() * ((center + 70) - (center - 70))) + (center - 70);
    }

}
