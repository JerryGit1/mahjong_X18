/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/28.
 */
app.register.controller("errorCtrl",["$scope","$rootScope","baseModule",
    function(scope,rootScope,baseModule){
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*导航栏信息*/
            scope.nav_info=rootScope.getMenuInfo("404");

            $("#404Div").find(">div").css("opacity",0);
            $("#404Div").find(">div").animate({"opacity":1},600);
        });
    }
]);