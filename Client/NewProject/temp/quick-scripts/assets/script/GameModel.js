(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/GameModel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '489desEsd1DaZ1nSmLKUj94', 'GameModel', __filename);
// script/GameModel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameModel = /** @class */ (function (_super) {
    __extends(GameModel, _super);
    function GameModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.LocalPlayerName = "null";
        _this.LocalPlayerMoney = 0;
        _this.LocalPlayerBet = [0, 0, 0];
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    GameModel.prototype.onLoad = function () {
        this.register_evnet();
    };
    // start() {}
    GameModel.prototype.register_evnet = function () {
        var self = this;
        cc.game.on("addBet", function addBet(amount, area) {
            self.LocalPlayerMoney - +amount;
            self.LocalPlayerBet[area] += +amount;
            console.log(self.LocalPlayerBet);
        });
        cc.game.on("clearBet", function clearBet() {
            self.LocalPlayerBet = [0, 0, 0];
        });
        cc.game.on("setPlayerInformation", function setPlayerInformation(n, m) {
            self.LocalPlayerName = n;
            self.LocalPlayerMoney = m;
        });
    };
    GameModel.prototype.getLocalbet = function () {
        return this.LocalPlayerBet;
    };
    __decorate([
        property
    ], GameModel.prototype, "LocalPlayerName", void 0);
    __decorate([
        property
    ], GameModel.prototype, "LocalPlayerMoney", void 0);
    __decorate([
        property
    ], GameModel.prototype, "LocalPlayerBet", void 0);
    GameModel = __decorate([
        ccclass
    ], GameModel);
    return GameModel;
}(cc.Component));
exports.default = GameModel;

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
        //# sourceMappingURL=GameModel.js.map
        