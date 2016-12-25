cc.Class({
    extends: cc.Component,
    
    
        properties: {
            StartButton: {
                default: null,
                type: cc.Node
            },
            HelpButton: {
                default: null,
                type: cc.Node
            },
        },


    // use this for initialization
    onLoad: function () {
                    if (this.StartButton) {
                this.StartButton.on(cc.Node.EventType.TOUCH_START, event => {
                    this._StartButton();
                }, this)}
                
                 if (this.HelpButton) {
                this.HelpButton.on(cc.Node.EventType.TOUCH_START, event => {
                    this._HelpButton();
                }, this)}
            },
    
    _StartButton(){
        cc.director.loadScene('Game');
    },
    
    _HelpButton(){
        cc.director.loadScene('Help0');
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    }
);
