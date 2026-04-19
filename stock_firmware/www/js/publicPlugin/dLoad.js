//这里存放的是语言包加载前所需要的库函数

var current_html = null;
var language_type = null;
var L = null;
var appJs = null;
var D = null;


function getImg(){
	$("body img").each(function(){ 
		var url = $(this).attr("src");
		if(!!url){
			$(this).attr("src",url + "?_=" + new Date().getTime()); 
		}
	});
}

function loadJs(url, callback, options) {
	options = options || {};
	var head = document.getElementsByTagName('head')[0] || document.documentElement,
			script = document.createElement('script'),
			done = false;
	script.src = url + "?_=" + (new Date()).getTime();
	if (options.charset) {
		script.charset = options.charset;
	}
	if(options["data-main"]){
		$(script).attr("data-main",options["data-main"]);
	}
	if ("async" in options) {
		script.async = options["async"] || "";
	}
	script.onerror = script.onload = script.onreadystatechange = function () {
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
			if (callback) {
				callback();
			}
			script.onerror = script.onload = script.onreadystatechange = null;
			head.removeChild(script);
		}
	};
	head.insertBefore(script, head.firstChild);
}

function loadJsQueue(script,has_table){
	var code = getLangSession();

	var path = (current_html == "guide") ? "../" : "";
//	var code = 1;
//	language_type = "EN";

	var callback = function(){
		loadJs(path + "js/publicPlugin/header.js",function(){
			loadJs(path + "js/publicPlugin/new_lib.js",function(){
				loadJs(path + "js/module_list.js",function(){
					loadJs(path + "js/publicPlugin/myTrip.js",function(){
					if(typeof localStorage != "undefined"){
						if(localStorage.getItem('rid'))
							router.rid = localStorage.getItem('rid');
						if(localStorage.getItem('phoneId'))
							router.phoneId = localStorage.getItem('phoneId');
						if(localStorage.getItem('Language'))
							router.language = localStorage.getItem('Language');
						}
					$.when(init_header(code)).then(function(){
						for(var i in script){
							loadJs("js/" + script[i] + ".js");
						}
						});
					});
				});
			});
		});
	};
	
	//$.when(lang.getLang()).then(function(ret){								   
		loadJs(path + "js/publicPlugin/language_"+ language_type +".js",function(){
			if(has_table){
				loadJs(path + "js/publicPlugin/table.js",function(){
					callback();
				});
			}
			else{
				callback();
			}
		});
	//});
}

function request(options){
	var dfd = $.Deferred();
	if(!!options.url){
		var dataType = options.dataType || "json";
		$.ajax({
			type: options.method || "post",
			url: options.url,
			data:options.data || {},
			dataType: dataType,
			timeout: options.timeout || 5 * 60 * 1000,
			beforeSend:function(xhr, settings){
				//只有远程会带上rid和phoneId
				if(typeof sessionStorage != "undefined"){
					var page = sessionStorage.getItem("page");
					if(!!router.rid && !!router.phoneId && !!page && page == "remote"){
						this.url = "/ubus?phoneId="+router.phoneId+"&rid="+router.rid;
						xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
					}
				}
			},
			error: function (XMLHttpRequest,textStatus,errorThrown) {
				dfd.reject({
					"XMLHttpRequest":XMLHttpRequest,
					"textStatus":textStatus,
					"errorThrown":errorThrown
				});
			},
			success: function (data) {
				dfd.resolve(data);
			}/*,
			complete:function(XMLHttpRequest, textStatus){
				console.log(XMLHttpRequest);
				console.log(textStatus);
			}*/
		},dataType);
	}
	else{
		dfd.reject();
	}
		
	return dfd.promise();
}

function show_request_err(data){
	/*var errStr  = "errorCode:" + data.XMLHttpRequest.status;
	if(!!data.errorThrown){
		errStr += "<br/>errMsg:" + data.errorThrown;
	}
	show_message("error",errStr,3000);*/
}

var lang = {
	langArr:[
		{value:"1",txt:"简体中文",rgn:"CN"},
//		{value:"4",txt:"繁體中文",rgn:"CHT"},
		{value:"2",txt:"English",rgn:"EN"},
//		{value:"5",txt:"Čeština",rgn:"CS"},
//		{value:"6",txt:"Deutsche",rgn:"DE"},
		{value:"7",txt:"Español",rgn:"ES"},
//		{value:"3",txt:"Français",rgn:"FR"},
//		{value:"8",txt:"Italiano",rgn:"IT"},
//		{value:"10",txt:"Nederlands",rgn:"NL"},
//		{value:"11",txt:"Polskie",rgn:"PL"},
//		{value:"12",txt:"Português",rgn:"PT"},
		{value:"13",txt:"Pусский",rgn:"RU"},
//		{value:"14",txt:"Türkçe",rgn:"TR"},
		{value:"15",txt:"Українська",rgn:"UK"},
		{value:"16",txt:"Tiếng Việt",rgn:"VI"},
		
	],
	reObj:function (str) {
		var changeStatus = str.replace(/_/g, "-"), _$1, _$2, _$3, _$4;
		_$1 = $("." + str);
		_$2 = $("#" + str);
		_$3 = $("." + changeStatus);
		_$4 = $(str);
		return (!!_$1.length ? _$1 : false) || (!!_$2.length ? _$2 : false) || (!!_$3.length ? _$3 : false) || (!!_$4.length ? _$4 : false);
	},
	setHtml:function (data, type) {
		var me = this;
		for (var i in data) {
			var currentObj = me.reObj(i);
			if (!currentObj) {
				continue;
			}
			if (typeof data[i] != "string") {
				for (var j = 0; j < data[i].length; j++) {
					currentObj.eq(j)[type](data[i][j]);
				}
			}
			else {
				currentObj[type](data[i]);
			}
		}
	},
	setSelect:function(data, type){
		var me = this;
		for(var i in data){
			var currentObj = me.reObj(i);
			if (!currentObj) {
				continue;
			}
			
			currentObj.empty();
			for (var j in data[i]) {
				currentObj.append("<option value=\"" + data[i][j].value + "\">" + data[i][j].txt + "</option>");
			}
		}
	},
	setAttr:function (data,type) {
		var me = this;
		for (var node in data) {
			var currentObj = me.reObj(node);
			if(!currentObj.length){continue;}
			if (currentObj.length > 0) {
				for (var n = 0; n < currentObj.length; n++) {
					currentObj.eq(n).attr(type, data[node]);
				}
			}
			else {
				currentObj.attr(type, data[node]);
			}
		}
	},
	setButton:function(data){
		var me = this;
		if(data){
			for(var i in data){
				var currentObj = me.reObj(i);
				if(!currentObj.length){continue;}
				if(currentObj.is("button")){
					currentObj.html(data[i]);
				}
				else{
					currentObj.val(data[i]);
				}
			}	
		}
		else{
			var btn_map = language[language_type]["BUTTON"];
			$("input[type=submit],input[type=button],button").each(function () {
				var _class = $(this).attr("class");
				for (var i in btn_map) {
					if (_class == undefined)
						continue;
					if (_class.indexOf(i) > -1) {
						if($(this).is("button"))
							$(this).html(btn_map[i]);
						else
							$(this).val(btn_map[i]);
						break;
					}
		
				}
			});
		}
	},
	detect:function(){
		var me = this;
		if(localStorage.getItem('language')){
			var language =localStorage.getItem('language').toLowerCase();
		}else{
			var language = ((navigator.language) ? navigator.language : navigator.userLanguage).toLowerCase();	
		}
		var obj = {};
		
		
		if(language == "zh-tw" || language == "zh-hk"){
			obj.languageType = "CHT";
			obj.languageCode = "4";
			
		}
		else if(language == "zh-cn" || language == "zh_cn"|| language == "zh"){
			obj.languageType = "CN";
			obj.languageCode = "1";
		}
		else{
			for(var i in me.langArr){
				if(language.substring(0,2).toUpperCase() == me.langArr[i].rgn){
					obj.languageType = me.langArr[i].rgn;
					obj.languageCode = me.langArr[i].value;
					break;
				}
			}	
		}
		
		if(obj.languageType == undefined){
			obj.languageType = "EN";
			obj.languageCode = "2";
		}
		
		return obj;
	},
	setLang:function(val){
//		console.log(val)
//		localStorage.setItem('language', val);
		window.location.reload();
	},
	getLang:function(){
//		console.log(language_type)
		var dfd = $.Deferred();
		
		var ret;
		if(typeof localStorage != "undefined")
			ret = localStorage.getItem('language');
		var obj = {};
		if(!!!ret){
			obj.languageCode = -1;
			obj.languageType = "";
			dfd.resolve(obj);
			
		}else{
			obj.languageCode = ret;
			obj.languageType =ret;
		}
		
		dfd.resolve(obj);
		return dfd.promise();
		
		
		var me = this;
		var dfd = $.Deferred();
		var ret = 1;
		if(typeof localStorage != "undefined")
			ret = localStorage.getItem('language');
		$(".langMask").addClass("off");
//		request({
//			url:"/cgi-bin/skk_get.cgi",
//			dataType:'text'
//		}).done(function(data){
//			data = eval("("+ data +")");
//			ret = data.language * 1;
			var obj = {};
			if(!!!ret){
				obj.languageCode = 65535;
				obj.languageType = "";
				dfd.resolve(obj);
			}
			else{
				obj.languageCode = ret;
				
				for(var i in me.langArr){
					if(ret == me.langArr[i].value * 1){
						obj.languageType = me.langArr[i].rgn;
						break;
					}
				}
				
				dfd.resolve(obj);
			}
//
//		}).fail(function(data){
//			//show_request_err(data);
//			dfd.resolve(65535);
//		});
//		
		return dfd.promise();
	},
	paintMask:function(){
		str = "";
		str += '<div class="langMask off">';
		str += '	<img src="/images/turn.gif" width="50" />';
		str += '</div>';
		$("body").append(str);
	},
	init:function (path) {
		var me = this;
		me.setButton();
		for (var i in path) {
			switch (i) {
				case "html":
					me.setHtml(path[i], "html");
					break;
				case "value":
					me.setHtml(path[i], "val");
					break;
				case "placeholder":
					me.setAttr(path[i],"placeholder");
					break;
				case "select":
					me.setSelect(path[i], "select");
					break;
				case "button":
					me.setButton(path[i]);
					break;
			}
		}
		
	}
};

function getLangCode(ret){
	var code = "";
	if(ret.languageCode == 65535){
		language_type = lang.detect().languageType;
		code = lang.detect().languageCode;
		lang.setLang(code);
	}
	else{
		language_type = ret.languageType;
		code = ret.languageCode;
	}
	return code;
}

function getLangSession(){
	var session_language = null;
	if(typeof sessionStorage != "undefined")
		session_language  = sessionStorage.getItem('language');
	
	if(session_language){
		for(var i in lang.langArr){
			if(session_language * 1 == lang.langArr[i].value * 1){
				language_type = lang.langArr[i].rgn;
				code = lang.langArr[i].value;
				break;	
			}
		}
	}
	
	else{
		language_type = lang.detect().languageType;
		code = lang.detect().languageCode;
	}
	return code;
}


var _DATA = {
	default_token:"00000000000000000000000000000000",
	aes_iv:"poiewjhw49q35j4n",
	keyObj:null,
	get_token_id:function(session_id){
		return !!session_id ? session_id : localStorage.getItem('token_id');
	},
	checkParams:function(obj){
		var me = this;
		var session_id = me.get_token_id(obj[0]);
		
		if(!!!router.rid || !!!router.phoneId){
			if(!!!session_id){
				window.location.replace("login.html");
				return false;
			}
		}
		
		obj[0] = session_id;
		return {
			"jsonrpc": "2.0", 
			"method": "call", 
			"params":obj 
		};
	},
	callUbus:function(obj,type,time,callFn){
		var me = this;
		var param = me.checkParams(obj);
		var path = "/ubus";
		//if(!!router.rid && !!router.phoneId)
			//path += "?" + "rid=" + router.rid + "&" + "phoneId=" + router.phoneId;
		if(param){
			var dfd = $.Deferred();
			request({
				url:path,
				data:JSON.stringify(param),
				timeout: time || 5 * 60 * 1000
			}).done(function(data){
				dfd.resolve(data);
			}).fail(function(data){
				hide_message();
				if(type == "get"){
					show_err_page(data.XMLHttpRequest.status);
					hide_loading_page();
				}
				else{
					if(typeof callFn == "function"){
						callFn();
					}
				}
				dfd.reject();
			});
			return dfd.promise();	
		}
	},
	getKey:function(session_id,key_index){
		
		var me = this;
		var dfd = $.Deferred();
		
		var obj = {};
		
		if(key_index)
			obj.key_index = key_index;
		
		session_id = me.get_token_id(session_id);
		
		$.when(me.callUbus([session_id,"rkey","get_rand_key",obj],"get")).then(function(data){
			
			handleResponse(data,function(){
				
				var rand_key = data.result[1].rand_key;
				var keyObj = {};
				
				keyObj["rand_key"] = rand_key.substring(32, 64);
				keyObj["key_index"] = rand_key.substring(0, 32);
				
				me.keyObj = keyObj;
				dfd.resolve(keyObj);
				
			},function(){
				hide_message();
				hide_loading_page();
				show_err_page();
				dfd.reject();
			});
			
		});
		
		return dfd.promise();
	},
	_encode:function(str,keyObj){
		var me = this;
		var key = CryptoJS.enc.Hex.parse(keyObj.rand_key);
		var iv = CryptoJS.enc.Latin1.parse(me.aes_iv);
		var encrypted = CryptoJS.AES.encrypt(str, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		var cipher_text = encrypted.ciphertext.toString();
		
		return keyObj.key_index + cipher_text;
	},
	encodeAes:function(session_id,str,keyObj){
		var me = this;
		if(!!keyObj){
			if(typeof keyObj == "string"){
				var obj = {};
				obj["rand_key"] = keyObj.substring(32, 64);
				obj["key_index"] = keyObj.substring(0, 32);
				keyObj = obj;
			}
			return me._encode(str,keyObj);
		}
			
		else{
			var dfd = $.Deferred();
			$.when(me.getKey(session_id)).then(function(ret){
				dfd.resolve(me._encode(str,ret));
			});
			return dfd.promise();
		}
		
	},
	_decode:function(str,keyObj){
		var me = this;
		var ciphertext = str.substr(32, str.length - 32)
		var key = CryptoJS.enc.Hex.parse(keyObj.rand_key);
		var iv = CryptoJS.enc.Latin1.parse(me.aes_iv);
		var str16T64 = CryptoJS.enc.Hex.parse(ciphertext).toString(CryptoJS.enc.Base64);
		var decrypted = CryptoJS.AES.decrypt(str16T64, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	},
	decodeAes:function(session_id,str,keyObj){
		var me = this;
		if(!!keyObj){
			if(typeof keyObj == "string"){
				var obj = {};
				obj["rand_key"] = keyObj.substring(32, 64);
				obj["key_index"] = keyObj.substring(0, 32);
				keyObj = obj;
			}
			return me._decode(str,keyObj);
		}
		else{
			var dfd = $.Deferred();
			var key_index = str.substr(0, 32);
			$.when(me.getKey(session_id,key_index)).then(function(ret){
				dfd.resolve(me._decode(str,ret));
			});
			return dfd.promise();
		}
	}
};
