if (!cc.runtime) {
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
        },

        session: null,
        oldText: "",


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
                            if (result == '' || result == null)
                                alert("没有获取到识别结果");
                            else
                                alert(result.toString());
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
                                alert("服务初始化");
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

            if (this.recorder) {
                this.recorder.on(cc.Node.EventType.TOUCH_START, event => {
                    this._record();
                }, this);
            }
        },

        _record: function() {
            var ssb_param = {
                "grammar_list": null,
                "params": "appid=583a97de,appidkey=5417118c65059796, lang = sms, acous = anhui, aue=speex-wb;-1, usr = mkchen, ssm = 1, sub = iat, net_type = wifi, rse = utf8, ent =sms16k, rst = plain, auf  = audio/L16;rate=16000, vad_enable = 1, vad_timeout = 5000, vad_speech_tail = 500, compress = igzip"
            };

            //alert("按下";
            //alert(ssb_param.toString();
            this.session.start(ssb_param);
        },



        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

        // },
    });
}