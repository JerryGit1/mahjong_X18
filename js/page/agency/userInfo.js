/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/29.
 *
 * 用户详情
 */
app.register.controller('agency_userInfoCtrl',[
    "$scope","$rootScope","$controller","baseModule","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------基础变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("agency_userInfo");
            scope.seekMyCacheName="a_info_uId";
            scope.searchPlaceholder="ID 搜索";
            scope.setSeekKeyword();
            /*-------------事件--------------*/
            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(id);
                console.log(id);
                addUserInfo();
            }
            function addUserInfo(){
                ///*个人信息*/
                // console.log(scope.seek);
                service.id_getUserInfo(scope.seek,function(data){
                    scope.userInfo=data;
                    scope.userId=data.id;
                    scope.userInfo.userName=decodeURIComponent(scope.userInfo.userName);
                    scope.userInfo.levelName=rootScope.configInfo.IDLevel["level"+data.grade].name;/*身份*/
                    scope.userInfo.total_sell=Number(data.sell_agency_money)+Number(data.sell_player_money);
                    /*判断代理是否为测试代理*/
                    if(scope.userInfo.test_agency=="0"){
                        scope.show=true;
                    }else if(scope.userInfo.test_agency=="1"){
                        scope.show=false;
                    }
                    if(!scope.userInfo.buyMoney){
                        scope.userInfo.buyMoney=0;
                    }
                    /*平滑滚动*/
                    scope.updateScroll(1);
                    ///*购买信息*/
                    if(rootScope.equipmentName=="pc")
                    service.user_buy_record(scope.userId,1,10,function(data){
                        scope.buyInfo=data.list;
                        ///*出售信息*/
                        service.user_sell_record(scope.userId,1,10,function(data){
                            scope.sellInfo=data.list;

                        });
                    });
                });
            }
            /*给TA充值*/
            scope.pay=function(){
                baseModule.skipPage("agency_pay",{seek: scope.userId});
            }
            /*设为测试代理*/
            scope.set_up_test_agency=function (num) {
                var param={
                    user_id:scope.userInfo.id,
                    test_num:num
                }
                service.set_up_test_agency(param,function (data) {
                })
                addUserInfo();
            }
            /*修改信息*/
            scope.serInfo=function(){
                baseModule.skipPage("agency_setInfo",{seek: scope.userId});
            }
            /*查看更多信息*/
            scope.lookMore=function(type){
                var name;
                switch(type){
                    case 1:/*购买记录*/
                        name='agency_buyRecordSeek';
                        break;
                    case 2:/*出售/充值记录*/
                        name='agency_sellRecordSeek';
                        break;
                }
                baseModule.skipPage(name,{seek: scope.userId,userName: scope.userInfo.userName});
            }
            /*tooltip 提示动画*/
            $("[data-toggle='game_SMC_tooltip']").tooltip();

            addUserInfo();
        });
}]);