function Table(id,head,originData,options,page){//pop 用于从插件向最顶层窗口添加表格
	this.elem = $("#" + id);
	this.head = head;
	this.originData=originData;
	this.data = Object.assign([],originData);
	this.searchParam="";
	var defaults = {//
		size:10,//每页条目数量
		pageRange:10,//最多同时展示的页码数量
		index:page==undefined?1:page,//当前页码
		auto_index:false,//自动编号，用于排序时候序列号依旧从1
		radio: false,
    	checkbox: false,
		sortable:false,
		adjust:true,
		showTotalPageNum:false,//是否显示总页数
		showTotalDataNum:false,//是否显示数据总数量
		showEditPage:false,//是否显示编辑页码功能
		editPageDesc:"",//编辑页码的按钮提示文案
		showHomeAndEnd:false,//是否显示首页和尾页
		info:"",//表格为空的时候，表格内部显示的提示信息
		pageStartElem:"",//表格页码的自定义元素，放在页码前方
		pageChangeCallback:null,//页码切换回调，用于处理切换页面后的事件
		colspan:null,
		sortOptions:{}
	};
	this.options = $.extend(defaults,options);
}

Table.prototype.isIE7 = function(){
	this.ie7 = false;
	var browser=navigator.appName;
	var b_version=navigator.appVersion;
	var version=b_version.split(";"); 
	if(version[1]){
		var trim_Version=version[1].replace(/[ ]/g,""); 
		if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"){ 
			this.ie7 = true;
		} 
		else{
			this.ie7 = false;
		}
	}
}

Table.prototype.IE7_fill = function(content){
	var $d = $("#ie7_table_assist");
	if($d.length > 0)
		$d.remove();
	else{
		$d = $("<div/>").attr("class","section_hide");
		$("body").append($d);
	}	
	$d.html("").append(content);
	this.elem.append($d.html());
}
Table.prototype.initTable = function(){
	this.elem.html("");
	this.isIE7();
	this.initHead();
	this.initBody();
	this.initFooter();
}

Table.prototype.initHead = function(){
	var _this = this;
/*	//表格内容优先级最高，如果表格内容为空，那么表头表尾都不显示
	if(!_this.data.length)
		return;*/
	//临时改成，如果内容为空，则显示表头 + 当前暂无任何内容
    var curTabFooter = this.elem.find(".TabHeader");
    if(curTabFooter.length > 0){
        curTabFooter.remove();
    }
	this.$header = $("<thead/>");
	this.$header.addClass("TabHeader");

	if (!this.$header.find('tr').length) {
		this.$header.append('<tr/>');
	}

	if(!this.head || (this.head && this.head.length == 0)){
		return;
	}
	$.each(this.head,function(k,v){
		var $th = $("<th/>");
		$th.html(v);
		$th.addClass("th_" + k);
		if(_this.options.sortable == true && _this.options.sortOptions.length != 0){
			if(_this.options.sortOptions[k].sortEvent != "" && _this.options.sortOptions[k].sortEvent != undefined){
				$th.addClass("sortable");
				$th.addClass(_this.options.sortOptions[k].sortOrder);
				/*$th.off(E).on(E,function(){
					var index = $(this).index();//获取当前索引值，找到对应的callback
					_this.onSort(this,_this.options.sortOptions[index].sortEvent);
				});*/
			}
		}
		_this.$header.find("tr").append($th);
	});
	if(_this.ie7)
		_this.IE7_fill(this.$header);
	else
		this.elem.append(this.$header);
	
	$(this.elem).undelegate("." + this.$header.attr("class") + " th",E).delegate("." + this.$header.attr("class") + " th",E,function(){
		var index = $(this).index();//获取当前索引值，找到对应的callback
		if (_this.options.sortOptions[index] === "noSort"){
			return;
		}
		_this.onSort(this,_this.options.sortOptions[index].sortEvent);
	});
}

Table.prototype.initBody = function(){
	var _this = this;
    var curTabFooter = this.elem.find(".TabBody");
    if(curTabFooter.length > 0){
        curTabFooter.remove();
    }
	this.$body = $("<tbody/>");
	this.$body.addClass("TabBody");
	
	var data = this.getData();
	//暂无任何内容
	var info = this.options.info ? this.options.info : window.top.L.item_null;
	if(data.length == 0){
		_this.$body.eq(0).html("<tr class=\"no-data\"><td class=\"no-data\" colspan=\""+ this.head.length +"\"><p>"+ info +"</p></td></tr>");
	}
	$.each(data,function(row,row_val){
		var data_row = $("<tr/>");
		if(row % 2 != 0){
			data_row.addClass("evenrow");
		}
		var index = 0;
		$.each(row_val,function(cell,cell_val){
			var data_cell = $("<td/>");
			if(_this.head)
				data_cell.attr("data-th",_this.head[index]);
			if(index == 0){ 
				if(_this.options.auto_index == true)
					data_cell.html((_this.options.index-1) * _this.options.size + (row + 1));
				else
					data_cell.html(cell_val);
			}
			else
				data_cell.html(cell_val);
			index++;
			data_row.append(data_cell);
		});
		_this.$body.eq(0).append(data_row);
	});
	if(_this.ie7)
		_this.IE7_fill(this.$body);
	else
		this.elem.append(this.$body);
	//不出现分页的情况，即是总条数每页条数时
	if(_this.data.length <= _this.options.size){
		_this.adjustIframe();
	}
	
	
}

Table.prototype.initFooter = function(){
	var data = this.data;
	//构造tfoot时候同时构造分页
	var _this = this;
	var length;
	if(this.head)
		length = _this.head.length;
	else
		length = _this.options.colspan;

	var curTabFooter = this.elem.find(".TabFooter");
	if(curTabFooter.length > 0){
		curTabFooter.remove();
	}
	
	//总条目数小于等于每页显示的数量
	if(!data.length || data.length <= this.options.size){
		/*如果要在页码元素前添加元素，使用pageStartElem属性填充*/
		if (!!_this.options.pageStartElem && data.length != 0){
			_this.$footer = $("<tbody/>");
			_this.$footer.addClass("TabFooter");
			if(!_this.$footer.find('tr').length) {
				var $tr = $("<tr/>");
				var $td = $("<td/>");
				$td.append(_this.options.pageStartElem);
				$tr.append($td);
				$td.attr({
					"class":"paging",
					"colspan":length
				});
				_this.$footer.append($tr);
				if(_this.ie7)
					_this.IE7_fill(this.$footer);
				else
					_this.elem.append(this.$footer);

				_this.adjustIframe();
			}
		}
		return;
	}
	
	this.$footer = $("<tbody/>");
	this.$footer.addClass("TabFooter");
	if(!this.$footer.find('tr').length) {
		var $tr = $("<tr/>");
		var $td = $("<td/>");
		$td.attr({
			"class":"paging",
			"colspan":length
		});
		/*如果要在页码元素前添加元素，使用pageStartElem属性填充*/
		if (!!_this.options.pageStartElem){
			$td.append(_this.options.pageStartElem);
		}
		$tr.append($td);
		this.$footer.append($tr);
		this.pagenation($td);
		if(_this.ie7)
			_this.IE7_fill(this.$footer);
		else
			this.elem.append(this.$footer);
		
		_this.adjustIframe();
	}
	if($("#select_All").hasClass("checkedCurrent")){
		$(".TabBody .checkboxShall").val(1).addClass("checkedCurrent")
	}
	if($("#select_page").hasClass("checkedCurrent")){
		$("#select_page").removeClass("checkedCurrent")
	}
}

Table.prototype.pagenation = function(obj){
	var data = this.data;

	var _this = this;
    var allNum = Math.ceil(data.length / this.options.size);
	if(allNum < 2)
		return;
    var nowNum = this.options.index;

	//首页
	function renderHome() {
		if (!!!_this.options.showHomeAndEnd || nowNum <= 1) {
			return;
		}
		var oHome = $("<a/>");
		oHome.addClass("first-page");
		if (nowNum >= 2)
			oHome.attr("href", "#1");
		else
			oHome.attr("href", "javascript:void(0);");
		// oHome.html("首页");
		obj.append(oHome);
	}

	//尾页
	function renderEnd() {
		if (!!!_this.options.showHomeAndEnd ||nowNum >= allNum) {
			return;
		}
		var oHome = $("<a/>");
		oHome.addClass("last-page");
		if (nowNum < allNum)
			oHome.attr("href", "#" + allNum);
		else
			oHome.attr("href", "javascript:void(0);");
		// oHome.html("尾页");
		obj.append(oHome);
	}

	renderHome();
	
    //上一页
	var oA = $("<a/>");
	if(nowNum >= 2)
		oA.attr("href", "#" + (nowNum - 1));
	else
		oA.attr("href", "javascript:void(0);");
	oA.html("&lt;");
	obj.append(oA);

    //显示格式
    if (allNum <= this.options.pageRange) {
        for (var i = 1; i <= allNum; i++) {
            var oA = $("<a/>");
            oA.attr("href", "#" + i);
            if (nowNum == i) {
                oA.attr("class", "current");
            }
            oA.html(i);
            obj.append(oA);
        }
    }
    else {
        //每页都只显示步长那么多条,最后一页可能不满步长
        var tmp_len = allNum - nowNum + Math.floor((this.options.pageRange - 1) / 2) + 1, len = 0;
        if (tmp_len < this.options.pageRange)
            len = tmp_len;
        else
            len = this.options.pageRange;
		let correction_page_number =nowNum - Math.floor((this.options.pageRange - 1) / 2);
		
        for (var i = 0; i < len; i++) {
            if (nowNum >= 2) {
                var oA = $("<a/>");
                var cur_num = nowNum - Math.floor((this.options.pageRange - 1) / 2) + i;
				
				if (correction_page_number<=0){
					cur_num=cur_num-correction_page_number+1;
				}
					oA.attr("href", "#" + cur_num);
					if (cur_num == nowNum) {
						oA.html(nowNum);
						oA.attr("class", "current");
					}
					else {
						oA.html(cur_num);
					}
					obj.append(oA);
            }

            else {
                for (var i = 1; i <= this.options.pageRange; i++) {
                    var oA = $("<a/>");
                    oA.attr("href", "#" + i);
                    if (nowNum == i) {
                        oA.attr("class", "current");
                    }
                    oA.html(i);
                    obj.append(oA);
                }
            }
        }
		
    }

    //下一页
	var oA = $("<a/>");
	if((allNum - nowNum) >= 1)
		oA.attr("href", "#" + (nowNum + 1));
	else
		oA.attr("href", "javascript:void(0);");
	oA.html("&gt;");
	obj.append(oA);
	
	renderEnd();
	
	if (_this.options.showTotalPageNum){
		var oTotal = $("<a/>");
		oTotal.attr("class", "total-num");
		oTotal.attr("href", "javascript:void(0);");
		oTotal.html(nowNum+"/"+allNum);
		obj.append(oTotal);
	}

	if (_this.options.showTotalDataNum){
		var oTotal = $("<a/>");
		oTotal.attr("class", "total-num");
		oTotal.attr("href", "javascript:void(0);");
		oTotal.html(data.length);
		obj.append(oTotal);
	}
	if (_this.options.showEditPage){
		var jumpInput = $("<input type='number' class='jump-input form-control'/>");
		obj.append(jumpInput);

		var jumpBtn = $("<a/>");
		jumpBtn.attr("class", "jump-btn");
		if (!!_this.options.editPageDesc){
			jumpBtn.attr("title", _this.options.editPageDesc);
		}
		jumpBtn.attr("href", "javascript:void(0);");
		obj.append(jumpBtn);
	}
	var clickEvent= "ontouchend" in document ? "touchend" : "click";
	//在IE7下，所有的节点都是字符串拼接而成的，所以所有生成的节点最终都转化成了字符串，不能动态绑定事件，只剩下this.elem
	_this.elem.undelegate("." + _this.$footer.attr("class") + " a",clickEvent).delegate("." + _this.$footer.attr("class") + " a",clickEvent,function(){
		var len = $(this).attr('href').length;
		var nowNum = parseInt($(this).attr('href').substring(1));
		if ($(this).hasClass("jump-btn")){
			nowNum=$('.jump-input').val();
			if (nowNum<=0 || nowNum==="" || nowNum>allNum){
				return ;
			}
		}

		if(isNaN(nowNum))
			return;
		_this.options.index = nowNum;
		_this.initBody();
		_this.initFooter();
		if (!!_this.options.pageChangeCallback){
			_this.options.pageChangeCallback();
		}
		return false;
	});
	
}

Table.prototype.getData = function(){
	var data = this.data;
	var pageSize = this.options.size;
	var pageIndex = this.options.index;
	var arr = [];
	for (var i = pageSize * (pageIndex - 1); i < pageSize * pageIndex; i++) {
        if (i < data.length)
            arr.push(data[i]);
    }
    return arr;
}

Table.prototype.onSort = function(obj,fun){
	var _this = this;
	var data =_this.getSearchData(_this.searchParam);
	
	data.sort(eval("("+ fun + ")"));
	var s_class = $(obj).attr("class");
	var change_order = "";
	if(s_class.indexOf("desc") != -1){
		change_order = "asc";
	}
	else{
		data.reverse();
		change_order = "desc";
	}
	_this.data=data;
	// _this.options.index = 1;
	//复位其他表头
	$.each(_this.$header.find("th"),function(i){
		var s_class = _this.resetSortClass(this);
		if($(this).attr("class").indexOf("sortable") > -1){
			$(this).removeClass().addClass(s_class + " none");

		}
	});
	var default_class = _this.resetSortClass(obj);
	$(obj).removeClass("").attr("class",default_class + " " + change_order);

	_this.initBody();
	_this.initFooter();
}

Table.prototype.resetSortClass = function(obj){
	var tmp_class = $(obj).attr("class").replace("asc","").replace("desc","").replace("none","").trim();
	return tmp_class;
}

Table.prototype.adjustIframe = function(){
	//iframe自己适应高度
	if($("#config_page").length != 0 && !! this.options.adjust){
		if(T_timer)
			window.clearTimeout(T_timer);
		T_timer = window.setTimeout(function(){
			$("#config_page").get(0).contentWindow.nos.app.resizePage();
		},20);
	}
}
/**
 * 根据搜索字符串获取筛选后的数据列表
 * @param searchParam 搜索字符串
 * @returns {*} 返回符合条件的数据列表
 */
Table.prototype.getSearchData = function (searchParam) {
	var _this = this, searchData;
	if (!!!searchParam) {
		_this.searchParam = "";
		searchData = Object.assign([], _this.originData);
	} else {
		_this.searchParam = searchParam;
		searchData = Object.assign([], _this.originData).filter(function (item) {
			let isContain = false;
			for (let key in item) {
				if (!!$(item[key]) && $(item[key]).length > 0) {
					isContain = _this.indeterminateDomContainsString($(item[key]), searchParam);
				} else {
					isContain = item[key].indexOf(searchParam) !== -1;
				}
				if (!!isContain) {
					break;
				}
			}
			return isContain;
		});
	}
	return searchData;
}
/**
 * 模糊搜索，检测table列表是否包含特定字符串
 * @param searchParam 搜索的字符串
 * @param isFirstPage 是否是第一页,如果搜索后进行编辑或者跳转，则传递false,会保持搜索列表的页数
 */
Table.prototype.onSearch = function (searchParam, isFirstPage = true) {
	var _this = this, searchData;
	_this.data = _this.getSearchData(searchParam);
	if (!!isFirstPage) {
		_this.options.index = 1;
	}
	_this.initTable();
}
/**
 * 判断dom中是否包含特定字段，用于模糊搜索
 * @param dom dom结构
 * @param string 检测字符串
 * @returns {boolean} 返回结果，是否包含
 */
Table.prototype.indeterminateDomContainsString = function (dom, string) {
	var _this = this;
	let tmpBool = false;
	if (dom.children().length > 0) {
		for (let i = 0; i < dom.children().length; i++) {
			if (_this.indeterminateDomContainsString($(dom.children()[i]), string)) {
				tmpBool = true;
				break
			}
		}
	} else {
		tmpBool = dom.text().indexOf(string) !== -1;
	}
	return tmpBool;
}

/**
 * 更新原始数据，用于编辑后同步展示修改
 * @param{Object} newObj 新修改的对象，由key-value组成
 * @param{String} key 标识字段,数据table每条数据区分于其他数据的标识，可自定义
 */
Table.prototype.updateOriginData = function (newObj,key) {
	var _this = this;
	dataLoop:for (var i=0;i<_this.originData.length;i++) {
		for (var j in _this.originData[i]) {
			if (_this.originData[i][j].indexOf(key) !== -1) {
				for (var k in newObj) {
					_this.originData[i][k] = newObj[k];
				}
				break dataLoop;
			}
		}
	}
	currDataLoop:for (var m=0;m<_this.data.length;m++){
		for (var n in _this.data[m]){
			if (_this.data[m][n].indexOf(key)!==-1){
				for (var p in newObj){
					_this.data[m][p]=newObj[p];
				}
				break currDataLoop;
			}
		}
	}
	_this.initTable();
/* 	_this.initBody();
	_this.initFooter() */;
}

/*
Table.prototype.sortByName = function (a, b, type, attrName) {

	function compareName(x, y) {
		let reg = /[a-zA-Z0-9]/
		if (reg.test(x) || reg.test(y)) {
			if (x > y) {
				return 1
			} else if (x < y) {
				return -1
			} else {
				return 0
			}
		} else {
			return x.localeCompare(y)
		}
	}

	if (!!$(a[type]) && $(a[type]).length > 0) {
		if (!!attrName) {
			return compareName($(a[type]).attr(attrName), $(b[type]).attr(attrName));
		} else {
			return a[type].text() - b[type].text();
		}
	} else {
		return compareName(a, b);
	}

}*/
