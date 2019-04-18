/**
 * 创建者 伟大的周鹏斌大王 on 2017/9/19.
 *
 * 直冲明细
 */
app.register.controller('fling_list',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","flingService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,flingService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("fling_list");
            scope.flingWidth_data={today:0,yesterday:0,canCash:0};/*今日直充金额,昨日直充金额,可提现金额*/
            scope.current_page=1;/*当前页*/
            scope.page_num=15;/*每页数量*/
            scope.max_page=1;/*总页数*/
            scope.flingList_data={};/*直冲明细列表*/
            scope.flingWidth_data={today:0,yesterday:0,canCash:0};/*今日直冲，昨日直冲，可提现金额数据*/
            scope.applyPay_data={};//代理申请提现
            /*-------------事件--------------*/
            /*直冲明细接口*/
            scope.flingList=function(){
                // 传数据
                var param={
                    userId:rootScope.userInfo.init_id,//代理ID
                    page:scope.page_num,//每页数量
                    currentPage:scope.current_page//当前页
                }
                /*走接口*/
                flingService.flingList(param,function(data){
                    for(var i=0;i<data.users.length;i++){
                        var time = new Date(data.users[i].openTime);
                        var y = time.getFullYear();
                        var m = time.getMonth()+1;
                        var d = time.getDate();
                        var h = time.getHours();
                        var mm = time.getMinutes();
                        var time_date=y+'-'+m+'-'+d+' '+h+':'+mm;
                        data.users[i].openTime=time_date;
                    }
                    //总页数赋值到当前页数
                    scope.max_page=data.pages;
                    //内容搜索提示
                    if(data.total)scope.nav_input_tips="共"+data.total+"条记录";
                    // alert(scope.nav_input_tips);
                    /*-------------------移动端策略--------------------------*/
                    if(rootScope.equipmentName=="mobile"){
                        if(!scope.flingList_data||scope.current_page==1)scope.flingList_data=[];
                        // 遍历列表累加赋值
                        for(var i in data.users){
                            scope.flingList_data.push(data.users[i]);
                        }
                        /*今日直冲，昨日直冲，可提现金额数据赋值*/
                        scope.flingWidth_data=data;
                        //满100元可提现
                        if(scope.flingWidth_data.canCash>=100){
                            scope.sow=true;
                            scope.trueMoney=function(){
                                myPopUp.alert("确定要提现"+scope.flingWidth_data.canCash+"元吗？",function(){
                                    // 传数据
                                    var param={
                                        userId:rootScope.userInfo.init_id//代理ID
                                    }
                                    /*走接口*/
                                    flingService.applyPay(param,function(data){
                                        myPopUp.supernatant("申请已提交，请等待审核！");
                                    })
                                })
                            }
                        }else if(scope.flingWidth_data.canCash==".00"){
                            scope.flingWidth_data.canCash="0";
                        }else{
                            scope.sow=false;
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
                        scope.flingList_data=data.list;
                    }

                    scope.pageloading=false;
                })
            }

            /*翻页组件*/
            scope.paging=function(){
                scope.flingList();
            }
            scope.flingList();//直冲明细列表调用
        });
    }]);