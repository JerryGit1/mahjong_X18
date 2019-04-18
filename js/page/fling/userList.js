/**
 * 创建者 伟大的周鹏斌大王   on 2017/9/19.
 *
 * 已绑定用户
 */
app.register.controller('fling_userList',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","flingService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,flingService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("fling_list");
            scope.todayCardNum=0;/*今日直充金额*/
            scope.yesterdayCardNum=0;/*昨日直充金额*/
            scope.pushMoneyRMB=0;/*可提现金额*/
            scope.bindList_data={};/*已绑定用户列表数据*/

            scope.current_page=1;/*当前页*/
            scope.page_num=8;/*每页数量*/
            scope.max_page=1;/*总页数*/
            scope.bottomTips="玩命加载中...";/*底部提示*/
            /*-------------事件--------------*/
            /*已绑定用户列表接口*/
            scope.bindList=function(){
                // 传数据
                var param={
                    userId:rootScope.userInfo.init_id,//代理ID
                    page:scope.page_num,//每页数量
                    currentPage:scope.current_page//当前页
                }
                /*走接口*/
                scope.bottomTips="玩命时加载中...";/*底部提示*/
                flingService.bindList(param,function(data){
                    /*时间戳转为时间*/
                    for(var i=0;i<data.users.length;i++){
                        var time = new Date(data.users[i].openTIme);
                        var y = time.getFullYear();
                        var m = time.getMonth()+1;
                        var d = time.getDate();
                        var h = time.getHours();
                        var mm = time.getMinutes();
                        var s = time.getSeconds();
                        var time_date=y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
                        // 时间赋值
                        data.users[i].openTIme=time_date;
                    }

                    /*-------------------zpb---------------------*/
                    scope.max_page=data.pages;
                    //内容搜索提示
                    if(data.total)scope.nav_input_tips="共"+data.total+"条记录";
                    // alert(scope.nav_input_tips);
                    /*-------------------移动端策略--------------------------*/
                    if(rootScope.equipmentName=="mobile"){
                        if(!scope.bindList_data||scope.current_page==1)scope.bindList_data=[];

                        for(var i in data.users){
                            scope.bindList_data.push(data.users[i]);
                        }
                        /*移动端 滑动到底部提示*/
                        //当前页等于总页数时，
                        if(scope.current_page==scope.max_page){
                            scope.pageTips=scope.pageLastPageTips;
                        }else if(scope.max_page==0){
                            scope.pageTips="*>.<*! 运气不佳没有查到任何信息";
                        }
                        /*启动或者刷新滑动组件*/
                        scope.updateScroll(scope.current_page);
                    }else{
                        scope.bindList_data=data;
                    }
                    scope.pageloading=false;
                })
            }
            /*翻页*/
            scope.paging=function(){
                scope.bindList();
            }
            scope.bindList();//已绑定用户列表调用
        });
    }]);