var ATTACK_TYPE_1=["cold","funny","ridicule","fierce","white","curse"];
var BEAT_TYPE_1=["blood","wronged","cry","ashamed","beat","fuck"];
var ATTACK_TYPE_2=["disdain","funny","simple","angry","cold","vulgar"];
var BEAT_TYPE_2=["refute","dare","sulk","frighten","wronged","leave"];
var ATTACK_TYPE=[ATTACK_TYPE_1,ATTACK_TYPE_2];
var BEAT_TYPE=[BEAT_TYPE_1,BEAT_TYPE_2];
var SCALES=[0.4,0.45];
var COLOR=[[255,0,0],[0,255,0],[0,0,255],[255,235,4],[255,127,0],[0,255,255]];
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
        actionp12:{
            default:null,
            type:cc.SpriteAtlas
        },
        actionp22:{
            default:null,
            type:cc.SpriteAtlas
        },
        background:{
            default:null,
            type:cc.Node
        },
        superBackground:{
            default:null,
            type:cc.Node
        },
        winLose:{
            default:null,
            type:cc.Node
        },
        winLoseP:{
            default:null,
            type:cc.SpriteAtlas
        },
        winLoseBG:{
            default:null,
            type:cc.Node
        },
        winLoseBGP:{
            default:null,
            type:cc.SpriteAtlas
        },
        gameOverB:{
            default:null,
            type:cc.Node
        },
        arrow:{
            default:null,
            type:cc.Node
        },
        resultShower:{
            default:null,
            type:cc.Label
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
        _nowColor:0,
        _superColor:null,
        _red:0,
        _blue:0,
        _x:0,
        _gamePlayFlag:false,
        
        gamePlayDuration:1,
        superspeed:20,
        returnDuration:0.2,
    },

    // use this for initialization
    onLoad: function () {
        this.damageDisplayer=[this.damageDisplayer1,this.damageDisplayer2];
        this.players=[this.player1,this.player2];
        //所有表情图集集合
        this.actionp=[this.actionp1,this.actionp2];
        this.idlep=[this.actionp12,this.actionp22];
        this._yourPindex=Math.round(Math.random());
        //玩家的表情图集 type:cc.SpriteAtlas
        this._yourP=this.actionp[this._yourPindex];
        this._yourIdleP=this.idlep[this._yourPindex];
        //对手的表情图集 type:cc.SpriteAtlas
        this._enemyP=this.actionp[1-this._yourPindex];
        this._enemyIdleP=this.idlep[1-this._yourPindex];
        
        this.player1.getComponent(cc.Sprite).spriteFrame=this._yourIdleP.getSpriteFrame("p"+(this._yourPindex+1).toString()+"-idle");
        this.player1.scaleX=((0.5-this._yourPindex)*2)*SCALES[this._yourPindex];
        this.player1.scaleY=SCALES[this._yourPindex];
        this.player2.getComponent(cc.Sprite).spriteFrame=this._enemyIdleP.getSpriteFrame("p"+(2-this._yourPindex).toString()+"-idle");
        this.player2.scaleX=((0.5-this._yourPindex)*2)*SCALES[1-this._yourPindex];
        this.player2.scaleY=SCALES[1-this._yourPindex];

        this.node.on('getResult',function(event){
            this._readData(); 
        }, this);
        
        this._roundData=InitLanguageAnalysis();
        this._attackerFlag=this._roundData[0];
        this.arrow.opacity=255;
        this.arrow.x=(this._attackerFlag-0.5)*540;
    },
    
    _readData:function(){
        this._roundData=OneRoundLanguageAnalysis(this.inputer.string).split(',');
        this.resultShower.string=this.inputer.string;
        
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
        this._gamePlayFlag=true;
        this.arrow.opacity=0;
        this.resultShower.node.y=-800;
        this.resultShower.node.opacity=255;
        this.resultShower.node.color=new cc.color(COLOR[this._typeFlag][0], COLOR[this._typeFlag][1], COLOR[this._typeFlag][2], 255);

        this._attackPindex=Math.abs(this._attackerFlag-this._yourPindex);
        this._nowAttackPic='p'+(this._attackPindex+1).toString()+'-0-'+ATTACK_TYPE[this._attackPindex][this._typeFlag]+'-0';
        this._nowBeatPic='p'+(2-this._attackPindex).toString()+'-1-'+BEAT_TYPE[1-this._attackPindex][this._typeFlag]+'-0';
        this.players[this._attackerFlag].getComponent(cc.Sprite).spriteFrame=this.actionp[this._attackPindex].getSpriteFrame(this._nowAttackPic);
        this.players[this._attackerFlag].runAction(cc.moveTo(0.1,(0.5-this._attackerFlag)*0,this._positionY));
        this.players[1-this._attackerFlag].getComponent(cc.Sprite).spriteFrame=this.actionp[1-this._attackPindex].getSpriteFrame(this._nowBeatPic);
        this.players[1-this._attackerFlag].runAction(cc.moveTo(0.1,(0.5-this._attackerFlag)*800,this._positionY));
        this.damageDisplayer[this._attackerFlag].node.opacity=0;
        this.damageDisplayer[1-this._attackerFlag].node.opacity=255;
        this.damageDisplayer[1-this._attackerFlag].string='-'+this._damage.toString();
        this.hpDisplayer1.progress=this._HP1/1000;
        this.hpDisplayer2.progress=this._HP2/1000;
        this.roundDispalyer.string=this._presentRound.toString();
        
        this.nowColor=255-(this._damage-80)*2;
            if(this.nowColor<=0){
                this.nowColor=0;
            }
            else if(this.nowColor>=255){
                this.nowColor=255;
            }

        if(this._superAttack==0){
            this.background.color=new cc.color(255, this.nowColor, this.nowColor, 255);
            this.background.runAction(cc.moveTo(0.1,(0.5-this._attackerFlag)*(255-this.nowColor)/5,0));
        }
        
        else {
            this.superBackground.opacity=255;
            this.background.runAction(cc.moveTo(0.1,(0.5-this._attackerFlag)*(255-this.nowColor)/5,0));
            this.damageDisplayer[1-this._attackerFlag].node.color=new cc.color(255,0,0,255);
            this.damageDisplayer[1-this._attackerFlag].node.scaleX=2;
            this.damageDisplayer[1-this._attackerFlag].node.scaleY=2;
        }

        this.scheduleOnce(function(){
            this._return();
        },this.gamePlayDuration);
    },
    
    _return:function(){
        this.player1.getComponent(cc.Sprite).spriteFrame=this._yourIdleP.getSpriteFrame("p"+(this._yourPindex+1).toString()+"-idle");
        this.player2.getComponent(cc.Sprite).spriteFrame=this._enemyIdleP.getSpriteFrame("p"+(2-this._yourPindex).toString()+"-idle");
        this.players[this._attackerFlag].runAction(cc.moveTo(0.1,this._positionX,this._positionY));
        this.players[1-this._attackerFlag].runAction(cc.moveTo(0.1,-this._positionX,this._positionY));
        this.damageDisplayer[0].node.opacity=0;
        this.damageDisplayer[1].node.opacity=0;
        
        this.superBackground.opacity=0;
        this.background.color=new cc.color(255, 255, 255, 255);
        this.background.runAction(cc.moveTo(0.1,0,0));
        this.damageDisplayer[1-this._attackerFlag].node.color=new cc.color(255,255,0,255);
        this.damageDisplayer[1-this._attackerFlag].node.scaleX=1;
        this.damageDisplayer[1-this._attackerFlag].node.scaleY=1;
        
        this.scheduleOnce(function(){
            if(this._HP1<=0||this._HP2<=0){
                this._gameOver();
            }
            else{
                this._exchange();
            }
        },this._returnDuration);
    },
    
    _exchange:function(){
        this._gamePlayFlag=false;
        this.arrow.opacity=255;
        this.arrow.x=-this.arrow.x;
        this.arrow.scaleX=-this.arrow.scaleX;
        this.node.dispatchEvent( new cc.Event.EventCustom('playerExchange',true) );
    },
    
    _gameOver:function(){
        this.background.opacity=200;
        this.winLose.opacity=255;
        if(this._HP1>this._HP2){
            this.winLose.getComponent(cc.Sprite).spriteFrame=this.winLoseP.getSpriteFrame('1-2');
            this.winLoseBG.getComponent(cc.Sprite).spriteFrame=this.winLoseBGP.getSpriteFrame('1-1');
            this.player1.getComponent(cc.Sprite).spriteFrame=this._yourIdleP.getSpriteFrame("p"+(this._yourPindex+1).toString()+"-win");
            this.player2.getComponent(cc.Sprite).spriteFrame=this._enemyIdleP.getSpriteFrame("p"+(2-this._yourPindex).toString()+"-lose");
        }
        else{
            this.winLose.getComponent(cc.Sprite).spriteFrame=this.winLoseP.getSpriteFrame('2-2');
            this.winLoseBG.getComponent(cc.Sprite).spriteFrame=this.winLoseBGP.getSpriteFrame('2-1');
            this.player1.getComponent(cc.Sprite).spriteFrame=this._yourIdleP.getSpriteFrame("p"+(this._yourPindex+1).toString()+"-lose");
            this.player2.getComponent(cc.Sprite).spriteFrame=this._enemyIdleP.getSpriteFrame("p"+(2-this._yourPindex).toString()+"-win");
        }
        // if(this.gameOverB){
        //     this.gameOverB.on(cc.Node.EventType.TOUCH_START, event => {
        //         cc.director.loadScene('Start');
        //     }, this);
        // }
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this._x+=dt;
        this._red=(Math.cos(this._x*this.superspeed)+1)*100;
        this._blue=(Math.sin(this._x*this.superspeed)+1)*100;
        this.superBackground.color=new cc.color(this._red,0,this._blue,255);
        this.arrow.y=Math.sin(this._x*5)*10+140;
        this.resultShower.node.y+=dt*500;
        if(this._gamePlayFlag==false){
            if(this._x%3>=0){
                this.player1.getComponent(cc.Sprite).spriteFrame=this._yourIdleP.getSpriteFrame("p"+(this._yourPindex+1).toString()+"-blink");
            }
            if(this._x%3>=0.03){
                this.player1.getComponent(cc.Sprite).spriteFrame=this._yourIdleP.getSpriteFrame("p"+(this._yourPindex+1).toString()+"-idle");
            }
            if((this._x+1)%3>=0){
                this.player2.getComponent(cc.Sprite).spriteFrame=this._enemyIdleP.getSpriteFrame("p"+(2-this._yourPindex).toString()+"-blink");
            }
            if((this._x+1)%3>=0.03){
                this.player2.getComponent(cc.Sprite).spriteFrame=this._enemyIdleP.getSpriteFrame("p"+(2-this._yourPindex).toString()+"-idle");
            }
        }
    },
});