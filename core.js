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

(function(X){
    var doc = document,EMPTY = '',
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

                    }
                }
            isString(selector) && (selector = queryHandle(selector));

            isArray(selector)|| isNodeList (selector) ? X.each(selector,function(i){

                    __option(i);

                }): __option(selector);

        };

    X.mix(X[arguments[1]] = {},{
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
        data:function(){

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

            __display(selector,'',this.query);

        }
    });
})(XDF,'DOM');

(function(X){
    var __self = this,
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

    X.mix(X[arguments[1]] = {},{

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
    });
})(XDF,'Event');

(function(X){ //ajax模块
    var __self = this,
        __defaulConfig = {
            method:'POST',//默认post方式
            url:'/',
            async:false,
            data:null,
            success:function(e){
                X.log(e);
            }
        };

    X.mix(X[arguments[1]] = {},{

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
        parse:function(){

        },
        xml2json: function(xml, extended) {
            if(!xml) return {}; // quick fail

            //### PARSER LIBRARY
            // Core function
            function parseXML(node, simple){
                if(!node) return null;
                var txt = '', obj = null, att = null;
                var nt = node.nodeType, nn = jsVar(node.localName || node.nodeName);
                var nv = node.text || node.nodeValue || '';
                /*DBG*/ //if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
                if(node.childNodes){
                    if(node.childNodes.length>0){
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'CHILDREN',node.childNodes]);
                        $.each(node.childNodes, function(n,cn){
                            var cnt = cn.nodeType, cnn = jsVar(cn.localName || cn.nodeName);
                            var cnv = cn.text || cn.nodeValue || '';
                            /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
                            if(cnt == 8){
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>b',cnn,'COMMENT (ignore)']);
                                return; // ignore comment node
                            }
                            else if(cnt == 3 || cnt == 4 || !cnn){
                                // ignore white-space in between tags
                                if(cnv.match(/^\s+$/)){
                                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE (ignore)']);
                                    return;
                                };
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>d',cnn,'TEXT']);
                                txt += cnv.replace(/^\s+/,'').replace(/\s+$/,'');
                                // make sure we ditch trailing spaces from markup
                            }
                            else{
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
                                obj = obj || {};
                                if(obj[cnn]){
                                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>f',cnn,'ARRAY']);

                                    // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                                    if(!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
                                    obj[cnn] = myArr(obj[cnn]);

                                    obj[cnn][ obj[cnn].length ] = parseXML(cn, true/* simple */);
                                    obj[cnn].length = obj[cnn].length;
                                }
                                else{
                                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>g',cnn,'dig deeper...']);
                                    obj[cnn] = parseXML(cn);
                                };
                            };
                        });
                    };//node.childNodes.length>0
                };//node.childNodes
                if(node.attributes){
                    if(node.attributes.length>0){
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
                        att = {}; obj = obj || {};
                        $.each(node.attributes, function(a,at){
                            var atn = jsVar(at.name), atv = at.value;
                            att[atn] = atv;
                            if(obj[atn]){
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'ARRAY']);

                                // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                                //if(!obj[atn].length) obj[atn] = myArr(obj[atn]);//[ obj[ atn ] ];
                                obj[cnn] = myArr(obj[cnn]);

                                obj[atn][ obj[atn].length ] = atv;
                                obj[atn].length = obj[atn].length;
                            }
                            else{
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
                                obj[atn] = atv;
                            };
                        });
                        //obj['attributes'] = att;
                    };//node.attributes.length>0
                };//node.attributes
                if(obj){
                    obj = $.extend( (txt!='' ? new String(txt) : {}),/* {text:txt},*/ obj || {}/*, att || {}*/);
                    txt = (obj.text) ? (typeof(obj.text)=='object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
                    if(txt) obj.text = txt;
                    txt = '';
                };
                var out = obj || txt;
                //console.log([extended, simple, out]);
                if(extended){
                    if(txt) out = {};//new String(out);
                    txt = out.text || txt || '';
                    if(txt) out.text = txt;
                    if(!simple) out = myArr(out);
                };
                return out;
            };// parseXML
            // Core Function End
            // Utility functions
            var jsVar = function(s){ return String(s || '').replace(/-/g,"_"); };

            // NEW isNum function: 01/09/2010
            // Thanks to Emile Grau, GigaTecnologies S.L., www.gigatransfer.com, www.mygigamail.com
            function isNum(s){
                // based on utility function isNum from xml2json plugin (http://www.fyneworks.com/ - diego@fyneworks.com)
                // few bugs corrected from original function :
                // - syntax error : regexp.test(string) instead of string.test(reg)
                // - regexp modified to accept  comma as decimal mark (latin syntax : 25,24 )
                // - regexp modified to reject if no number before decimal mark  : ".7" is not accepted
                // - string is "trimmed", allowing to accept space at the beginning and end of string
                var regexp=/^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
                return (typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
            };
            // OLD isNum function: (for reference only)
            //var isNum = function(s){ return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };

            var myArr = function(o){

                // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                //if(!o.length) o = [ o ]; o.length=o.length;
                if(!$.isArray(o)) o = [ o ]; o.length=o.length;

                // here is where you can attach additional functionality, such as searching and sorting...
                return o;
            };
            // Utility functions End
            //### PARSER LIBRARY END

            // Convert plain text to xml
            if(typeof xml=='string') xml = $.text2xml(xml);

            // Quick fail if not xml (or if this is a node)
            if(!xml.nodeType) return;
            if(xml.nodeType == 3 || xml.nodeType == 4) return xml.nodeValue;

            // Find xml root node
            var root = (xml.nodeType == 9) ? xml.documentElement : xml;

            // Convert xml to json
            var out = parseXML(root, true /* simple */);

            // Clean-up memory
            xml = null; root = null;

            // Send output
            return out;
        }

    });

})(XDF,'Ajax');
(function(X){  //客户端信息
    var __self = this;

    X.mix(X[arguments[1]] = {},{
        system:function(){

        },
        browser:function(){

        },
        core:function(){

        }
    });
})(XDF,'UA');