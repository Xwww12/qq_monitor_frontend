import request from './request';
import type { ApiResponse, HourMsgData, CurrentStatus, DayMsgData } from './types';

// 获取每小时统计：返回的是一个包含 HourMsgData 数组的 ApiResponse
export const getHourMsgCnt = (limit: number): Promise<ApiResponse<HourMsgData[]>> => {
    return request({
        url: `/get_hour_msg_cnt`,
        method: 'post',
        data: {
            "limit": limit,
        }
    });
};

// 获取每小时统计：返回的是一个包含 HourMsgData 数组的 ApiResponse
export const getDayMsgCnt = (limit: number): Promise<ApiResponse<DayMsgData[]>> => {
    return request({
        url: `/get_day_msg_cnt`,
        method: 'post',
        data: {
            "limit": limit,
        }
    });
};

// 获取机器人状态
export const getCurrentStatus = (): Promise<ApiResponse<number>> => {
    return request({
        url: '/get_status',
        method: 'get'
    });
};

// 获取机器人状态
export const getLastSpeaker = (): Promise<ApiResponse<CurrentStatus>> => {
    return request({
        url: '/get_last_speaker',
        method: 'get'
    });
};