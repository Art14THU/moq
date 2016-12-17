if(!cc.runtime){
// runtime not support dragonbones.

var NORMAL_ANIMATION_GROUP="normal";

cc.Class({
    extends: cc.Component,
    editor:{
        requireComponent:dragonBones.ArmatureDisplay
    },

    properties: {
        _isJumping:false,
        _isWalking:false,
        _isFalling:false,
        playerNumber:1,
        turnDisplayer:{
            default:null,
            type:cc.Label
        },
        _nowTurn:false
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this._armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        this._armature = this._armatureDisplay.armature();
        
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
            case cc.KEY.q:
                if (isDown){
                    this._isJumping=!this._isJumping;
                    this._nowTurn=this.playerNumber-this.turnDisplayer.string;
                    this.jump();
                    }
                break;
            case cc.KEY.w:
                if (isDown){
                    this._isWalking=!this._isWalking;
                    this._nowTurn=this.playerNumber-this.turnDisplayer.string;
                    this.walk();
                }
                break;
            case cc.KEY.e:
                if (isDown){
                    this._isFalling=!this._isFalling;
                    this._nowTurn=this.playerNumber-this.turnDisplayer.string;
                    this.fall();
                }
                break;
            default:
                return;
        }
    },
    
    jump:function(){
        if(this._isJumping&&!this._nowTurn){
            this._armature.animation.play("jump", -1);
        }
        else{
            this._armature.animation.play("stand", -1);
        }
    },
    
    walk:function(){
        if(this._isWalking&&!this._nowTurn){
            this._armature.animation.play("walk", -1);
        }
        else{
            this._armature.animation.play("stand", -1);
        }
    },
    
    fall:function(){
        if(this._isFalling&&!this._nowTurn){
            this._armature.animation.play("fall", -1);
        }
        else{
            this._armature.animation.play("stand", -1);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
}//end of !cc.runtime