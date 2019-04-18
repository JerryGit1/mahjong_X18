/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/6.
 *
 *
 * 系统消息
 */
app.register.controller('game_SMCtrl',[
    "$scope","$rootScope","$controller","baseModule","game_SM_service","myPopUp",
    function(scope,rootScope,parentCtrl,baseModule,service,myPopUp){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*导航栏信息*/
            scope.nav_info=rootScope.getMenuInfo("game_systemMessages");
            scope.table_class="";
            scope.list=[];
            scope.current_page=1;/*当前页*/
            scope.page_num=20;/*每页数量*/
            scope.max_page=10;/*总页数*/
            scope.new_content="";/*最新消息*/
            scope.new_as="";/*最新关于我们*/
            /*删除一条信息*/
            scope.deleteInfo=function(id){

            }
            /*添加一条信息*/
            scope.addInfo=function(str){
                /*判断参数是否完整*/
                if(baseModule.judge_param_null([scope.new_content,"系统消息"], [scope.new_as,"联系我们"])){
                    service.add(scope.new_content,scope.new_as,function(data){
                        myPopUp.supernatant("发布成功");
                        getCurrentPageInfo();
                    });
                }
            }
            /*翻页*/
            scope.paging=function(){
                getCurrentPageInfo();
            }
            /*tooltip 提示动画*/
            scope.renderFinish = function(){
                $("[data-toggle='game_SMC_tooltip']").tooltip();
            }
            /*获取显示当前页数据*/
            function getCurrentPageInfo(){
                service.list(scope.current_page,scope.page_num,function(data){
                    scope.list=data.list;
                    scope.max_page=data.maxPage;
                    scope.new_content=data.new_content;
                    scope.new_as=data.new_as;
                });
            }
            getCurrentPageInfo();
        });
    }]);