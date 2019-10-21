"use strict";
cc._RF.push(module, '11a5af1h21D24MXlGXgIq8R', 'GameCtrl');
// script/GameCtrl.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Phase;
(function (Phase) {
    Phase[Phase["Waiting"] = 0] = "Waiting";
    Phase[Phase["Betting"] = 1] = "Betting";
    Phase[Phase["BetEnd"] = 2] = "BetEnd";
    Phase[Phase["Result"] = 3] = "Result";
    Phase[Phase["Ending"] = 4] = "Ending";
})(Phase = exports.Phase || (exports.Phase = {}));
var GameCtrl = /** @class */ (function (_super) {
    __extends(GameCtrl, _super);
    function GameCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Model = null;
        _this.betTime = false;
        _this.GameStage = [0, 0];
        _this.Chip = 0;
        return _this;
    }
    GameCtrl.prototype.onLoad = function () {
        this.register_evnet();
        this.Model = this.getComponent("GameModel");
    };
    // start() { }
    /**
     * register evnet table
     */
    GameCtrl.prototype.register_evnet = function () {
        var self = this;
        cc.game.on("changeStage", function changeClientStage(stage) {
            switch (stage) {
                case "waiting":
                    cc.game.emit("changePhaseLabel", "Waiting Phase");
                    break;
                case "bet":
                    cc.game.emit("changePhaseLabel", "Betting Phase");
                    self.betTime = !self.betTime;
                    break;
                case "bet end":
                    cc.game.emit("changePhaseLabel", "Bet end");
                    self.betTime = !self.betTime;
                    break;
                case "show":
                    cc.game.emit("changePhaseLabel", "Result Phase");
                    self.getGameResult();
                    break;
                case "end":
                    cc.game.emit("changePhaseLabel", "Ending Phase");
                    cc.game.emit("clearCard");
                    cc.game.emit("clearBet");
                    for (var index = 0; index < 3; index++) {
                        self.changeBetLabel(index, 0);
                    }
                    break;
                default:
                    break;
            }
        });
        cc.game.on("stageTime", function stageTime(time) {
            cc.game.emit("updateTime", time);
        });
        cc.game.on("returnCard", function sendCard(card) {
            cc.game.emit("drawCard", card);
        });
        cc.game.on("updatePlayerInformation", function returnPlayerInformation(name, money) {
            cc.game.emit("setPlayerInformation", name, money);
            cc.game.emit("setName", self.Model.LocalPlayerName);
            cc.game.emit("updateMoney", self.Model.LocalPlayerMoney);
        });
    };
    // update (dt) {}
    GameCtrl.prototype.chipSelect = function (event, amount) {
        console.log(this.Chip = amount);
    };
    GameCtrl.prototype.betting = function (event, area) {
        if ((this.Model.LocalPlayerMoney - this.Chip >= 0) && this.betTime) {
            this.Model.LocalPlayerMoney -= this.Chip;
            cc.game.emit("addBet", this.Chip, area);
            cc.game.emit("receiveLocalBet", this.Model.LocalPlayerName, this.Chip, area);
            ;
        }
        else if (!this.betTime) {
            console.log("not bet time");
        }
        else {
            console.log("Betting fail,not enough money");
        }
        this.changeBetLabel(area, this.Model.getLocalbet()[area]);
        cc.game.emit("updateMoney", this.Model.LocalPlayerMoney);
    };
    GameCtrl.prototype.changeBetLabel = function (area, amount) {
        cc.game.emit("playerBetDisplay", area, amount);
    };
    GameCtrl.prototype.getGameResult = function () {
        cc.game.emit("getCard");
    };
    __decorate([
        property
    ], GameCtrl.prototype, "Model", void 0);
    __decorate([
        property
    ], GameCtrl.prototype, "betTime", void 0);
    __decorate([
        property
    ], GameCtrl.prototype, "GameStage", void 0);
    __decorate([
        property
    ], GameCtrl.prototype, "Chip", void 0);
    GameCtrl = __decorate([
        ccclass
    ], GameCtrl);
    return GameCtrl;
}(cc.Component));
exports.default = GameCtrl;

cc._RF.pop();