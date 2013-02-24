/*
* author:xudafeng
* email:dafeng.xdf@taobao.com
* descript:做个常用类库，自己使用方便
* */
(function (X) {

    var __self = this,
        X = __self[arguments[0]] = {

            /**
             * 基础框架功能：对象深拷贝，同名子对象直接覆盖
             */
            mix:function (r, s) {
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
    X.mix(X, {
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
                      fn.call(__self,object[i]);
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
        /**
         * 引入模块
         */
        import:function(mod,fn){

            var __self = this;

            X.mix(X[mod] = {},fn.call(__self,X,X[mod]));

        },
        /**
         * 加载工具
         */
        getScript:function(url, success, charset) {
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
        getStyle:function(url, success, charset) {
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

        }

    });

})('XDF');

XDF.import('DOM',function(X){
    var X = arguments[0],
        doc = document,
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

                }else{
                    if(i.style.display == 'none'){
                        i.style.display = 'block';
                    }else{
                        i.style.display = 'none';
                    }
                }
            }
            isString(selector) && (selector = queryHandle(selector));

            isArray(selector)|| isNodeList (selector) ? X.each(selector,function(i){

                __option(i);

            }): __option(selector);

        };
    var DOM = {
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

        }
    }

    return DOM;
});
XDF.import('Event',function(X){
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

        };
    var Event = {

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
XDF.import('Ajax',function(){   //ajax模块
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
XDF.import('UA',function(){
    var X = arguments[0];

    var UA = {
        system:function(){

        },
        browser:function(){

        },
        core:function(){

        }
    }

    return UA;

});
XDF.import('Anim',function(X){
    var X = arguments[0];
    var Anim = {
        system:function(){
        },
        browser:function(){

        },
        core:function(){

        }
    }

    return Anim;
});
