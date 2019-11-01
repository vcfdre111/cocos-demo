const { ccclass, property } = cc._decorator;

@ccclass
export default class WarningLabel extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad() { }

    start() {
        let action = cc.sequence(
            cc.moveBy(0.5, 0, 50),
            cc.hide()
        )
        this.node.runAction(action);
    }


    // update (dt) {}
}
