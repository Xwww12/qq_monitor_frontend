// 统一的返回体结构
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T; // 使用泛型，因为 data 可能是数组、对象或 null
}

// 对应数据库的每小时统计数据
export interface HourMsgData {
    hour_time: string; // 格式如 "2026-01-23 16"
    count: number;
}

// 对应数据库的每日统计数据
export interface DayMsgData {
    day_time: string; // 格式如 "2026-01-23"
    count: number;
}

// 对应当前状态数据
export interface CurrentStatus {
    id: number;
    count: number;
    sender_name: string;
    updated_at: string;
}