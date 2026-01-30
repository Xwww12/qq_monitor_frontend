export const whiteTextTheme = {
    // 1. 全局文字颜色
    textColor: "#ffffff",
    fontSize: 12,

    // 2. 坐标轴样式
    axis: {
        domain: {
            line: {
                stroke: "#ffffff", // 轴线颜色
                strokeWidth: 1
            }
        },
        legend: {
            text: {
                fill: "#ffffff", // 轴名称（Transportation / Count）颜色
                fontWeight: 'bold'
            }
        },
        ticks: {
            line: {
                stroke: "#ffffff", // 刻度线颜色
                strokeWidth: 1
            },
            text: {
                fill: "#ffffff" // 刻度数字颜色
            }
        }
    },

    // 3. 图例文字样式
    legends: {
        text: {
            fill: "#ffffff" // 图例文字颜色
        }
    },

    // 4. 悬停提示框样式 (Tooltip)
    tooltip: {
        container: {
            background: "#333333", // 提示框背景设为深色，防止文字看不清
            color: "#ffffff",
            fontSize: 12
        }
    },

    // 5. 网格线颜色（可选，建议设为透明或深色）
    grid: {
        line: {
            stroke: "rgba(255, 255, 255, 0.1)", // 淡白色网格线
            strokeWidth: 1
        }
    }
};

export const calendarDarkTheme = {
    // 1. 全局基础文字
    text: {
        fontSize: 12,
        fill: "#9ca3af", // 灰色文字 (slate-400)
        outlineWidth: 0,
        outlineColor: "transparent",
    },
    // 2. 专门针对 Calendar 的标签 (月份、年份)
    labels: {
        text: {
            fill: "#ffffff", // 亮灰色 (slate-200)
            fontSize: 12,
            fontWeight: 500,
        },
    },
    // 3. 提示框
    tooltip: {
        container: {
            background: "#1e293b",
            color: "#f3f4f6",
            fontSize: 12,
        },
    },
};