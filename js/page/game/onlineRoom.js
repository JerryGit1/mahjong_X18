/**
 * 创建者 伟大的周鹏斌大王 on 2017/8/11.
 *
 * 在线房间列表
 */

/*基础控件*/
app.register.directive("gameOnlineRoomBaseList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/game/html/'+rootScope.equipmentName+'/onlineRoomBaseList.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*AH_webSocket*/
app.register.factory("AH_webSocket",["$rootScope",function(rootScope){
    var connection;
    var _isWSOpen=false;
    return {
        start:function () {
            var url="ws://"+rootScope.configInfo.socketUrl;
            this.close();
            connection = new WebSocket(url);
            connection.onopen = this.wsOpen;
            connection.onclose  = this.wsClose;
            connection.onmessage = this.wsMessage;
            connection.onerror = this.wsError;
        },
        wsOpen:function () {//握手成功
            console.log("握手ok");
            _isWSOpen=true;
            rootScope.$broadcast('wsOpen');
        },
        wsClose:function () {//捕获断开
            console.log("websocket close");
            _isWSOpen=false;
        },
        close:function () {//主动断开
            if(connection){
                console.log("websocket 主动断开");
                this._isWSOpen=false;
                connection.close();
            }
        },
        send:function (data) {//发送数据
            console.log("发送数据",data);
            connection.send(JSON.stringify(data));
        },
        wsMessage:function (e) {//接受数据
            var data=e.data;
            if(data){
                data=JSON.parse(data);
                if(Number(data.state)==1){
                    data.info.interfaceId=data.interfaceId;
                    rootScope.$broadcast('wsMessage',data.info);
                }else{
                    console.log(data.message);
                }
            }
        },
        wsError:function(event) {
            console.log("websocket Error:"+ event.data);
        },
        _isOpen:function () {
            return _isWSOpen;
        }
    }
}]);
/*基础*/
app.register.controller('game_onlineRoomBaseCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","game_onlineRoom_service",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*-------------基础变量--------------*/
        scope.nav_info;/*导航栏信息*/
        scope.table_class="terques";
        scope.list=[];
        scope.current_page=1;/*当前页*/
        scope.page_num=20;/*每页数量*/
        scope.max_page=10;/*总页数*/
        scope.nav_input_type="tel";
        scope.pageLastPageTips="做人留一线---------------日后好相见";
        /*-------------事件--------------*/
        /*解散房间*/
        scope.deleteInfo=function(roomId){
            myPopUp.alert("确认解散房间?",function () {
                service.killRoom(roomId,function (success) {
                    if(success){
                        myPopUp.supernatant("操作成功");
                        scope.current_page=1;
                        scope.getCurrentPageInfo();
                    }
                });
            });

        }
        /*翻页*/
        scope.paging=function(){
            scope.getCurrentPageInfo();
        }
        /*tooltip 提示动画*/
        scope.renderFinish = function(){
            $("[data-toggle='game_SMC_tooltip']").tooltip();
        }
        /*处理数据*/
        scope.setInfo=function (data) {
            scope.loadingInfoOk(data);
            for(var i in scope.list){
                var time=scope.list[i]["cTime"];
                scope.list[i]["pName"]=decodeURIComponent(scope.list[i]["pName"]);
                if(time)scope.list[i]["cTime"]=baseModule.getTime(time);
            }
        }
    }]);
/*列表*/
app.register.controller('game_onlineRoomCtrl',[
    "$scope","$rootScope","$controller","baseModule","game_onlineRoom_service",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('game_onlineRoomBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------基础变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("game_onlineRoom");/*导航栏信息*/
            scope.table_class="terques";
            /*-------------事件--------------*/
            /*搜索*/
            scope.startSearch=function(id){
                baseModule.skipPage('game_onlineRoomSeek',{seek: id});
            }
        });
    }]);
/*搜索*/
app.register.controller('game_onlineRoomSeekCtrl',[
    "$scope","$rootScope","$controller","baseModule","AH_webSocket",'$location',"myPopUp",
    function(scope,rootScope,parentCtrl,baseModule,AH_webSocket,location,myPopUp){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------基础变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("game_onlineRoomSeek");/*导航栏信息*/
            scope.roomInfo;//房间信息
            scope.playerInfo;//玩家信息
            scope.nav_input_type="tel";//数字键盘
            scope.searchPlaceholder="输入房间号";
            scope.seekMyCacheName="g_online_seek";/*搜索内容缓存关键字*/
            scope.setSeekKeyword();
            /*-------------事件--------------*/
            /*初始化数据*/
            function initData() {
                scope.roomInfo={
                    roomId:"??????",//房间号
                    circleNum:0,//总圈数
                    lastNum:0,//剩余圈数
                    maxScoreInRoom:0,//封顶分
                    status:1,//状态
                };//房间信息
                scope.playerInfo=[
                    {
                        userId:"",
                        score:0,
                        userName:"???",
                        userImg:"",
                        _isHouse:true
                    },{
                        userId:"",
                        score:0,
                        userName:"???",
                        userImg:"",
                        zhuang:true
                    },{
                        userId:"",
                        score:0,
                        userName:"???",
                        openImg:""
                    },{
                        userId:"",
                        score:0,
                        userName:"???",
                        userImg:""
                    }
                ];
            }
            initData();
            /*搜索*/
            scope.startSearch=function(id){
                scope.seek=id;
                if(scope.seek=="13126631266"){
                    scope.getOnLineNum();
                }else{
                    scope.getRoomInfo();
                }

            }
            /*获取显示当前页数据*/
            scope.getRoomInfo=function(){
                if(AH_webSocket._isOpen()){
                    baseModule.dataTips(true);
                    AH_webSocket.send({
                        interfaceId:"999801",
                        roomSn:Number(scope.seek)
                    });
                }else{
                    AH_webSocket.start();
                }
            }
            /*获取在线人数信息*/
            scope.getOnLineNum=function () {
                if(AH_webSocket._isOpen()){
                    baseModule.dataTips(true);
                    AH_webSocket.send({
                        interfaceId:"999802"
                    });
                }else{
                    AH_webSocket.start();
                }
            }
            //连接成功
            scope.$on("wsOpen",function () {
                if(scope.seek) scope.getRoomInfo();
            });
            //得到数据
            scope.$on("wsMessage",function (e,data) {
                baseModule.dataTips(false);
                if(data.interfaceId=="999801"){//搜索信息
                    if(data.rooms&&data.rooms.length>0&&data.rooms[0].roomInfo){
                        scope.roomInfo=data.rooms[0].roomInfo;
                        scope.playerInfo=data.rooms[0].playersInfo;
                        for(var i in scope.playerInfo){
                            scope.playerInfo[i].userName=decodeURIComponent(scope.playerInfo[i].userName);
                        }
                        scope.setSeekKeyword(Number(scope.seek));
                        scope.$apply();
                    }else{
                        scope.clearSeekKeyWord();
                        initData();
                        scope.$apply();
                    }
                }else if(data.interfaceId=="999800"){//解散成功
                    myPopUp.supernatant("操作成功");
                    scope.clearSeekKeyWord();
                    initData();
                    scope.$apply();
                }else if(data.interfaceId=="999802"){//解散成功
                    myPopUp.alert("在线房间:"+Number(data.roomNum)+",在线人数:"+Number(data.userNum),null,"周大王作弊码");
                }
                //平滑滚
                scope.updateScroll(1);
            });
            //跳转页面捕获 断开socket 免得占内存
            scope.$on('$locationChangeStart', function() {
                if(location.path()!="/game_onlineRoomSeek") {
                    AH_webSocket.close();
                }
            });
            //解散房间
            scope.dissolveRoom=function () {
                if(AH_webSocket._isOpen()){
                    myPopUp.alert("确认解散房间【"+scope.seek+"】",function () {
                        baseModule.dataTips(true);
                        AH_webSocket.send({
                            interfaceId:"999800",
                            roomSn:Number(scope.seek)
                        });

                    });
                }else{
                    AH_webSocket.start();
                }
            }
            AH_webSocket.start();
            //平滑滚
            scope.updateScroll(1);
        });
    }]);