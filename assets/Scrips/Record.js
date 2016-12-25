    cc.Class({
        extends: cc.Component,

        properties: {
            recorder: {
                default: null,
                type: cc.Node
            },
            tester: {
                default: null,
                type: cc.Label
            },
            resulter: {
                default: null,
                type: cc.Label
            },
            progresser1: {
                default:null,
                type: cc.ProgressBar
            },
            progresser2: {
                default:null,
                type: cc.ProgressBar
            },

            duration:20,
            _progressTimer:0,
        },

        session: null,
        oldText: "",
        _result: "",

        // use this for initialization
        onLoad: function() {
            var _this = this;
            var oldText = "Listen";
            var volumeEvent = (function() {
                var lastVolume = 0;
                var eventId = 0;
                var listen = function(volume) {
                    lastVolume = volume;
                };
                
                var start = function() {
                };
                var stop = function() {
                    clearInterval(eventId);
                };
                return {
                    "listen": listen,
                    "start": start,
                    "stop": stop
                };
            })();

            this.session = new IFlyIatSession({
                "callback": {
                    "onResult": function(err, result) {
                        if (err == null || err == undefined || err == 0) {
                            if (result == '' || result == null){
                                //alert("没有获取到识别结果");
                                _this.tester.string = "没有获取到识别结果";
                                _this._show("啊");
                            }
                            else{
                                //alert(result.toString());
                                _this.tester.string = result.toString();
                                _this._show(result);
                            }
                        } else {
                            alert(err.toString() + result.toString());
                        }
                    },
                    "onVolume": function(volume) {

                    },
                    "onError": function() {

                    },
                    "onProcess": function(status) {
                        switch (status) {
                            case 'onStart':
                                //alert("服务初始化");
                                _this.tester.string = "服务初始化";
                                break;
                            case 'normalVolume':
                            case 'started':
                                _this.tester.string = "倾听中";
                                break;
                            case 'onStop':
                                _this.tester.string = "等待结果";
                                break;
                            case 'onEnd':
                                _this.tester.string = oldText;
                                break;
                            case 'lowVolume':
                                _this.tester.string = "倾听中(声音过小)";
                                break;
                            default:
                                _this.tester.string = status;
                        }
                    }
                }
            });

            this.node.on('playerExchange',function(event){
                _this._record(); 
            }, this);
            
            this._record();
        },

        _record: function() {
            var ssb_param = {
                "grammar_list": null,
                "params": "appid=583a97de,appidkey=5417118c65059796, lang = sms, acous = anhui, aue=speex-wb;-1, usr = mkchen, ssm = 1, sub = iat, net_type = wifi, rse = utf8, ent =sms16k, rst = plain, auf  = audio/L16;rate=16000, vad_enable = 1, vad_timeout = 5000, vad_speech_tail = 500, compress = igzip"
            };

            this.recorder.interactable=true;
            
            if (this.recorder) {
                this.recorder.on(cc.Node.EventType.TOUCH_START, event => {
                    this.session.start(ssb_param);
                    this._progressTimer=0;
                    this.progresser1.node.opacity=255;
                    this.progresser2.node.opacity=255;

                }, this);
                this.recorder.on(cc.Node.EventType.TOUCH_END, event => {
                    this.session.stop();
                    this.recorder.interactable=false;

                }, this);
                this.recorder.on(cc.Node.EventType.TOUCH_CANCEL, event => {
                    this.session.stop();
                    this.recorder.interactable=false;
                }, this);
            }
        },
        
        _show: function(result) {
            this.recorder.interactable=false;
            this.progresser1.node.opacity=0;
            this.progresser2.node.opacity=0;
            this.recorder.interactable=false;
            this._result = result.toString();
            this.resulter.string = this._result;
            this.node.dispatchEvent( new cc.Event.EventCustom('getResult', true) );
        },



        // called every frame, uncomment this function to activate update callback
        update: function (dt) {
            this.progresser1.progress=this._progressTimer;
            this.progresser2.progress=this._progressTimer;
            this._progressTimer+=dt/this.duration;
            if(this._progressTimer>=1){
                this._progressTimer=1;
            }
        },
    });
