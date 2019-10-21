(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/card.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '974c0n6FnREsLCyIgkPmZ/X', 'card', __filename);
// script/card.js

'use strict';

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
            default: null
        },
        displayLabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    update: function update(dt) {
        switch (Math.floor(this.cardNum / 13)) {
            case 0:
                this.displayLabel.string = '♣' + (this.cardNum % 13 == 0 ? 'A' : this.cardNum % 13 + 1);
                break;
            case 1:
                this.displayLabel.string = "♦" + (this.cardNum % 13 == 0 ? 'A' : this.cardNum % 13 + 1);
                this.node.getChildByName('New Label').color = new cc.color(255, 0, 0, 255);
                break;
            case 2:
                this.displayLabel.string = "♥" + (this.cardNum % 13 == 0 ? 'A' : this.cardNum % 13 + 1);
                this.node.getChildByName('New Label').color = new cc.color(255, 0, 0, 255);
                break;
            case 3:
                this.displayLabel.string = "♠" + (this.cardNum % 13 == 0 ? 'A' : this.cardNum % 13 + 1);
                break;

        }
    },
    setNum: function setNum(num) {
        this.cardNum = num;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=card.js.map
        