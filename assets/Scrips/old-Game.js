if(!cc.runtime){

var ANIMATION_NAME=["walk","jump","fall"];
cc.Class({
    extends: cc.Component,

    properties: {
        player1:{
            default:null,
            type:cc.Node
        },
        player2:{
            default:null,
            type:cc.Node
        },
        roundDispalyer:{
            default:null,
            type:cc.Label
        },
        inputer:{
            default:null,
            type:cc.EditBox
        },
        damageDisplayer1:{
            default:null,
            type:cc.Label
        },
        damageDisplayer2:{
            default:null,
            type:cc.Label
        },
        hpDisplayer1:{
            default:null,
            type:cc.ProgressBar
        },
        hpDisplayer2:{
            default:null,
            type:cc.ProgressBar
        },

        _roundData:[],
        _armature:[],
        _attackerFlag:1,
        _typeFlag:0,
        _superAttack:0,
        _damage:0,
        _HP1:1000,
        _HP2:1000,
        _presentRound:0,
        _totalRound:0,
        
    },

    // use this for initialization
    onLoad: function () {
        this._armatureDisplay1 = this.player1.getComponent(dragonBones.ArmatureDisplay);
        this._armatureDisplay2 = this.player2.getComponent(dragonBones.ArmatureDisplay);
        this._armature1 = this._armatureDisplay1.armature();
        this._armature2 = this._armatureDisplay2.armature();
        this._armature = [this._armature1,this._armature2];
        this.damageDisplayer=[this.damageDisplayer1,this.damageDisplayer2];

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: (keyCode, event) => {
                this._keyHandler(keyCode, true);
            },
            onKeyReleased: (keyCode, event) => {
                this._keyHandler(keyCode, false);
            },
        }, this.node);
    },
    
    _keyHandler:function(keyCode,isDown){
        switch(keyCode){
            case cc.KEY.space:
                if (isDown){
                    this._gamePlay();
                }
                break;
            default:
                return;
        }
    },
    
    _gamePlay:function(){
        this._roundData=this.inputer.string.split(',');
        this._attackerFlag=this._roundData[0];
        this._typeFlag=this._roundData[1];
        this._superAttack=this._roundData[2];
        this._damage=this._roundData[3];
        this._HP1=this._roundData[4];
        this._HP2=this._roundData[5];
        this._presentRound=this._roundData[6];
        this._totalRound=this._roundData[7];
        this._armature[this._attackerFlag].animation.play(ANIMATION_NAME[this._typeFlag], -1);
        this.player1.runAction(cc.moveTo(0.5,80,-150));
        this.damageDisplayer[this._attackerFlag].node.opacity=0;
        this.damageDisplayer[1-this._attackerFlag].node.opacity=255;
        this.damageDisplayer[1-this._attackerFlag].string=this._damage.toString();
        this.hpDisplayer1.progress=this._HP1/1000;
        this.hpDisplayer2.progress=this._HP2/1000;
        this.roundDispalyer.string=this._presentRound.toString();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
}