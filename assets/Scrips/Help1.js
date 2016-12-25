cc.Class({
    extends: cc.Component,

    properties: {
        BackButton: {
                default: null,
                type: cc.Node
            },
            
        NextButton: {
                default: null,
                type: cc.Node
            },
        
        LastButton:{
                default: null,
                type: cc.Node
        },
        
    },

    // use this for initialization
    onLoad: function () {
                if (this.BackButton) {
                this.BackButton.on(cc.Node.EventType.TOUCH_START, event => {
                    this._BackButton();
                }, this)}
                
                if (this.NextButton) {
                this.NextButton.on(cc.Node.EventType.TOUCH_START, event => {
                    this._NextButton();
                }, this)}
                
                if(this.LastButton){
                    this.LastButton.on(cc.Node.EventType.TOUCH_START,event=>{
                        this._LastButton();
                    },this)}
            
    },
    
    _BackButton(){
        cc.director.loadScene('Start');
        
    },
    
    _NextButton(){
        cc.director.loadScene('Help2');
    },

    _LastButton(){
        cc.director.loadScene('Help0');
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

