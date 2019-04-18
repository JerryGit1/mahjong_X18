/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 * main
 * 配置类
 *主函数
*/
var app;
(function(){
    /*判断设备类型*/
    var ua = navigator.userAgent;
    var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android终端
    var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var htmUAlName="pc/";
    /*加载的js文件列表*/

    var jsFiles= {
        // 基础-angular
        "angular":cdn_url+ "angular.min",
        // 基础-jquery
        "jquery": cdn_url+"jquery.min",
        // 基础-bootstrapjs
        "bootstrap":cdn_url+ "bootstrap.min",
        // 基础-bootstrapjs 日期组件
        "moment":cdn_url+ "moment-with-locales",
        // 基础-路由
        "angular-ui-router": cdn_url+"angular_ui_router",
        //基础-测试
        "versionConsole":cdn_url+ "AH_tester",
        //基础-管理类
        "manager":"js/manager"
    }
    /*不同设备 额外加载的组件*/
    if (isAndroid||isiOS) {
        htmUAlName="mobile/";
        jsFiles.jroll=cdn_url+ "jroll";//移动端滑动组件
    }else{
        jsFiles.bootstrap_datetime=cdn_url+"bootstrap-datetimepicker.min";//pc端 日期组件
        jsFiles.chart=cdn_url+"chart";//pc端 图表绘制组件
    }
    /*基础加载文件配置*/
    var baseJsList=[],i;
    for(i in jsFiles){
        baseJsList.push(i);
    }
    /*路由器信息配置*/
    var pageBaseUrl="js/page/";
    var playerService="js/service/playerService";/*用户相关的数据接口类*/
    var agencyService="js/service/agencyService";/*代理商相关的数据接口类*/
    var consoleService="js/service/consoleService";/*控制台相关的数据接口类*/
    var jurisdictionService="js/service/jurisdictionService";/*权限管理相关的数据接口类*/
    var gameService="js/service/gameService";/*游戏相关的数据接口类*/
    var jerryService="js/service/jerryService";/*俱乐部*/
    var flingService="js/service/flingService";/*直冲接口类*/
    var qrcode="launcher/js/jquery.qrcode.min";/*qrcode*/
    var routeInfo=[
        {
            //登录
            name:"login",
            basePage:true,/*基础可访问页面*/
            templateUrl: pageBaseUrl+"login/html/index.html",
            fileUrl: [pageBaseUrl+"login/index"]
        },
        { //pc登录
            name:"login_pc",
            basePage:true,/*基础可访问页面*/
            templateUrl: pageBaseUrl+"login/html/person_pc.html",
            fileUrl:[ pageBaseUrl+"login/index"]
        },
        { //移动登录
            name:"login_mobile",
            basePage:true,/*基础可访问页面*/
            templateUrl: pageBaseUrl+"login/html/person_mobile.html",
            fileUrl: [pageBaseUrl+"login/index"]
        },
        { //控制台
            name:"console",
            basePage:true,/*基础可访问页面*/
            templateUrl: pageBaseUrl+"console/html/"+htmUAlName+"index.html",
            fileUrl: [pageBaseUrl+'console/index',consoleService]
        },
        { //管理员列表
            name:"jurisdiction_list",
            templateUrl: pageBaseUrl+"jurisdiction/html/"+htmUAlName+"userList.html",
            fileUrl: [pageBaseUrl+'jurisdiction/userList',jurisdictionService]
        },
        {//管理员搜索列表
            name:"jurisdiction_seek",
            basePage:true,/*基础可访问页面*/
            params:{"seek":null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"jurisdiction/html/"+htmUAlName+"userSeek.html",
            fileUrl: [pageBaseUrl+'jurisdiction/userList',jurisdictionService]
        },
        {//管理员详情
            name:"jurisdiction_info",
            basePage:true,/*基础可访问页面*/
            params:{"seek":null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"jurisdiction/html/"+htmUAlName+"info.html",
            fileUrl: [pageBaseUrl+'jurisdiction/info',jurisdictionService]
        },
        {//管理员添加
            name:"jurisdiction_add",
            basePage:false,/*基础可访问页面*/
            templateUrl: pageBaseUrl+"jurisdiction/html/"+htmUAlName+"add.html",
            fileUrl: [pageBaseUrl+'jurisdiction/info',jurisdictionService]
        },
        { //游戏 系统消息
            name:"game_systemMessages",
            basePage:true,/*基础可访问页面*/
            templateUrl: pageBaseUrl+"game/html/"+htmUAlName+"message.html",
            fileUrl: [pageBaseUrl+'game/messages',gameService]
        },
        { //游戏 系统公告
            name:"game_systemNotice",
            basePage:true,/*基础可访问页面*/
            templateUrl: pageBaseUrl+"game/html/"+htmUAlName+"notice.html",
            fileUrl: [pageBaseUrl+'game/notice',gameService]
        },
        { //游戏 用户反馈
            name:"game_feedback",
            templateUrl: pageBaseUrl+"game/html/"+htmUAlName+"feedback.html",
            fileUrl:[ pageBaseUrl+'game/feedback',gameService]
        },
        { //游戏 系统监测
            name:"game_monitor",
            templateUrl: pageBaseUrl+"game/html/"+htmUAlName+"sMonitor.html",
            fileUrl:[ pageBaseUrl+'game/sMonitor',gameService]
        },
        { //游戏 在线房间列表
            name:"game_onlineRoom",
            templateUrl: pageBaseUrl+"game/html/"+htmUAlName+"onlineRoom.html",
            fileUrl:[ pageBaseUrl+'game/onlineRoom',gameService]
        },
        { //游戏 在线房间搜索
            name:"game_onlineRoomSeek",
            basePage:true,/*基础可访问页面*/
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"game/html/"+htmUAlName+"onlineRoomSeek.html",
            fileUrl:[ pageBaseUrl+'game/onlineRoom',gameService]
        },
        /*-------------------------------玩家--------------------------------------*/
        { //玩家列表
            name:"player_list",
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"list.html",
            fileUrl:[pageBaseUrl+'player/list',playerService]
        },
        { //玩家搜索列表
            name:"player_list_seek",
            basePage:true,/*基础可访问页面*/
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"listSeek.html",
            fileUrl:[ pageBaseUrl+'player/list',playerService]
        },
        { //玩家信息
            name:"player_userInfo",
            basePage:true,/*基础可访问页面*/
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"userInfo.html",
            fileUrl:[ pageBaseUrl+'player/userInfo',playerService]
        },
        { // 黑名单列表
            name:"player_blacklist",
            params:{seek:true},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"blackList.html",
            fileUrl:[ pageBaseUrl+'player/list',playerService]
        },
        { //玩家黑名单 搜索列表
            name:"player_blacklist_seek",
            basePage:true,/*基础可访问页面*/
            params:{blackList:true,seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"blackListSeek.html",
            fileUrl:[pageBaseUrl+'player/list',playerService]
        },
        { //玩家 充值记录
            name:"player_payRecord",
            params:{blackList:true,seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"payRecord.html",
            fileUrl: [pageBaseUrl+'player/payRecord',playerService]
        },
        { //玩家 充值记录搜索
            name:"player_payRecord_seek",
            basePage:true,/*基础可访问页面*/
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"payRecordSeek.html",
            fileUrl: [pageBaseUrl+'player/payRecord',playerService]
        },
        { //玩家 消费记录
            name:"player_consumeRecord",
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"consumeRecord.html",
            fileUrl: [pageBaseUrl+'player/consumeRecord',playerService]
        },
        { //玩家 消费记录搜索
            name:"player_consumeRecord_seek",
            basePage:true,/*基础可访问页面*/
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"consumeRecordSeek.html",
            fileUrl: [pageBaseUrl+'player/consumeRecord',playerService]
        },
        { //玩家 战绩
            name:"player_scoreRecord",
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"gameScoreRecord.html",
            fileUrl: [pageBaseUrl+'player/gameScoreRecord',playerService]
        },
        { //玩家 战绩搜索
            name:"player_scoreRecord_seek",
            basePage:true,/*基础可访问页面*/
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"gameScoreRecordSeek.html",
            fileUrl: [pageBaseUrl+'player/gameScoreRecord',playerService]
        },
        { //玩家 充值
            name:"player_pay",
            templateUrl: pageBaseUrl+"player/html/"+htmUAlName+"pay.html",
            params:{seek:null},/*页面跳转参数*/
            fileUrl: [pageBaseUrl+'player/pay',playerService]
        },
        /*-------------------------------代理商---------------------------------------*/
        { //代理商列表
            name:"agency_list",
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"list.html",
            fileUrl: [pageBaseUrl+'agency/list',agencyService]
        },
        { //代理商搜索
            name:"agency_listSeek",
            basePage:true,/*基础可访问页面*/
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"listSeek.html",
            fileUrl: [pageBaseUrl+'agency/list',agencyService]
        },
        { //代理商添加
            name:"agency_add",
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"add.html",
            fileUrl: [pageBaseUrl+'agency/add',agencyService]
        },
        { //代理商详情
            name:"agency_userInfo",
            basePage:true,/*基础可访问页面*/
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"userInfo.html",
            fileUrl: [pageBaseUrl+'agency/userInfo',agencyService]
        },
        { //代理商修改
            name:"agency_setInfo",
            basePage:true,/*基础可访问页面*/
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"setInfo.html",
            fileUrl: [pageBaseUrl+'agency/add',agencyService]
        },
        { //代理商充卡记录
            name:"agency_buyRecord",
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"buyRecord.html",
            fileUrl: [pageBaseUrl+'agency/buyRecord',agencyService]
        },
        { //代理商充卡记录搜索
            name:"agency_buyRecordSeek",
            params:{userName:null,seek:null},/*页面跳转参数*/
            basePage:true,/*基础可访问页面*/
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"buyRecordSeek.html",
            fileUrl: [pageBaseUrl+'agency/buyRecord',agencyService]
        },
        { //代理出售用户记录----转账记录
            name:"agency_sellRecord",
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"sellRecord.html",
            fileUrl: [pageBaseUrl+'agency/sellRecord',agencyService]
        },
        { //代理出售用户记录搜索------转账记录搜索
            name:"agency_sellRecordSeek",
            basePage:true,/*基础可访问页面*/
            params:{userName:null,seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"sellRecordSeek.html",
            fileUrl: [pageBaseUrl+'agency/sellRecord',agencyService]
        },
        { //代理购买
            name:"agency_pay",
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"pay.html",
            fileUrl: [pageBaseUrl+'agency/pay',agencyService]
        },
        { //代理等级变更
            name:"agency_grade",
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"grade.html",
            fileUrl: [pageBaseUrl+'agency/grade',agencyService]
        },
        { //扣除房卡
            name:"agency_reduce",
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"agency/html/"+htmUAlName+"reduce.html",
            fileUrl: [pageBaseUrl+'agency/reduce',agencyService]
        },

        /*--------------------------直冲----------------------------------*/
        { //直冲明细
            name:"fling_list",
            templateUrl: pageBaseUrl+"fling/html/"+htmUAlName+"list.html",
            fileUrl: [pageBaseUrl+'fling/list',flingService]
        },
        { //绑定用户列表
            name:"fling_bindingUserList",
            templateUrl: pageBaseUrl+"fling/html/"+htmUAlName+"bUserList.html",
            fileUrl: [pageBaseUrl+'fling/userList',flingService]
        },
        { //直冲管理
            name:"fling_manage",
            templateUrl: pageBaseUrl+"fling/html/"+htmUAlName+"manage.html",
            fileUrl: [pageBaseUrl+'fling/manage',flingService]
        },
        { //直冲管理白名单
            name:"fling_whitelist",
            templateUrl: pageBaseUrl+"fling/html/"+htmUAlName+"whitelist.html",
            fileUrl: [pageBaseUrl+'fling/whiteList',flingService]
        },
        { //直冲用户归属管理
            name:"fling_userAffiliation",
            templateUrl: pageBaseUrl+"fling/html/"+htmUAlName+"userAffiliation.html",
            fileUrl: [pageBaseUrl+'fling/userAffiliation',flingService]
        },
        { //提现申请
            name:"fling_liftApplyFor",
            templateUrl: pageBaseUrl+"fling/html/"+htmUAlName+"liftApplyFor.html",
            fileUrl: [pageBaseUrl+'fling/liftApplyFor',flingService]
        },
        /*--------------------------俱乐部----------------------------------*/

        { //我的俱乐部
            name:"jerry_index",
            templateUrl: pageBaseUrl+"jerry/html/"+htmUAlName+"index.html",
            fileUrl: [pageBaseUrl+'jerry/index',jerryService,qrcode]
        },
        { //创建俱乐部
            name:"jerry_add",
            templateUrl: pageBaseUrl+"jerry/html/"+htmUAlName+"add.html",
            fileUrl: [pageBaseUrl+'jerry/add',jerryService]
        },
        { //成员管理
            name:"jerry_userList",
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"jerry/html/"+htmUAlName+"userList.html",
            fileUrl: [pageBaseUrl+'jerry/userList',jerryService]
        },
        { //房卡管理
            name:"jerry_pay",
            params:{seek:null,clubName:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"jerry/html/"+htmUAlName+"pay.html",
            fileUrl: [pageBaseUrl+'jerry/pay',jerryService]
        },
        { //战绩查询
            name:"jerry_recordList",
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"jerry/html/"+htmUAlName+"recordList.html",
            fileUrl: [pageBaseUrl+'jerry/recordList',jerryService]
        },
        { //俱乐部查询
            name:"jerry_seek",
            params:{seek:null},/*页面跳转参数*/
            templateUrl: pageBaseUrl+"jerry/html/"+htmUAlName+"seek.html",
            fileUrl: [pageBaseUrl+'jerry/seek',jerryService]
        },

        /*--------------------------404----------------------------------*/
        {//404
            name:"404",
            basePage:true,/*基础可访问页面*/
            templateUrl:"js/module/404.html",
            fileUrl: ['js/module/404']
        }
    ];
    /*js文件表中加入 需要动态加载的文件*/
    for(i in routeInfo){
        if(routeInfo[i].fileUrl)
        jsFiles[routeInfo[i].name]=routeInfo[i].fileUrl;
    }
    /*异步加载文件配置*/
    var cacheStr="zhoudw";
    if(window["AH_param"]&&window["AH_param"].indexOf("?>"))cacheStr=(new Date()).getTime();
    require.config({
        urlArgs: "r="+cacheStr,/*避免缓存*/
        baseUrl:"",/*根目录*/
        paths:jsFiles,/*加载文件列表*/
        shim: {
            jquery: { exports: 'jquery'},
            bootstrap: {deps: ['jquery']},
            bootstrap_datetime:{deps: ['jquery']},//依赖
            moment:{deps: ['jquery']},//依赖
            // angular
            angular: { exports: "angular" },
            // angular-ui
            "angular-ui-router": ["angular"]
        },
        waitSeconds: 0/*加载超时设置*/

    });
    /*开始加载*/
    define(baseJsList, function (angular,jquery,bootstrap) {
        var baseRouterList={},manager;/*基础可访问页面*/

        app = angular.module('myApp',["ui.router"]);
        /*设置路由*/
        app.config(['$stateProvider',"$urlRouterProvider","$controllerProvider","$compileProvider","$filterProvider","$provide","$locationProvider",
            function(state,route,controllerProvider,compileProvider,filterProvider,provide){
            app.register = {
                //得到$controllerProvider的引用
                controller : controllerProvider.register,
                //同样的，这里也可以保存directive／filter／service的引用
                directive: compileProvider.directive,
                filter: filterProvider.register,
                service: provide.service,factory:provide.factory,
            };
            var data, i,param;
            /*空参数指向的地址*/
            route.otherwise("/console");
            /*配置路由器页面*/
            for(i in routeInfo){
                data=routeInfo[i];
                param={url:"/"+data.name,templateUrl:data.templateUrl};
                if(data.params)param.params=data.params;/*页面直接传参数*/
                if(data.fileUrl)param.resolve=resolve(data.fileUrl);/*异步加载js*/
                if(data.basePage)baseRouterList[data.name]=true;/*基础页面*/
                state.state(data.name,param);
            }
            /*当一个controller在激活之前，需要依赖一个promise的完成时，那么就在controller的逻辑执行之前在$routeProvider中解决这些依赖。如果你需要在controller被激活之前有条件地取消一个路由，那么就用route resolver。*/
            function resolve(fileList){
                return {
                    load: ['$q',function($q) {
                        var defer = $q.defer();
                        /* 动态加载angular模块 */
                        require(fileList, function(data) {
                            defer.resolve(data);
                        });
                        return defer.promise;
                    }]
                };
            }
        }]);
        /*获取路由信息*/
        app.factory("myRouter",[function(){
            return {
                name:function(key){/*名字获取信息*/
                    for(var i in routeInfo){
                        if(routeInfo[i].name==key)return routeInfo[i];
                    }
                    return null;
                }
            }
        }]);

        /*开始初始化管理类*/
        manager=new GM_manager();
        manager.init(baseRouterList);
        /*启动框架*/
        angular.bootstrap(document, ['myApp']);
    });
})();
