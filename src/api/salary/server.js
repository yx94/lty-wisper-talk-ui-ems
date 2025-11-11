import request from '@/utils/request'
// import { parseStrEmpty } from "@/utils/ruoyi";

// 服务商签约列表
export function getSubAgreementList() {
  return request({
    url: '/alipay/getSubAgreementList',
    method: 'get'
  })
}

// 记账本转账给员工（单笔到卡）
export function transBankCard(data) {
  return request({
    url: '/alipay/finalize/transBankCard',
    method: 'post',
    data: data
  })
}

// 记账本转账给员工（单笔到户）
export function transAccount(data) {
  return request({
    url: '/alipay/finalize/transAccount',
    method: 'post',
    data: data
  })
}
