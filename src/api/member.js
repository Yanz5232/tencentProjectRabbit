import request from "@/utils/request";

export const findCollect = (page, pageSize, collectType = 1) => {
    return request('/member/collect', 'get', { page, pageSize, collectType })
}