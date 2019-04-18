/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/2.
 */
/*接口----基础信息*/
app.register.factory("consoleService",["baseService","$rootScope",function(baseService,rootScope){
    var url="/HomeGM/Console/index_manage_center_page/";
    return {
        /*php接口*/
        baseInfo:function(backFun){
            baseService.GM(url,{userId:rootScope.userInfo.init_id},backFun,false);
        },
    }
}]);