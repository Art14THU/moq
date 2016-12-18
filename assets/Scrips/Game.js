if(!cc.runtime){

var ATTACK_TYPE=["fierce","ridicule","funny","white","curse","cold"];
var BEAT_TYPE=["blood","wronged","cry","ashamed","beat","fuck"];
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
        actions:{
            default:null,
            type:cc.SpriteAtlas
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
        
        _positionX:0,
        _positionY:0,
        _nowAttackPic:null,
        _nowBeatPic:null,
        
        _gamePlayDuration:1,
    },

    // use this for initialization
    onLoad: function () {
        this.damageDisplayer=[this.damageDisplayer1,this.damageDisplayer2];
        this.players=[this.player1,this.player2];

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
                    this._readData();
                }
                break;
            case cc.KEY.p:
                if(isDown){
                    this._gamePlay();
                }
                break;
            case cc.KEY.r:
                if (isDown){
                    this._return();
                }
                break;
            default:
                return;
        }
    },
    
    _readData:function(){
        this._roundData=this.inputer.string.split(',');
        this._attackerFlag=this._roundData[0];
        this._typeFlag=this._roundData[1];
        this._superAttack=this._roundData[2];
        this._damage=this._roundData[3];
        this._HP1=this._roundData[4];
        this._HP2=this._roundData[5];
        this._presentRound=this._roundData[6];
        this._totalRound=this._roundData[7];
        
        this._positionX=this.players[this._attackerFlag].getPositionX();
        this._positionY=this.players[this._attackerFlag].getPositionY();
    },
    
    _gamePlay:function(){
        this._nowAttackPic='p1-0-'+ATTACK_TYPE[this._typeFlag-1]+'-'+this._superAttack.toString();
        this._nowBeatPic='p1-1-'+BEAT_TYPE[this._typeFlag-1]+'-'+this._superAttack.toString();
        this.players[this._attackerFlag].getComponent(cc.Sprite).spriteFrame=this.actions.getSpriteFrame(this._nowAttackPic);
        this.players[this._attackerFlag].runAction(cc.moveTo(0.1,(0.5-this._attackerFlag)*100,this._positionY));
        this.players[1-this._attackerFlag].getComponent(cc.Sprite).spriteFrame=this.actions.getSpriteFrame(this._nowBeatPic);
        this.damageDisplayer[this._attackerFlag].node.opacity=0;
        this.damageDisplayer[1-this._attackerFlag].node.opacity=255;
        this.damageDisplayer[1-this._attackerFlag].string='-'+this._damage.toString();
        this.hpDisplayer1.progress=this._HP1/1000;
        this.hpDisplayer2.progress=this._HP2/1000;
        this.roundDispalyer.string=this._presentRound.toString();
        this.scheduleOnce(function(){
            this._return();
        },this._gamePlayDuration);
    },
    
    _return:function(){
        this.players[0].getComponent(cc.Sprite).spriteFrame=this.actions.getSpriteFrame('p1-0-cold-0');
        this.players[1].getComponent(cc.Sprite).spriteFrame=this.actions.getSpriteFrame('p1-0-cold-0');
        this.players[this._attackerFlag].runAction(cc.moveTo(0.1,this._positionX,this._positionY));
        this.damageDisplayer[0].node.opacity=0;
        this.damageDisplayer[1].node.opacity=0;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
}