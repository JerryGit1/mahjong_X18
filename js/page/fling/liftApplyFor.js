/*唐僧洗头爱飘柔------丁杰2017-12-8
* 提现申请
* */
app.register.controller('fling_liftApplyFor',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","flingService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,flingService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("fling_liftApplyFor");
            scope.page1 = true;
            scope.current_page=1;/*当前页*/
            scope.page_num=7;/*每页数量*/
            scope.max_page=1;/*总页数*/
            scope.stayCheck_data={};//未提现列表数据
            scope.thenCheck_data={};//已提现列表数据

            //字符串转义
            scope.get_name=function(name){
                return decodeURIComponent(name);
            }
            //选项卡
            scope.show = function(page){
                // console.log(page);
                if(page==1){
                    scope.page1 = true;
                    scope.page2 = false;
                    scope.page3 = false;
                    scope.stayCheck_click();//未提现列表  待审批--调用
                }else if(page==2){
                    scope.page1 = false;
                    scope.page2 = true;
                    scope.page3 = false;
                    scope.thenCheck_click();//已提现列表  待审批--调用
                }
            }

            //未提现列表  待审批
            scope.stayCheck=function(){
                // 传数据
                var param={
                    userId:rootScope.userInfo.init_id,//代理ID
                    page:scope.page_num,//每页条数
                    currentPage:scope.current_page//当前页
                }
                /*走接口*/
                flingService.stayCheck(param,function(data){
                    // 遍历数组
                    for(var i=0;i<data.cashs.length;i++){
                        // 时间戳转为时间
                        var time = new Date(data.cashs[i].openTime);
                        var y = time.getFullYear();
                        var m = time.getMonth()+1;
                        var d = time.getDate();
                        // var h = time.getHours();//时
                        // var mm = time.getMinutes();//分
                        var time_date=y+'-'+m+'-'+d;
                        // 时间赋值
                        data.cashs[i].openTime=time_date;
                    }
                    /*-------------------zpb---------------------*/
                    scope.max_page=data.pages;
                    /*-------------------移动端策略--------------------------*/
                    if(rootScope.equipmentName=="mobile"){
                        if(!scope.stayCheck_data||scope.current_page==1)scope.stayCheck_data=[];

                        for(var i in data.cashs){
                            scope.stayCheck_data.push(data.cashs[i]);
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
                        scope.stayCheck_data=data;
                    }
                    scope.pageloading=false;
                })
                /*翻页*/
                scope.paging=function(){
                    //scope.current_page=1;/*当前页*/
                    scope.stayCheck();
                }
            }

            /*未提现列表  待审批点击事件*/
            scope.stayCheck_click=function(){
                scope.current_page=1;/*当前页*/
                scope.stayCheck();
            }

            //已提现列表  已审批
            scope.thenCheck=function(){
                console.log('123');
                // 传数据
                var param={
                    userId:rootScope.userInfo.init_id,//代理ID
                    page:scope.page_num,//每页条数
                    currentPage:scope.current_page//当前页
                }
                /*走接口*/
                flingService.thenCheck(param,function(data){
                    for(var i=0;i<data.cashs.length;i++){
                        // 时间戳转为时间
                        var time = new Date(data.cashs[i].openTime);
                        var y = time.getFullYear();
                        var m = time.getMonth()+1;
                        var d = time.getDate();
                        var time_date=y+'-'+m+'-'+d;
                        // 时间赋值
                        data.cashs[i].openTime=time_date;
                    }
                    //scope.thenCheck_data=data;
                    //scope.updateScroll(1);//平滑滚动

                    // /*-------------------zpb---------------------*/
                    scope.max_page=data.pages;
                    /*-------------------移动端策略--------------------------*/
                    if(rootScope.equipmentName=="mobile"){
                        if(!scope.thenCheck_data||scope.current_page==1)scope.thenCheck_data=[];

                        for(var i in data.cashs){
                            scope.thenCheck_data.push(data.cashs[i]);
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
                        scope.thenCheck_data=data;
                    }
                    scope.pageloading=false;
                })
                /*翻页*/
                scope.paging=function(){
                    //scope.current_page=1;/*当前页*/
                    scope.thenCheck();
                }
            }

            /*已提现列表  已审批点击事件*/
            scope.thenCheck_click=function(){
                scope.current_page=1;/*当前页*/
                scope.thenCheck();
            }

            //同意申请按钮---事件驱动
            scope.consent=function(cashCode){
                myPopUp.alert("确认要同意该提现申请吗？",function(){
                    // 传数据
                    var param={
                        userId:rootScope.userInfo.init_id,//代理ID
                        cashCode:cashCode//订单号
                    }
                    /*走接口*/
                    flingService.consent(param,function(data){
                        scope.stayCheck();//未提现列表  待审批--调用
                    })
                })
            }

            /*翻页*/
            scope.paging=function(){
                //scope.current_page=1;/*当前页*/
                scope.stayCheck();
            }
            scope.stayCheck();//未提现列表  待审批--调用
        });
    }]);