"use strict";
cc._RF.push(module, '5b14cH5woBOPawz6xEv5DdK', 'GameView');
// script/GameView.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameView = /** @class */ (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.PlayerName = null;
        _this.PlayerMoney = null;
        _this.PhaseLabel = null;
        _this.Time = null;
        _this.PlayerDBet = null;
        _this.PlayerDrBet = null;
        _this.PlayerTBet = null;
        _this.CardPrefab = null;
        _this.BetButtons = [null, null, null];
        _this.ChipButtonLabel = [null, null, null, null, null];
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    GameView.prototype.onLoad = function () {
        this.register_evnet();
    };
    // start() { }
    GameView.prototype.register_evnet = function () {
        var self = this;
        cc.game.on("changePhaseLabel", 
        /**
         * change phase label to current phase
         * @param n recive phase name
         */
        function changePhaseLabel(n) {
            self.PhaseLabel.string = n;
        });
        cc.game.on("clearCard", 
        /**
         * destory all displayed card
         */
        function clearCard() {
            var childs = self.node.children;
            childs.forEach(function (element) {
                element.destroy();
            });
        });
        cc.game.on("setName", 
        /**
         * set player's name label
         * @param n recive player's name
         */
        function setName(n) {
            self.PlayerName.string = n;
        });
        cc.game.on("updateMoney", 
        /**
         * update player's money
         * @param money recive player's money
         */
        function updateMoney(money) {
            self.PlayerMoney.string = money.toString();
        });
        cc.game.on("updateTime", 
        /**
         * update current phase's time
         * @param n recive remaining time
         */
        function updateTime(n) {
            self.Time.string = (+n).toString();
        });
        cc.game.on("playerBetDisplay", function playerBetDisplay(area, bet) {
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
        });
        cc.game.on("drawCard", function drawCard(cards) {
            var spacing = -150;
            for (var index = 0; index < 2; index++) {
                var newcard = cc.instantiate(self.CardPrefab);
                self.node.addChild(newcard);
                newcard.getComponent('card').setNum(cards[index]);
                newcard.setPosition(spacing, 210);
                spacing += 300;
            }
        });
    };
    // update (dt) {}
    /**
     * draw cards form prefab by card's length times
     * @param cards recive card number array from server
     */
    GameView.prototype.drawCard = function (cards) {
        var spacing = -150;
        for (var index = 0; index < 2; index++) {
            var newcard = cc.instantiate(this.CardPrefab);
            this.node.addChild(newcard);
            newcard.getComponent('card').setNum(cards[index]);
            newcard.setPosition(spacing, 210);
            spacing += 300;
        }
    };
    /**
     * change chipbutton's label color by player select to red,
     * and reset other's to black
     * @param event recive button event
     * @param n recive button's number for array index
     */
    GameView.prototype.hightLightChip = function (event, n) {
        this.ChipButtonLabel.forEach(function (element) {
            element.color = cc.color(0, 0, 0, 255);
        });
        this.ChipButtonLabel[+n].color = cc.color(255, 0, 0, 255);
    };
    __decorate([
        property(cc.Label)
    ], GameView.prototype, "PlayerName", void 0);
    __decorate([
        property(cc.Label)
    ], GameView.prototype, "PlayerMoney", void 0);
    __decorate([
        property(cc.Label)
    ], GameView.prototype, "PhaseLabel", void 0);
    __decorate([
        property(cc.Label)
    ], GameView.prototype, "Time", void 0);
    __decorate([
        property(cc.Label)
    ], GameView.prototype, "PlayerDBet", void 0);
    __decorate([
        property(cc.Label)
    ], GameView.prototype, "PlayerDrBet", void 0);
    __decorate([
        property(cc.Label)
    ], GameView.prototype, "PlayerTBet", void 0);
    __decorate([
        property(cc.Prefab)
    ], GameView.prototype, "CardPrefab", void 0);
    __decorate([
        property(cc.Button)
    ], GameView.prototype, "BetButtons", void 0);
    __decorate([
        property(cc.Node)
    ], GameView.prototype, "ChipButtonLabel", void 0);
    GameView = __decorate([
        ccclass
    ], GameView);
    return GameView;
}(cc.Component));
exports.default = GameView;

cc._RF.pop();