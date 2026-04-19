function getUrlParams(url) {
    var urlStr = url.split('?')[1];
	var obj = {};
	if(!!urlStr){
		var paramsArr = urlStr.split('&')
		if(!!paramsArr){
			for(var i = 0,len = paramsArr.length;i < len;i++){
				var arr = paramsArr[i].split('=')
				obj[arr[0]] = arr[1];
			}
		}	
	}
	
	return obj
}

function storeApp(){
	//page=1 本地
	//page=2 远程
	var obj = getUrlParams(location.href.toString());
	//if(JSON.stringify(obj) == "{}"){
		//sessionStorage.removeItem("page");
	//}
	//else{
		var hasSession = (typeof sessionStorage != "undefined");
		
		if(obj.page * 1 == 1){
			if(hasSession){
				sessionStorage.setItem("page","local");
			}
		}
		else if(obj.page * 1 == 2){
			if(hasSession)
				sessionStorage.setItem("page","remote");
		}
		else{
			if(hasSession){
				//sessionStorage.removeItem("page");
			}
				
		}
	//}
}
function isApp(){
	var obj = {};
	obj.app = false;
	obj.isLocal = false;
	obj.isRemote = false;
	if(typeof sessionStorage != "undefined"){
		var page = sessionStorage.getItem("page");
		if(!!page && page != ""){
			obj.app = true;
			if(page == "local"){
				obj.isLocal = true;
			}
			else if(page == "remote"){
				obj.isRemote = true;
			}
		}
	}
	return obj;
}

function setAppParam(){
	var obj = getUrlParams(location.href.toString());
	if(!!obj.rid && typeof localStorage != "undefined"){
		localStorage.setItem('rid',obj.rid);
	}
	if(!!obj.phoneId && typeof localStorage != "undefined"){
		localStorage.setItem('phoneId',obj.phoneId);
	}	
	if(!!obj.Language && typeof localStorage != "undefined"){
		localStorage.setItem('language',obj.Language);
	}
}

function setPath(str) {
	if(typeof sessionStorage != "undefined"){
		if(str == "exit"){
			sessionStorage.setItem("path","index");
		}
		else{
			var dir = !!str ? str : sessionStorage.getItem("upperDir");
			var href = window.location.href.toString();
			//href = 'http://127.0.0.1:8888/?page=1';
			var site = href.lastIndexOf("\/");
			var obj = {};
			obj.path1 = href.substring(0, site);
			obj.path2 = href.substring(site+1, href.length);
			
			var key = null;
			var tmp = obj.path2.split(".html");
			
			if(tmp.length > 1){
				key = tmp[0];
				if(key && !!dir && key != dir)
					obj.path2 = obj.path2.replace(key,dir);
			}
			else{
				key = dir + ".html" + tmp[0];
				obj.path2 = key;
			}
			
			
			sessionStorage.setItem("path",obj.path1 + "/" + obj.path2);	
		}
	}
}

function setFrom(e,obj,page){
	e.preventDefault();
	setDir(page);
	setPath();
	window.location.href = $(obj).attr("href");
}

function setDir(page){
	if(typeof sessionStorage != "undefined"){
		sessionStorage.setItem("upperDir",!!page ? page : current_html);
	}
}

function removeDir(){
	if(typeof sessionStorage != "undefined")
		sessionStorage.removeItem("upperDir");
}