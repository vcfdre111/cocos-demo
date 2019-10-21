// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,


    properties: {
        cardNum: {
            default: null,
        },
        displayLabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {


    },

    update(dt) {
        switch (Math.floor(this.cardNum / 13)) {
            case 0:
                this.displayLabel.string = '♣' + (this.cardNum % 13 == 0 ? 'A' : (this.cardNum % 13 + 1))
                break;
            case 1:
                this.displayLabel.string = "♦" + (this.cardNum % 13 == 0 ? 'A' : (this.cardNum % 13 + 1))
                this.node.getChildByName('New Label').color = new cc.color(255, 0, 0, 255);
                break;
            case 2:
                this.displayLabel.string = "♥" + (this.cardNum % 13 == 0 ? 'A' : (this.cardNum % 13 + 1))
                this.node.getChildByName('New Label').color = new cc.color(255, 0, 0, 255);
                break;
            case 3:
                this.displayLabel.string = "♠" + (this.cardNum % 13 == 0 ? 'A' : (this.cardNum % 13 + 1))
                break;

        }
    },
    setNum(num) {
        this.cardNum = num;
    }
});