"use strict";
cc._RF.push(module, '07751tnlXRJ/LGDf+hd804t', 'GameServerData');
// script/GameServerData.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameServerData = /** @class */ (function (_super) {
    __extends(GameServerData, _super);
    function GameServerData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._PlayerName = "player1";
        _this._PlayerMoney = 5000;
        return _this;
    }
    Object.defineProperty(GameServerData.prototype, "PlayerName", {
        get: function () {
            console.log("name getted");
            return this._PlayerName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameServerData.prototype, "PlayerMoney", {
        get: function () {
            console.log("money getted");
            return this._PlayerMoney;
        },
        set: function (n) {
            console.log(n + " money setted");
            this._PlayerMoney += n;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        property
    ], GameServerData.prototype, "_PlayerName", void 0);
    __decorate([
        property
    ], GameServerData.prototype, "PlayerName", null);
    GameServerData = __decorate([
        ccclass
    ], GameServerData);
    return GameServerData;
}(cc.Component));
exports.default = GameServerData;

cc._RF.pop();