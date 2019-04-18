/*
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 * 控制台首页
 * 管理控制层
 * */
app.register.controller('consoleIndexCtrl',[
    "$scope","$rootScope","$controller","baseModule","consoleService","setCenterLayout","myCache","myPopUp","consoleService",
    function(scope,rootScope,parentCtrl,baseModule,service_console,setCenterLayout,myCache,myPopUp,consoleService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*--------------父类基础信息配置-------------------*/
            scope.nav_info=rootScope.getMenuInfo("console");/*导航栏信息*/
            /*--------------当前基础信息配置-------------------*/
            /*用户信息*/
            var userInfo=rootScope.userInfo;
            if(userInfo.userHead.length<10)scope.userHead="image/head/"+userInfo.userHead+".png";
            else scope.userHead=userInfo.userHead;
            scope.userName=decodeURIComponent(userInfo.userName);
            scope.userId=userInfo.userId;
            scope.phone=userInfo.phone;
            scope.loginIP=userInfo.loginIp;
            scope.newTime=userInfo.newTime;
            scope.money_name=rootScope.money_name;
            /*账号级别*/
            scope.levelInfo=rootScope.configInfo.IDLevel["level"+userInfo.IDLevel];
            scope.gameLoginUrl=rootScope.configInfo.gameLoginUrl;
            scope.add_fling_btn=false;/*是否显示直冲功能*/
            scope.node_str="-";
            /*移动端三个显示*/
            scope.money=0;/*库存房卡*/
            scope.buyMoney=0;/*总购买*/
            /*总出售*/
            scope.sell_agency_money=0;/*出售给代理的记录*/
            scope.sell_player_money=0;/*出售给玩家的记录*/
            /*切换游戏场景时的初始变量*/
            scope.switch="";
            scope.jerry_is_show=false;//设置是否显示俱乐部管理，等级变更，扣除房卡等功能
            /*直冲功能暂时不用*/
            // if(rootScope.configInfo.statistic_pro_name=="wsw_X4"&&rootScope.configInfo.vType!="release"){
            //     scope.add_fling_btn=true;
            // }
            /*不同级别显示不同附属信息*/
            if(userInfo.IDLevel>=7){
                $("#cg_div").addClass("show");
            }else if(userInfo.IDLevel==6){
                $("#gly_div").addClass("show");
            }else if(userInfo.IDLevel==5){
                $("#S_daili_div").addClass("show");
            }else if(userInfo.IDLevel==4){
                $("#daili_div").addClass("show");
            }

            /*--------------事件-------------------*/
            /*基础信息  php接口*/
            service_console.baseInfo(function(data){
                scope.money=data.money;/*房卡*/
                scope.buyMoney=data.buyMoney;/*总购买*/
                /*总出售*/
                scope.sell_agency_money=Number(data.sell_agency_money); /*给代理的充值的money*/
                scope.sell_player_money=Number(data.sell_player_money); /*给玩家的充值的money*/
                if(data&&data.maxUserNum){
                    // 个人信息
                    scope.adminPayTotalMoney=data.adminPayTotalMoney;/*总投入房卡----个人信息*/
                    // 玩家信息
                    scope.maxUserNum=data.maxUserNum;/*总玩家*/
                    scope.dayNewAddUserNum=data.dayNewAddUserNum;/*玩家数据，本日新增用户*/
                    scope.weekNewAddUserNum=data.weekNewAddUserNum;/*玩家数据，本周新增用户*/
                    scope.monthNewAddUserNum=data.monthNewAddUserNum;/*玩家数据，本月新增用户*/
                    scope.userPayTotalMoney=data.userPayTotalMoney;/*玩家总充值*/
                    scope.userConsumeTotalMoney=data.userConsumeTotalMoney;/*玩家总消费*/
                    // 代理信息
                    scope.maxUserAgency=data.maxUserAgency;/*总代理*/
                    scope.dayNewAddUserAgency=data.dayNewAddUserAgency;/*代理数据，本日新增用户*/
                    scope.weekNewAddUserAgency=data.weekNewAddUserAgency;/*代理数据，本周新增用户*/
                    scope.monthNewAddUserAgency=data.monthNewAddUserAgency;/*代理数据，本月新增用户*/
                    scope.agencyAllPayManey=data.agencyAllPayManey;/*代理总充值*/
                    scope.agencyAllExpense=data.agencyAllExpense;/*代理总消费*/
                }
                scope.updateScroll(1);
            });
            /*监听要切换的某部分游戏*/
            scope.$watch("switch",function(){
                if(scope.switch=="唐山斗地主"){
                    myPopUp.alert("确定要切换到唐山斗地主吗？",function(){

                        alert("唐山");
                    });
                }else if(scope.switch=="智乐斗地主"){
                    myPopUp.alert("确定要切换到智乐斗地主吗？",function () {
                        alert("智乐");

                    });
                }
            })
            /*跳转链接*/
            scope.skipPage=function (type) {
                var name;
                switch(type){
                    case 1:/*出售/充值(代理之间)记录*/
                        name='agency_sellRecord';
                        break;
                    case 2:/*购买记录*/
                        name='agency_buyRecord';
                        break;
                    case 3:/*玩家充值*/
                        name='player_pay';
                        break;
                    case 4:/*代理管理*/
                        name='agency_setInfo';
                        break;
                    case 5:/*在线房间*/
                        name='game_onlineRoomSeek';
                        break;
                    case 6:/*菜单栏*/
                        setCenterLayout.setMenu();
                        return;
                    case 7:/*跳转游戏*/
                        window.location.href=scope.gameLoginUrl;
                        return;
                    case 8:/*退出登录*//*消除缓存*/
                        myCache.clearLoginInfo();
                        window.open('','_self');
                        window.close();
                        // 退出时刷新当前页面
                        myPopUp.alert("确定要退出账号吗？",function(){
                            location.reload(true);
                        })
                        return;
                    case 9://直充管理
                        name="fling_manage";
                        break;
                    case 10://白名单
                        name="fling_whitelist";
                        break;
                    case 11://用户归属管理
                        name="fling_userAffiliation";
                        break;
                    case 13://直冲明细
                        name="fling_list";
                        break;
                    case 14://已绑定用户
                        name="fling_bindingUserList";
                        break;
                    case 15://提现申请
                        name="fling_liftApplyFor";
                        break;
                    case 16:/*出售/充值(代理给玩家的)记录*/
                        name="player_payRecord";
                        break;
                    case 17:/*俱乐部查询*/
                        name="jerry_seek";
                        break;
                    case 18:/*俱乐部功能*/
                        name="jerry_index";
                        break;
                    case 19:/*等级变更*/
                        name="agency_grade";
                        break;
                    case 20:/*等级变更*/
                        name="agency_reduce";
                        break;

                }
                baseModule.skipPage(name);
            }
            /*tooltip 提示动画*/
            $(function () {
                $("[data-toggle='console_tooltip']").tooltip();
            });
        });
}]);


/*日活跃统计*/
app.register.controller('statisticsDayActiveCtrl',[
    "$scope","$rootScope","$controller","baseModule","consoleService",
    function(scope,rootScope,parentCtrl,baseModule,service_console){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="日活跃统计";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.khd_login_uv
        ];
        scope.setDataInfo();
    }]);

/*在线人数统计*/
app.register.controller('statisticsOnlineCtrl',[
    "$scope","$rootScope","$controller","baseModule","consoleService",
    function(scope,rootScope,parentCtrl,baseModule,service_console){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="在线人数统计";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.khd_online_p
        ];
        scope.setDataInfo();
    }]);


/*登录统计*/
app.register.controller('statisticsUserLoginCtrl',[
    "$scope","$rootScope","$controller","baseModule","consoleService",
    function(scope,rootScope,parentCtrl,baseModule,service_console){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="访问量统计";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.khd_login
        ];
        scope.setDataInfo();
}]);

/*分享统计*/
app.register.controller('statisticsShareCtrl',[
    "$scope","$rootScope","$controller","baseModule","consoleService",
    function(scope,rootScope,parentCtrl,baseModule,service_console){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="分享统计";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.khd_share
        ];
        scope.setDataInfo();
}]);

/*代理购买(房卡)统计*/
app.register.controller('statisticsBuyCtrl',[
    "$scope","$rootScope","$controller","baseModule","consoleService",
    function(scope,rootScope,parentCtrl,baseModule,service_console){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="代理购买统计(张)";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.khd_a_buy
        ];
        scope.setDataInfo();
}]);

/*玩家充值(房卡)消费统计*/
app.register.controller('statisticsPayCtrl',[
    "$scope","$rootScope","$controller","baseModule","consoleService",
    function(scope,rootScope,parentCtrl,baseModule,service_console){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="玩家充值/消费统计(张)";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.khd_a_pay
        ];
        scope.setDataInfo();
    }]);

/*房主模式消费(房卡)/代开模式 消费统计*/
app.register.controller('statisticsConsumeCtrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="开房消费统计(张)";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.u_cRoom,
            scope.operation_list.d_cRoom,
            scope.operation_list.j_cRoom
        ];
        scope.setDataInfo();
    }]);