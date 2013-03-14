/*
 * author:xudafeng
 * email:dafeng.xdf@taobao.com
 * descript:写个常用类库，自己使用方便
 * */
(function (X) {

    var __self = this,

        X = __self[arguments[0]] = {

            /**
             * 基础框架功能：对象深拷贝，同名子对象直接覆盖
             */
            add:function (r, s) {
                for(var i in s){
                    r[i] = s[i];
                }
                return r;
            }
        },
        EMPTY = '',
        __isXDF = function(source,option){

            return  option ==  Object.prototype.toString.call(source);
        };

    //基础工具方法
    X.add(X, {
        //版本信息
        version:'1.0.0',

        /**
         * 控制台输出
         * 参数二控制需要弹窗提示
         */
        log:function (msg) {

            !arguments[1] ? console.log(msg) : alert(msg);
        },

        /**
         * 遍历功能
         */

        each:function (object, fn) {

            if(object){
                for(var i in object){
                    if(i !== 'length' && i !== 'item'){
                        fn.call(__self,object[i],i);
                    }
                }
            }
            return object;
        },

        /**
         * 去除头尾空格
         */

        trim: function (str) {

            if(typeof str === 'string'){
                return  str.replace(/^\s*|\s*$/g,EMPTY);
            }else{
                return null;
            }


        },
        /**
         * 返回当前时间戳
         */
        now:function(){
            return +new Date();
        },
        /**
         * 封装字符探针indexof
         */
        indexOf:function (i, objective) {
            if(objective){
                if(objective.indexOf(i) !== -1){
                    return true;
                }else{
                    return false;
                }
            }
        },
        /**
         * 安全数据类型检测
         */

        isArray :function (source) {

            return __isXDF(source,'[object Array]');

        },
        isNodeList :function (source) {

            return __isXDF(source,'[object NodeList]');

        },
        isString: function(source){

            return __isXDF(source,'[object String]');

        },
        isFunction: function(source){

            return __isXDF(source,'[object Function]');

        },
        isNumber:function(source){
            return __isXDF(source,'[object Number]');
        },
        /**
         * 引入模块
         */
        install:function(mod,fn){

            X.add(X[mod] = {},fn.call(__self,X,X[mod]));

        },
        /**
         * 函数节流阀
         */
        throttle : function (method,context,time){

            clearTimeout(method.tId);

            method.tId = setTimeout(function(){

                method.call(context);

            },time);
        },
        /**
         * 流行的符号$
         */
        $ : function(elm){

           return X.DOM.get(elm);
        },
        /**
         * 定时器
         */
        timer : function(handle,time,bool){
          if(bool){
              //循环插入
              setInterval(handle,time)
          }else{
              //插入定时器
              setTimeout(handle,time);
          }

        },
        /**
         * 加载工具
         */
        __getScript:function(url, success, charset) {
            if (utils.isCss(url)) {
                return S.getStyle(url, success, charset);
            }
            var doc = document,
                head = doc.head || doc.getElementsByTagName("head")[0],
                node = doc.createElement('script'),
                config = success,
                error,
                timeout,
                timer;

            if (S.isPlainObject(config)) {
                success = config.success;
                error = config.error;
                timeout = config.timeout;
                charset = config.charset;
            }

            function clearTimer() {
                if (timer) {
                    timer.cancel();
                    timer = undefined;
                }
            }

            node.src = url;
            node.async = true;
            if (charset) {
                node.charset = charset;
            }
            if (success || error) {
                scriptOnload(node, function() {
                    clearTimer();
                    S.isFunction(success) && success.call(node);
                });

                if (S.isFunction(error)) {

                    //标准浏览器
                    if (doc.addEventListener) {
                        node.addEventListener("error", function() {
                            clearTimer();
                            error.call(node);
                        }, false);
                    }

                    timer = S.later(function() {
                        timer = undefined;
                        error();
                    }, (timeout || this.Config.timeout) * MILLISECONDS_OF_SECOND);
                }
            }
            head.insertBefore(node, head.firstChild);
            return node;
        },
        /**
         * 加载样式
         */
        __getStyle:function(url, success, charset) {
            var doc = document,
                head = utils.docHead(),
                node = doc.createElement('link'),
                config = success;

            if (S.isPlainObject(config)) {
                success = config.success;
                charset = config.charset;
            }

            node.href = url;
            node.rel = 'stylesheet';

            if (charset) {
                node.charset = charset;
            }

            if (success) {
                utils.scriptOnload(node, success);
            }
            head.appendChild(node);
            return node;

        },
        /**
         * 自定义事件
         */
        __okEvent :function(){

        }


    });

})('XDF');

XDF.install('DOM',function(X){

    var X = arguments[0],
        doc = document,
        $ = X.$,
        EMPTY = '',
        __self = this;
        trim = X.trim,
        isArray = X.isArray,
        isString = X.isString,
        isNodeList = X.isNodeList,
        __display = function(selector,option,queryHandle){

            var __option = function(i){

                if(option =='hide'){

                    i.style.display = 'none';

                }else if(option =='show'){

                    i.style.display = 'block';

                }else{   //此处有严重bug

//                    if(i.style.display.toString() ==''){
//
//                        i.style.display = 'none';
//
//                    }

                    if(i.style.display == 'none'){

                        i.style.display = 'block';

                    }else {

                        i.style.display = 'none';

                    }
                }
            }
            isString(selector) && (selector = queryHandle(selector));

            isArray(selector)|| isNodeList (selector) ? X.each(selector,function(i){

                __option(i);

            }): __option(selector);

        },
        DOM = {
            /**
             * 批量获取dom元素
             */
            query:function(selector){

                var __doc = arguments[1]? arguments[1]:doc,

                    __selector = typeof (selector) === 'string' ?  selector :  selector.toString();

                __selector = trim(__selector);

                if(X.indexOf('#',__selector)){

                    return __doc.getElementById(__selector.replace('#',EMPTY)) || null;

                } else if(X.indexOf('.',__selector)){

                    return __doc.getElementsByClassName(__selector.replace('.',EMPTY)) || null;

                }else{

                    return __doc.getElementsByTagName(__selector) || null;

                }

            },
            /**
             * 获取第一个符合条件的元素
             */
            get:function(selector){

                var __selector =  this.query(selector),
                    isArray = X.isArray,
                    isNodeList = X.isNodeList;

                if(__selector){

                    if(isArray(__selector)|| isNodeList(__selector)){

                        return this.query(selector)[0];

                    }else{

                        return this.query(selector);

                    }

                }else{

                    return null;
                }

            },

            create:function(elm){

                return doc.createElement(elm);

            },
            remove:function(elm){
                doc.removeElements(elm);
            },
            html:function(elm,html){
                elm.innerHTML = html;
            },
            data:function(){

            },
            next:function(elm){
                return elm.nextSibling;
            },
            prev:function(elm){
                return elm.previousSibling;
            },
            attr:function(elm,attr){
                return elm.getAttribute(attr);
            },
            /**
             * 隐藏元素
             */
            hide:function(selector){


                __display(selector,'hide',this.query);

            },
            /**
             * 显示元素
             */
            show:function(selector){

                __display(selector,'show',this.query);

            },
            toggle:function(selector){

                __display(selector,'toggle',this.query);

            },
            viewHeight:function(){

                return __self.top.document.compatMode == "BackCompat" ? __self.top.document.body.clientHeight :__self.top.document.documentElement.clientHeight;

            },
            css:function(elm,style,value){   //这里没有做ie低版本兼容

                if(X.isString(elm)){
                    elm = $(elm);
                }

                if(typeof(__self.getComputedStyle) == 'undefined'){
                    return false;
                }
                if(value){
                    elm.style[style] = value;
                }else{
                    return  getComputedStyle(elm)[style];
                }

            }
        }

    return DOM;
});

XDF.install('Event',function(X){

    var X = arguments[0],
        __self = this,
        D = X.DOM,
        W = window,
        isNodeList = X.isNodeList,
        isString = X.isString,

        __add = function(elm,type,handle){

            if(elm.addEventListener){//通用事件捆绑

                elm.addEventListener(type,handle,false);

            } else if (elm.attachEvent){

                elm.attachEvent('on'+type,handle);  //针对ie的保险捆绑

            } else {

                elm['on'+ type]  = handle; //现存的DOM0基本古老方式
            }

        },
        Event = {

            add:function(elm,type,handle){

                var elm = isString(elm) ? D.query(elm) : elm;

                if(isNodeList(elm)){  //支持批量循环绑定

                    X.each(elm,function(i){
                        __add(i,type,handle);
                    })

                }else{

                    __add(elm,type,handle);
                }

                return elm;
            },

            on:function(elm,type,handle){    //直接调用add

                this.add.apply(__self,arguments);
                return elm;

            },

            delegate:function(container,selector,type,handle){ //支持事件委托绑定，完成代理功能

                var container = isString(container) ? D.query(container) : container;

                var __handle = function(e) {

                    function getEventTarget(e) {
                        e = e || W.event;
                        return e.target || e.srcElement;
                    }

                    if(getEventTarget(e).tagName.toLowerCase() === selector) {

                        handle.call(__self,e);

                    }
                }

                if(isNodeList(container)){  //支持批量循环绑定

                    X.each(container,function(i){
                        __add(i,type,__handle);
                    })

                }else{
                    __add(container,type,__handle);
                }

                return container;

            }
        }

    return Event;
});
XDF.install('Ajax',function(){   //ajax模块

    var X = arguments[0],
        __self = this,
        __defaulConfig = {
            method:'POST',//默认post方式
            url:'/',
            async:false,
            data:null,
            success:function(e){
                X.log(e);
            }
        },
        win = window,
        JSON = win.JSON;

    function __f(n) {

        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear() + '-' +
                    __f(this.getUTCMonth() + 1) + '-' +
                    __f(this.getUTCDate()) + 'T' +
                    __f(this.getUTCHours()) + ':' +
                    __f(this.getUTCMinutes()) + ':' +
                    __f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        escapable['lastIndex'] = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {


        var i,
            k,
            v,
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }


        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }


        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                return String(value);

            case 'object':

                if (!value) {
                    return 'null';
                }

                gap += indent;
                partial = [];


                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                            mind + ']' :
                            '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    var Ajax = {
        io:function(__config){

            var method = __config['method']||__defaulConfig['method'],

                url =  __config['url']||__defaulConfig['url'],

                successHandle = __config['success']||__defaulConfig['success'],

                async = __config['async']||__defaulConfig['async'],

                data = __config['data']||__defaulConfig['data'],

                xmlHttp;

            if (__self.XMLHttpRequest){

                xmlHttp=new XMLHttpRequest();
            }
            else{           //for IE6, IE5

                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");

            }

            xmlHttp.onreadystatechange=function(){

                if (xmlHttp.readyState==4 && xmlHttp.status==200){
                    successHandle(xmlHttp.responseText);
                }

            }

            xmlHttp.open(method,url+'?t='+ X.now(),async);
            xmlHttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
            xmlHttp.setRequestHeader('data',data);
            xmlHttp.send();

        },
        stringify : function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }


            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }


            return str('', {'': value});
        },
        parse : function (text, reviver) {
            var j;

            function walk(holder, key) {

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            text = String(text);
            cx['lastIndex'] = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                j = eval('(' + text + ')');

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

        },
        //加载xml
        loadXML:function(file){
            var xmlDoc;
            try  {
                xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async=false;
                xmlDoc.load(file);
            }
            catch(e){
                try {
                    xmlDoc=document.implementation.createDocument("","",null);
                    xmlDoc.async=false;
                    xmlDoc.load(file);
                }
                catch(e){
                    try {
                        var xmlhttp = new window.XMLHttpRequest();
                        xmlhttp.open("GET",file,false);
                        xmlhttp.send(null);
                        xmlDoc = xmlhttp.responseXML;
                    }
                    catch(e){
                        error=e.message;
                    }
                }
            }
            return xmlDoc;
        }
    }

    return Ajax;

});
//用户客户端检测
XDF.install('UA',function(){

    var X = arguments[0],

        UA = {
            //几种呈现引擎
            webkit: undefined,

            trident: undefined,

            gecko: undefined,

            presto: undefined,
            //各个公司发行版本
            chrome: undefined,

            safari: undefined,

            firefox: undefined,

            ie: undefined,

            opera: undefined,

            /**
             * 渲染引擎
             */
            core: undefined,
            /**
             * shell name
             */
            shell: undefined,

            /**
             * operation system
             */
            system: undefined,

            //for apple
            ipad: undefined,

            iphone: undefined,

            ipod: undefined,

            android: undefined

        };
        //用户代理信息
        var _uaStr = navigator.userAgent.toLowerCase();

        //版本 以及各公司发行版
        var __shellCheck = function(appName,_uaStr){

            if(X.indexOf('msie',_uaStr)){
                //ie版本号
                var _versionTrident = _uaStr.match(/trident.([\d.]+)/);

                var __getVersion = function(str){
                        var ieVersions = [6,7,8,9,10],
                            __ver = 0;

                        X.each(ieVersions,function(i){

                            if(X.indexOf('msie '+i,str)&&!__ver) {

                                __ver =  i;
                            }
                        })

                       return __ver;
                    };

                UA['ie'] = __getVersion(_uaStr);

                UA['core'] = 'ie';

                UA['trident'] = _versionTrident ? parseInt(_versionTrident[1]) : undefined;

                return UA['core'];
            }else if(X.indexOf('opera',_uaStr)){

            var _versionOpera = _uaStr.match(/version.([\d.]+)/),
                _versionPresto = _uaStr.match(/presto.([\d.]+)/);

                UA['opera'] = _versionOpera[1];
                UA['core'] = 'opera';
                UA['presto'] = parseInt(_versionPresto[1]);
                return 'opera';

            }else if(X.indexOf('safari',_uaStr)){
                var _versionWebkit = _uaStr.match(/webkit.([\d.]+)/);
                if(X.indexOf('chrome',_uaStr)){

                    var _versionChrome = _uaStr.match(/chrome.([\d.]+)/);
                    UA['chrome'] = parseInt(_versionChrome[1]);
                    UA['webkit']  = parseInt(_versionWebkit[1]);
                    UA['core'] = 'webkit';
                    return 'chrome';
                } else{

                    var _versionSafari = _uaStr.match(/version.([\d.]+)/);

                    UA['safari'] = parseInt(_versionSafari[1]);
                    UA['webkit']  = parseInt(_versionWebkit[1]);
                    UA['core'] = 'webkit';

                    return 'safari';

                }

            }else if(X.indexOf('firefox',_uaStr)){
                var _versionFirefox = _uaStr.match(/firefox.([\d.]+)/),
                    _versionGecko = _uaStr.match(/gecko.([\d.]+)/);

                UA['firefox'] = parseInt(_versionFirefox[1]);

                UA['gecko']  = parseInt(_versionGecko[1]);

                UA['core'] = 'gecko';
            }

        }

        UA['shell'] = __shellCheck(navigator.appName,_uaStr);

        //运行系统 system
        var  __systemCheck = function(str){


            if(X.indexOf('mac',str)){

                return 'mac';

            }else if(X.indexOf('win',str)) {

                return 'windows';

            }else if(X.indexOf('x11',str)){

                return 'unix';

            }else if(X.indexOf('linux',str)){

                return 'linux';
            }else if(X.indexOf('iphone',str)){

                return 'iphone';

            }else if(X.indexOf('ipad',str)){

                return 'ipad';

            }else if(X.indexOf('andriod',str)){

                return 'andriod';
            }
        }
        UA['system'] = __systemCheck(navigator.platform.toLowerCase());

    return UA;

});
XDF.install('Anim',function(X){

    var __self = this,
        D = X.DOM,
        PI = Math.PI,
        pow = Math.pow,
        sin = Math.sin,
        BACK_CONST = 1.70158,
        Tween = { //添加缓动算子
            swing:function(t) {
                return ( -Math.cos(t * PI) / 2 ) + 0.5;
            },

            easeNone: function (t) {
                return t;
            },

            easeIn: function (t) {
                return t * t;
            },

            easeOut: function (t) {
                return ( 2 - t) * t;
            },

            easeBoth: function (t) {
                return (t *= 2) < 1 ?
                    .5 * t * t :
                    .5 * (1 - (--t) * (t - 2));
            },

            easeInStrong: function (t) {
                return t * t * t * t;
            },

            easeOutStrong: function (t) {
                return 1 - (--t) * t * t * t;
            },

            easeBothStrong: function (t) {
                return (t *= 2) < 1 ?
                    .5 * t * t * t * t :
                    .5 * (2 - (t -= 2) * t * t * t);
            },

            elasticIn: function (t) {
                var p = .3, s = p / 4;
                if (t === 0 || t === 1) return t;
                return -(pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
            },

            elasticOut: function (t) {
                var p = .3, s = p / 4;
                if (t === 0 || t === 1) return t;
                return pow(2, -10 * t) * sin((t - s) * (2 * PI) / p) + 1;
            },

            elasticBoth: function (t) {
                var p = .45, s = p / 4;
                if (t === 0 || (t *= 2) === 2) return t;

                if (t < 1) {
                    return -.5 * (pow(2, 10 * (t -= 1)) *
                        sin((t - s) * (2 * PI) / p));
                }
                return pow(2, -10 * (t -= 1)) *
                    sin((t - s) * (2 * PI) / p) * .5 + 1;
            },

            backIn: function (t) {
                if (t === 1) t -= .001;
                return t * t * ((BACK_CONST + 1) * t - BACK_CONST);
            },

            backOut: function (t) {
                return (t -= 1) * t * ((BACK_CONST + 1) * t + BACK_CONST) + 1;
            },


            backBoth: function (t) {
                if ((t *= 2 ) < 1) {
                    return .5 * (t * t * (((BACK_CONST *= (1.525)) + 1) * t - BACK_CONST));
                }
                return .5 * ((t -= 2) * t * (((BACK_CONST *= (1.525)) + 1) * t + BACK_CONST) + 2);
            },

            bounceIn: function (t) {
                return 1 - Tween.bounceOut(1 - t);
            },

            bounceOut: function (t) {
                var s = 7.5625, r;

                if (t < (1 / 2.75)) {
                    r = s * t * t;
                }
                else if (t < (2 / 2.75)) {
                    r = s * (t -= (1.5 / 2.75)) * t + .75;
                }
                else if (t < (2.5 / 2.75)) {
                    r = s * (t -= (2.25 / 2.75)) * t + .9375;
                }
                else {
                    r = s * (t -= (2.625 / 2.75)) * t + .984375;
                }

                return r;
            },

            bounceBoth: function (t) {
                if (t < .5) {
                    return Tween.bounceIn(t * 2) * .5;
                }
                return Tween.bounceOut(t * 2 - 1) * .5 + .5;
            }
        };
    /*
    S = v * T     总路程 = 速度 * 总时间，导出： v = S/T
    s = v * t     已走路程 = 速度 * 已用时间，导出：s = S * (t/T)
    相当于 变化量 = 变化总量 * (已用时间/总时间)
    开始值 + (结束值 - 开始值) * (当前时间-开始时间) / (动画需要时间) + 单位
    当变化量等于变化总量时，标志着动画接近尾声，时间耗尽
    */
    var Anim = function(elm,change,TIME,tween,handle){

        var ELEMENT = D.get(elm),
            _tween = Tween[tween];//获取算子

        var __init = function(){
            X.each(change,function(i,key){
                //过滤单位 i,取到计算数值
                var _suffix = '';
                if(!X.isNumber(i)){
                    i = parseFloat(i);
                     _suffix = 'px';//这个地方有待改进
                }
                //获取开始值，i为结束值
                var _property = parseFloat(D.css(ELEMENT,key)),
                    _changeTotal = i - _property,  //总体变化量
                    _startTime = X.now();          //开始时间

                //应用效果

                var _exec = setInterval(function(){

                    //动画执行
                    var timeRange = (X.now() - _startTime)/TIME;
                    var propertyRange = parseFloat(_property) + _changeTotal * _tween(timeRange);
                    //改变属性

                    D.css(ELEMENT,key,propertyRange+_suffix);
                    if(timeRange >=1 ){    //动画结束
                        clearInterval(_exec)
                        //直接回调
                        handle.call(__self);
                    }
                },16);//前车之鉴，用16吧
            })
        }

        return {
            start:function(){
                __init();
            },
            stop:function(){
            },
            pause:function(){

            },
            query:function(){

            }
        }
    }
    //工厂模式，直接覆盖原单例模式对象
    X['Anim'] = Anim;
})
