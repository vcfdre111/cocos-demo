(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/GameServer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cfa51RwqmhPhrbPsi1N0vib', 'GameServer', __filename);
// script/GameServer.ts

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
var GameServer = /** @class */ (function (_super) {
    __extends(GameServer, _super);
    function GameServer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.GameStage = 0;
        _this.TotalRound = 0;
        _this.TimeRemain = 0;
        _this.Data = null;
        _this.PokerCard = [-1, -1];
        _this.Winner = -1;
        _this.TotalBets = [0, 0, 0];
        _this.EmptyAres = [0, 0, 0];
        _this.ws = new WebSocket("ws://localhost:2346/");
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    GameServer.prototype.onLoad = function () {
        var self = this;
        this.Data = this.getComponent("GameServerData");
        console.log("Game Start!");
        this.register_evnet();
        this.ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
        };
        this.ws.onmessage = function (event) {
            self.gameProcess(event.data);
            console.log(typeof (event.data) + " " + event.data);
        };
    };
    GameServer.prototype.start = function () {
        // this.gameProcess();
    };
    // update(dt) { }
    GameServer.prototype.register_evnet = function () {
        var self = this;
        cc.game.on("receiveLocalBet", function receiveLocalBet(name, amount, area) {
            self.TotalBets[area] += +amount;
            self.Data.PlayerMoney = -amount;
        });
        cc.game.on("getCard", function getCard() {
            cc.game.emit("returnCard", self.PokerCard);
        });
    };
    GameServer.prototype.gameProcess = function (stage) {
        switch (stage) {
            case "waiting":
                cc.game.emit("updatePlayerInformation", this.getPlayerName(), this.getPlayerMoney());
                this.gameWait(stage);
                break;
            case "bet":
                this.bet(stage);
                break;
            case "bet end":
                this.betFinish(stage);
                break;
            case "show":
                this.showResult(stage);
                break;
            case "end":
                cc.game.emit("updatePlayerInformation", this.getPlayerName(), this.getPlayerMoney());
                this.roundEnd(stage);
            default:
                break;
        }
    };
    GameServer.prototype.gameWait = function (stage) {
        console.log("Now is " + (++this.TotalRound) + " round");
        cc.game.emit("changeStage", stage);
    };
    GameServer.prototype.bet = function (stage) {
        cc.game.emit("changeStage", stage);
    };
    GameServer.prototype.betFinish = function (stage) {
        console.log("Server bets " + this.TotalBets);
        cc.game.emit("changeStage", stage);
        this.PokerCard = this.creatCard();
        this.cardResult();
    };
    GameServer.prototype.showResult = function (stage) {
        this.dealWithMoney();
        cc.game.emit("changeStage", stage);
    };
    GameServer.prototype.roundEnd = function (stage) {
        console.log("round end");
        cc.game.emit("changeStage", stage);
        this.PokerCard = [-1, -1];
        this.Winner = -1;
        this.TotalBets = this.EmptyAres.slice();
        console.log("round end bets " + this.TotalBets);
    };
    GameServer.prototype.getPlayerName = function () {
        return this.Data.PlayerName;
    };
    GameServer.prototype.getPlayerMoney = function () {
        return this.Data.PlayerMoney;
    };
    GameServer.prototype.creatCard = function () {
        var rdmArray = [2];
        for (var i = 0; i < 2; i++) {
            var rdm = 0;
            do {
                var exist = false;
                rdm = Math.floor(Math.random() * 52);
                if (rdmArray.indexOf(rdm) != -1)
                    exist = true;
            } while (exist);
            rdmArray[i] = rdm;
        }
        return rdmArray;
    };
    GameServer.prototype.cardResult = function () {
        console.log("Dora: " + (this.PokerCard[0] % 13) + " Tora: " + (this.PokerCard[1] % 13));
        if ((this.PokerCard[0] % 13) > (this.PokerCard[1] % 13)) {
            this.Winner = 0;
        }
        else if ((this.PokerCard[0] % 13) < (this.PokerCard[1] % 13)) {
            this.Winner = 2;
        }
        else {
            this.Winner = 1;
        }
        console.log("Winner is " + this.Winner);
    };
    GameServer.prototype.dealWithMoney = function () {
        if (this.Winner === 1) {
            this.Data.PlayerMoney = (this.TotalBets[this.Winner] * 9);
        }
        else {
            this.Data.PlayerMoney = (this.TotalBets[this.Winner] * 2);
        }
    };
    __decorate([
        property
    ], GameServer.prototype, "GameStage", void 0);
    __decorate([
        property
    ], GameServer.prototype, "TotalRound", void 0);
    __decorate([
        property
    ], GameServer.prototype, "TimeRemain", void 0);
    __decorate([
        property
    ], GameServer.prototype, "Data", void 0);
    __decorate([
        property
    ], GameServer.prototype, "PokerCard", void 0);
    __decorate([
        property
    ], GameServer.prototype, "Winner", void 0);
    __decorate([
        property
    ], GameServer.prototype, "TotalBets", void 0);
    GameServer = __decorate([
        ccclass
    ], GameServer);
    return GameServer;
}(cc.Component));
exports.default = GameServer;

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
        //# sourceMappingURL=GameServer.js.map
        