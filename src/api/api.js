import { getAction,deleteAction,putAction,postAction,postActionup} from '@/api/manage'


//角色管理
const addRole = (params)=>postAction("/sys/role/add",params);
const editRole = (params)=>putAction("/sys/role/edit",params);
// const getRoleList = (params)=>getAction("/sys/role/list",params);
// const deleteRole = (params)=>deleteAction("/sys/role/delete",params);
// const deleteRoleList = (params)=>deleteAction("/sys/role/deleteBatch",params);
const checkRoleCode = (params)=>getAction("/sys/role/checkRoleCode",params);
//const queryall = (params)=>getAction("/sys/role/queryall",params);
const queryall = (params)=>getAction("/Component/user/showAllRoles",params);

//用户管理
const addUser = (params)=>postAction("/Component/user/addUser",params);
const editUser = (params)=>putAction("/Component/user/updateUser",params);
const queryUserRole = (params)=>getAction("/users/user/queryUserRole",params);
const getUserList = (params)=>getAction("/users/user/list",params);
const queryInsider=(params)=>getAction("/users/user/queryByFid")
const frozenBatch = (params)=>putAction("/sys/user/frozenBatch",params);
const updatePwd=(params)=>postAction("/Component/user/updatePassword",params);

//权限管理
const addPermission= (params)=>postAction("/sys/permission/add",params);
const editPermission= (params)=>putAction("/sys/permission/edit",params);
const getPermissionList = (params)=>getAction("/sys/permission/list",params);
const queryTreeList = (params)=>getAction("/sys/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>getAction("/sys/role/queryTreeList",params);
const queryListAsync = (params)=>getAction("/sys/permission/queryListAsync",params);
const queryRolePermission = (params)=>getAction("/sys/permission/queryRolePermission",params);
const saveRolePermission = (params)=>postAction("/sys/permission/saveRolePermission",params);
const queryPermissionsByUser = (params)=>getAction("/sys/permission/getUserPermissionByToken",params);
const loadAllRoleIds = (params)=>getAction("/sys/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>getAction("/sys/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>getAction("/sys/permission/queryPermissionRule",params);

//分类管理
const queryTerms = (params)=>getAction("/Component/component/showTerms",params);
const queryTerm = (params)=>getAction("/Component/component/showTerms1",params);
const deleteByTermId = (params)=>getAction("/Component/component/deleteTermById",params);
const uploadComponent = (params)=>postAction("/Component/component/uploadComponent",params);


// 部门管理
const queryDepartTreeList = (params)=>getAction("/sys/sysDepart/queryTreeList",params);
const queryIdTree = (params)=>getAction("/sys/sysDepart/queryIdTree",params);
const queryParentName   = (params)=>getAction("/sys/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>getAction("/sys/sysDepart/searchBy",params);
const deleteByDepartId   = (params)=>deleteAction("/sys/sysDepart/delete",params);

//日志管理
const deleteLog = (params)=>deleteAction("/sys/log/delete",params);
const deleteLogList = (params)=>deleteAction("/sys/log/deleteBatch",params);

//数据字典
const addDict = (params)=>postAction("/sys/dict/add",params);
const editDict = (params)=>putAction("/sys/dict/edit",params);
const treeList = (params)=>getAction("/sys/dict/treeList",params);
const addDictItem = (params)=>postAction("/sys/dictItem/add",params);
const editDictItem = (params)=>putAction("/sys/dictItem/edit",params);
//const delDictItem = (params)=>deleteAction("/sys/dictItem/delete",params);
//const delDictItemList = (params)=>deleteAction("/sys/dictItem/deleteBatch",params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params)=>getAction(`/sys/dict/getDictItems/${code}`,params);

//系统通告
const doReleaseData = (params)=>getAction("/sys/annountCement/doReleaseData",params);
const doReovkeData = (params)=>getAction("/sys/annountCement/doReovkeData",params);
//获取系统访问量
const getLoginfo = (params)=>getAction("/sys/loginfo",params);
const getVisitInfo = (params)=>getAction("/sys/visitInfo",params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params)=>getAction("/sys/user/queryUserByDepId",params);

// 查询用户角色表里的所有信息
const queryUserRoleMap = (params)=>getAction("/sys/user/queryUserRoleMap",params);
// 重复校验
const duplicateCheck = (params)=>getAction("/sys/duplicate/check",params);

export {
    addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  updatePwd,
  queryUserRole,
  getUserList,
  queryInsider,
  queryall,
  frozenBatch,
  queryTerms,
  queryTerm,
  uploadComponent,
  deleteByTermId,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  queryUserRoleMap,
  duplicateCheck,
  queryTreeListForRole,
}



