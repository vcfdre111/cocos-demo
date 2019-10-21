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
        Hands:{
            default:[],
            type: cc.ValueType
        },

        cardPrefab:{
            default: null,
            type: cc.Prefab
        },
        times:{
            default: [],
            type: cc.ValueType

        },
    },
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.times=[0,0,0,0,0,0,0,0,0,0,0,0,0]
    },

    start () {
        this.Hands=this.getRandomArray(0,51,5);
        this.drawCard();
        
        for (let index = 0; index < 5; index++) {
            this.times[this.Hands[index]%13]++
        }
        console.log(this.times);
        this.checkFalsh();
        console.log('Falsh: '+this.checkFalsh());
        
    },

    update (dt) {
        
    },

    drawCard: function(){
        var spacing =-300;
        for (let index = 0; index < 5; index++) {
            var newcard= cc.instantiate(this.cardPrefab);
            this.node.addChild(newcard);
            newcard.getComponent('card').setNum(this.Hands[index]);
            newcard.setPosition(spacing,0);
            
            spacing+=150;
        }
    },

    getRandomArray: function(minNum, maxNum, n) {    //隨機產生不重覆的n個數字
        var rdmArray = [n];     //儲存產生的陣列
    
        for(var i=0; i<n; i++) {
            var rdm = 0;        //暫存的亂數
    
            do {
                var exist = false;          //此亂數是否已存在
                rdm =this.getRandom(minNum, maxNum);    //取得亂數
                
                //檢查亂數是否存在於陣列中，若存在則繼續回圈
                if(rdmArray.indexOf(rdm) != -1) exist = true;
                
            } while (exist);    //產生沒出現過的亂數時離開迴圈
            
            rdmArray[i] = rdm;
        }
        return rdmArray;
    },
    getRandom: function (minNum, maxNum) { //取得 minNum(最小值) ~ maxNum(最大值) 之間的亂數
        return Math.floor( Math.random() * (maxNum - minNum + 1) ) + minNum;
    },

    checkFalsh: function(){
        var suitCount=[0,0,0,0];
        for (let index = 0; index <5; index++) {
            suitCount[Math.floor(this.Hands[index]/13)]++;
        }
        for (let index = 0; index < suitCount.length; index++) {
            if(suitCount[index]==5){
                return true;
            }
            
        }
        return false;
    },
    checkStraight: function(){
        for (let index = 0; index < 11; index++) {
            if(this.times[index]==1){
                console.log('Checking straight...');
                for (let j = index+1; j < index+5; j++) {
                    console.log('checking '+(index+2)+"at"+(j-index)+"times")
                    if(this.times[j]!=1){
                        console.log('Not'+(index+2))
                        break;
                    }
                    if(j == index+4){
                    console.log("It's"+(index+2)+"straignt");
                    return true;
                    
                    }
                }
            }
            
            
        }return false;
    },
    reDraw: function(){
        this.node.destroyAllChildren();
        this.onLoad();
        this.start();
        console.log(this.Hands);
        
    },
    testStr: function(){
        var count=0
        while(!this.checkStraight()&&count<500){
            console.log('this is '+count+' times test');
            this.reDraw();
            count++;
        }
    }
});
