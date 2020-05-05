// var dev=true;
var dev = false;

if (dev===true){//开发环境
  var baseUrl = "https://wjt-wuye.f.wmeimob.com/resident"; 
  // var baseUrl = "https://shenbin-wuye.f.wmeimob.com/resident"; 
}else{//生产环境
  var baseUrl = "https://wx.jlzhshequ.cn/resident";
}

const api = {
  wxToken:baseUrl + '/core/wx-token',//获取token
  getAd:baseUrl + '/core/getAd',//获取首页横幅广告、弹窗广告
  ad_detail:baseUrl + '/index/ad_detail',//获取弹窗和横幅广告详情
  bannerDetail:baseUrl + '/core/bannerDetail',//获取弹窗和横幅广告详情
  getOss:baseUrl + '/aliyun/oss-token',//获取阿里云OSS上传凭证
  regSms:baseUrl + '/core/reg-sms',//获取验证码
  coreLogin:baseUrl + '/core/login',//登录/注册
  getBanner:baseUrl + '/core/getBanner',//banner
  getUserInfo:baseUrl + '/core/getUserInfo',//获取当前用户
  top_info_list:baseUrl + '/index/top_info_list',//信息置顶区  
  nbActivity:baseUrl + '/nbActivity',//报名活动详情 type=2时候   指定信息 0 投票活动 1 报名活动 2 问卷 3
  nbBulletinDetail:baseUrl + '/nbBulletin',//查询指定消息详情type=0时候
  nbVoteDetail:baseUrl + '/nbVote',//投票活动详情type=1时候
  nbPaperDetail:baseUrl + '/nbPaper',//问卷详情 type=3时候
  nbPaperQuestionUser:baseUrl + '/nbPaperQuestionUser',//提交问卷
  classify:baseUrl + '/index/classify',//获取分类数据
  indexList:baseUrl + '/index/info_list',//获取消息列表
  indexAllList:baseUrl + '/index/all_info_list',//查询全部信息记录
  communityPersonNum:baseUrl + '/index/community_person_num',//获取小区入驻人数
  nbBulletinLike:baseUrl + '/nbBulletinLike',//信息点赞
  likeCancel:baseUrl + '/nbBulletinLike/cancel',//取消点赞
  nbVoteVoting:baseUrl + '/nbVote/voting',//投票
  signUp:baseUrl + '/nbActivity/signUp',//报名
  getIdentityList:baseUrl + '/core/getIdentity',//已入驻小区列表
  release_num:baseUrl + '/index/release_num',//获取还剩多少次发布机会
  nbBulletinEvaluate:baseUrl + '/nbBulletinEvaluate',//信息评论添加
  peopleInfo:baseUrl + '/index/people_info',//查看其他人信息 首页跳转过来
  check_user_info:baseUrl + '/index/check_user_info',//获取用户 的发布信息列表（带分页）
  userShield:baseUrl + '/userShield',//屏蔽用户
  userShieldCancel:baseUrl + '/userShield/cancel',//取消屏蔽用户1585297981772
  userAttention:baseUrl + '/userAttention',//关注用户
  userAttentionCancel:baseUrl + '/userAttention/cancel',//取消关注用户1585297981772
  nbBulletin:baseUrl + '/nbBulletin',//发布消息
  nbCommunityList:baseUrl + '/nbCommunity/list',//获取可认证小区列表1584500050625
  nbCommunityApply:baseUrl + '/nbCommunity/apply',//获取可认证小区列表1584500050625
  authenticate:baseUrl + '/core/authenticate',//认证小区
  checkIdentity:baseUrl + '/core/checkIdentity',//切换小区
  modifyUser:baseUrl + '/core/modify/user',//修改个人信息
  indexUser:baseUrl + '/index/user',//我的发布
  attentionList:baseUrl + '/core/attention',//我的关注
  shieldList:baseUrl + '/core/shield',//我的屏蔽
  removeUserAttention:baseUrl + '/userAttention/remove',//删除关注
  removeUserShield:baseUrl + '/userShield/remove',//我的屏蔽
  my_demand:baseUrl + '/nbDemand/my_demand',//我的求助  
  nbDemandDetail:baseUrl + '/nbDemand',//求助详情  
  nbDemandPost:baseUrl + '/nbDemand',//发布求助  
  getRuleDetail:baseUrl + '/core/getRule',//获取规则  
  current_demandDetail:baseUrl + '/core/current_demand',//当前正在进行的我的求助  
  cancel_demand:baseUrl + '/core/cancel_demand',//取消正在进行的我的求助  
  nbEnthusiastic:baseUrl + '/nbEnthusiastic',//成为热心居民  
  nbAdvertisersApply:baseUrl + '/nbAdvertisersApply',//成为广告主  
  nbCommunityRecommend:baseUrl + '/nbCommunityRecommend',//推荐小区使用  
  voteList:baseUrl + '/core/vote',//我的投票  
  paperList:baseUrl + '/core/paper',//我的问卷  
  paperDetail:baseUrl + '/core/paper_detail',//我的问卷查看详情  
  myAbility:baseUrl + '/core/my_ability',//我的能力  
  nbAbilityLike:baseUrl + '/nbAbilityLike',//能力点赞  
  nbAbilityLikeCancle:baseUrl + '/nbAbilityLike/cancel',//能力取消点赞  
  nbAbilityPost:baseUrl + '/nbAbility',//发布能力  
  activityList:baseUrl + '/core/activity',//我的报名  
  cancel_activity:baseUrl + '/core/cancel_activity',//取消报名  
  moneyList:baseUrl + '/nbDemand/money/list',//滚动求助信息（根据时间和金额来排序）
  moneyPageList:baseUrl + '/nbDemand/money/page',//分页查询求助信息(点击滚动跳转，根据时间和金额排序)
  likeList:baseUrl + '/nbAbility/like/list',//获取互助页面的能力列表 （分页）（搜索也可用）
  nbAbilityClassify:baseUrl + '/nbAbilityClassify',//互助分类
  ability_detail:baseUrl + '/index/ability_detail',//获取能力详情
  nbAbilityComplaint:baseUrl + '/nbAbilityComplaint',//投诉
  sendMessage:baseUrl + '/nbMessage',//添加消息
  msg_count:baseUrl + '/nbMessage/msg_count',//获取消息总数
  nbMessageList:baseUrl + '/nbMessage',//分页消息列表
  clearMsg:baseUrl + '/nbMessage/clear_all',//全部清除
  redpackList:baseUrl + '/core/redpack',//首页查询可领取红包
  nbRedPackRecord:baseUrl + '/nbRedPackRecord',//我收到的红包分页查询
  nbRedPackRecordTotal:baseUrl + '/nbRedPackRecord/total',//查询收到的红包总额
  sendRedPack:baseUrl + '/core/sendRedPack',//领取红包
  nbredpackadapply:baseUrl + '/nbRedPackRecord',//查询红包详情
  nbRedPackRecord:baseUrl + '/nbRedPackRecord',//红包详情1586245040856
  nbAdvertisersRecommend:baseUrl + '/nbAdvertisersRecommend',//红包详情1586245040856
  have_resident:baseUrl + '/index/have_resident',//验证是否已经认证共享区或住户
  getPhone:baseUrl + '/core/getPhone',//获取手机号
}

module.exports = api