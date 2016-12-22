if(!cc.runtime){

var ATTACK_TYPE_1=["fierce","ridicule","funny","white","curse","cold"];
var BEAT_TYPE_1=["blood","wronged","cry","ashamed","beat","fuck"];
var ATTACK_TYPE_2=["disdain","funny","simple","angry","cold","vulgar"];
var BEAT_TYPE_2=["refute","dare","sulk","frighten","wronged","leave"];
var ATTACK_TYPE=[ATTACK_TYPE_1,ATTACK_TYPE_2];
var BEAT_TYPE=[BEAT_TYPE_1,BEAT_TYPE_2];
var SCALES=[0.3,0.35];
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
            type:cc.Label
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
        actionp1:{
            default:null,
            type:cc.SpriteAtlas
        },
        actionp2:{
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

        _positionX:0,
        _positionY:0,
        _nowAttackPic:null,
        _nowBeatPic:null,
        _yourPindex:0,
        _yourP:null,
        _enemyP:null,
        _attackPindex:0,
        
        _gamePlayDuration:1,
        
    },

    // use this for initialization
    onLoad: function () {
        this.damageDisplayer=[this.damageDisplayer1,this.damageDisplayer2];
        this.players=[this.player1,this.player2];
        //所有表情图集集合
        this.actionp=[this.actionp1,this.actionp2];
        this._yourPindex=Math.round(Math.random());
        //玩家的表情图集 type:cc.SpriteAtlas
        this._yourP=this.actionp[this._yourPindex];
        //对手的表情图集 type:cc.SpriteAtlas
        this._enemyP=this.actionp[1-this._yourPindex];
        
        this.player1.getComponent(cc.Sprite).spriteFrame=this._yourP.getSpriteFrame("p"+(this._yourPindex+1).toString()+"-0-cold-0");
        this.player1.scaleX=((0.5-this._yourPindex)*2)*SCALES[this._yourPindex];
        this.player1.scaleY=SCALES[this._yourPindex];
        this.player2.getComponent(cc.Sprite).spriteFrame=this._enemyP.getSpriteFrame("p"+(2-this._yourPindex).toString()+"-0-cold-0");
        this.player2.scaleX=((0.5-this._yourPindex)*2)*SCALES[1-this._yourPindex];
        this.player2.scaleY=SCALES[1-this._yourPindex];

        this.node.on('getResult',function(event){
            this._readData(); 
        }, this);
        
        InitLanguageAnalysis();
        this.node.dispatchEvent( new cc.Event.EventCustom('playerExchange',true) );
    },
    
    _readData:function(){
        this._roundData=OneRoundLanguageAnalysis(this.inputer.string).split(',');
        
        this._attackerFlag=this._roundData[0];
        this._typeFlag=this._roundData[1];
        this._superAttack=this._roundData[2];
        this._damage=this._roundData[3];
        this._HP1=this._roundData[4];
        this._HP2=this._roundData[5];
        this._presentRound=this._roundData[6];

        this._positionX=this.players[this._attackerFlag].getPositionX();
        this._positionY=this.players[this._attackerFlag].getPositionY();
        
        this._gamePlay();
    },
    
    _gamePlay:function(){
        this._attackPindex=Math.abs(this._attackerFlag-this._yourPindex);
        this._nowAttackPic='p'+(this._attackPindex+1).toString()+'-0-'+ATTACK_TYPE[this._attackPindex][this._typeFlag]+'-'+this._superAttack.toString();
        this._nowBeatPic='p'+(2-this._attackPindex).toString()+'-1-'+BEAT_TYPE[1-this._attackPindex][this._typeFlag]+'-'+this._superAttack.toString();
        this.players[this._attackerFlag].getComponent(cc.Sprite).spriteFrame=this.actionp[this._attackPindex].getSpriteFrame(this._nowAttackPic);
        this.players[this._attackerFlag].runAction(cc.moveTo(0.1,(0.5-this._attackerFlag)*100,this._positionY));
        this.players[1-this._attackerFlag].getComponent(cc.Sprite).spriteFrame=this.actionp[1-this._attackPindex].getSpriteFrame(this._nowBeatPic);
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
        this.player1.getComponent(cc.Sprite).spriteFrame=this._yourP.getSpriteFrame("p"+(this._yourPindex+1).toString()+"-0-cold-0");
        this.player2.getComponent(cc.Sprite).spriteFrame=this._enemyP.getSpriteFrame("p"+(2-this._yourPindex).toString()+"-0-cold-0");
        this.players[this._attackerFlag].runAction(cc.moveTo(0.1,this._positionX,this._positionY));
        this.damageDisplayer[0].node.opacity=0;
        this.damageDisplayer[1].node.opacity=0;
        
        this._exchange();
    },
    
    _exchange:function(){
        this.node.dispatchEvent( new cc.Event.EventCustom('playerExchange',true) );
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
}