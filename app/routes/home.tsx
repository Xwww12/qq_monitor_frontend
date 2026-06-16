import type { Route } from "./+types/home";
import React, {useEffect, useMemo, useState} from 'react';
import AnimatedPanel from '~/components/AnimatedPanel';
import BackgroundGlow from '~/components/BackgroundGlow';
// 后端接口
import {getHourMsgCnt, getDayMsgCnt, getCurrentStatus, getLastSpeaker} from '~/apis/monitor';
// 折线图
import { ResponsiveLine } from '@nivo/line'
// 圆形进度条
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// 热力图
import { ResponsiveCalendar } from '@nivo/calendar'

// 主题样式
import { whiteTextTheme, calendarDarkTheme } from '~/theme/darkTheme'

// 定义的类型
import type { ApiResponse, HourMsgData, CurrentStatus, DayMsgData } from '~/apis/types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "我会一直盯着你们👁👁" },
  ];
}

export default function Home() {
  return (
      <>
          <GlobalLayout/>
      </>
  );
}

// 整体布局
function GlobalLayout () {
    const [chartData, setChartData] = useState<{}[]>([])
    const [calendarData, setCalendarData] = useState<{}[]>([])
    const [status, setStatus] = useState<number>()
    const [speakerData, setSpeakerData] = useState<CurrentStatus>()
    const backgrounds = [
        "/img/background/1.gif",
        "/img/background/3.gif",
        "/img/background/4.gif",
    ]

    // 随机背景
    const currentBg = useMemo(() => {
        return backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }, []);

    // 获取每小时消息数数据
    const getChartData = async () => {
        try {
            const res = await getHourMsgCnt(12)
            if(res == null) {
                setChartData([])
            } else {
                const formatted =transformChartData(res.data)
                setChartData(formatted)
            }

        } catch (err) {
            console.error(err)
        }
    };

    // 获取每日消息数数据
    const getCalendarData= async () => {
        try {
            const res = await getDayMsgCnt(365)
            if(res == null) {
                setCalendarData([])
            } else {
                const formatted =transformCalendarData(res.data)
                setCalendarData(formatted)
            }

        } catch (err) {
            console.error(err)
        }
    }

    // 获取机器人状态
    const getStatus= async () => {
        try {
            const res = await getCurrentStatus()
            if(res == null) {
                setStatus(0)
            } else {
                setStatus(res.data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    // 获取最后说话人
    const getSpeaker= async () => {
        try {
            const res = await getLastSpeaker()
            if(res == null){
                setSpeakerData({
                    id: 0,
                    count: 0,
                    sender_name: '',
                    updated_at: '',
                })
            } else {
                setSpeakerData(res.data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        // 定义定时器
        const quickTimer = setInterval(() => {
            getSpeaker();
            getStatus();
        }, 2000);
        const slowTimer = setInterval(() => {
            getChartData();
            getCalendarData();
        }, 300000);

        // 立即执行一次初始化
        getStatus();
        getSpeaker();
        getChartData();
        getCalendarData();

        // 清理所有定时器
        return () => {
            clearInterval(quickTimer);
            clearInterval(slowTimer);
        };
    }, []); // 这里的空数组确保定时器只在挂载时创建一次

  return (
      <div className="min-h-screen bg-black py-8 px-4 md:px-8 lg:px-16 container mx-auto">
          {/* 背景图片层 */}
          <div
              className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
          >
              <BackgroundGlow/>
          </div>

          <div className="flex flex-col gap-6">

              {/* 第一行 */}
              <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <AnimatedPanel index={0} className="md:col-span-3 relative overflow-hidden p-6 rounded-xl shadow-sm h-[400px] bg-white/10 backdrop-blur-md border border-white/20">
                      {/* 背景图片层 */}
                      <div
                          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
                          style={{ backgroundImage: `url('${currentBg}')` }}
                      ></div>

                      <div className="w-full z-10 overflow-x-auto custom-scrollbar">
                          <h3 className="font-bold mb-4 text-white">每个时段消息数</h3>
                          <div
                              className="h-[300px] flex-shrink-0"
                              style={{ minWidth: '700px' }}
                          >
                              <MyLineChart data={chartData} />
                          </div>

                      </div>
                  </AnimatedPanel>

                  <div className="md:col-span-1 flex flex-col gap-6 h-[400px]">
                      {/* 右上：时钟 */}
                      <AnimatedPanel index={1} className="flex-1 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20">
                          <div className="w-full max-w-[110px]">
                              <GlowClock />
                          </div>
                      </AnimatedPanel>

                      {/* 右中：机器人状态 */}
                      <AnimatedPanel index={2} className="flex-1 p-4 rounded-xl shadow-sm flex items-center justify-start gap-4 bg-white/10 backdrop-blur-md border border-white/20">
                          {/* 左侧：圆形头像框 */}
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-lg overflow-hiddenborder border-white/10">
                              {/* 这里可以放一个 img 标签，或者简单的文字/图标 */}
                               <img src="/img/avatar/avatar.png" alt="User Avatar" className="w-full h-full object-cover" style={{ borderRadius: '50%' }} />
                          </div>

                          {/* 右侧：状态文字区域 */}
                          <div className="flex flex-col">
                              <p className="text-xs text-slate-400 uppercase">时间机器人状态</p>
                              <div className="flex items-center gap-2 mt-1">
                                  {/* 呼吸灯效果 */}
                                  {status === 1 ? (
                                      <>
                                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                          <p className="text-lg font-bold text-emerald-400">时间中</p>
                                      </>

                                  ) : (
                                      <>
                                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                          <p className="text-lg font-bold text-red-400">似了</p>
                                      </>
                                  )}
                              </div>
                          </div>
                      </AnimatedPanel>

                      {/* 右下：说话人 */}
                      <AnimatedPanel index={3} className="flex-1 p-4 rounded-xl shadow-sm flex items-center justify-start gap-4 bg-white/10 backdrop-blur-md border border-white/20">
                          <div
                              className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
                              style={{ backgroundImage: "url('/img/background/2.png')" }}
                          ></div>
                          <p className="text-xl text-slate-400 uppercase">📢：{speakerData?.sender_name}刚刚发言了</p>
                      </AnimatedPanel>
                  </div>
              </section>

              {/* 第二行：占满整行 */}
              <AnimatedPanel index={4} className="w-full p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                  <h3 className="font-bold mb-4 text-white">每日消息总数</h3>

                  {/* 1. 外层：负责提供滚动条 */}
                  <div className="w-full overflow-x-auto custom-scrollbar">

                      {/* 2. 内层：负责强行撑开宽度 */}
                      {/* 使用 style 确保 minWidth 生效，flex-shrink-0 防止被父级压缩 */}
                      <div
                          className="h-[250px] flex-shrink-0"
                          style={{ minWidth: '1000px' }}
                      >
                          <MyCalendar data={calendarData} />
                      </div>

                  </div>
              </AnimatedPanel>

              {/* 第三行：空着且自适应 */}
              {/*<section className="flex-grow border-2 border-dashed border-gray-300 rounded-xl min-h-[200px]">*/}
              {/*    /!* 之后的内容预留区 *!/*/}
              {/*</section>*/}

          </div>
      </div>
  );
}

// 格式转换
const transformChartData = (rawData: HourMsgData[]) => {
    const data = rawData.map(item => {
        // 处理时间格式：'2026-01-23 18' -> '01-23 18:00'
        // 假设原始格式固定为 YYYY-MM-DD HH
        const timeParts = item.hour_time.split(' '); // ['2026-01-23', '18']
        const datePart = timeParts[0].substring(5);  // '01-23'
        const hourPart = timeParts[1];               // '18'

        return {
            x: `${hourPart}:00`,
            y: item.count
        };
    });
    return [{
        id: "消息数",
        data: data
    }]
};

// 格式转换
const transformCalendarData= (rawData: DayMsgData[]) => {
    return rawData.map(item => {
        return {
            value: item.count,
            day: item.day_time
        };
    });
}

// 折线图
function MyLineChart ({data}: any) {
    return (
        <ResponsiveLine
            data={data}
            theme={whiteTextTheme}
            margin={{ top: 25, right: 100, bottom: 45, left: 50 }}
            yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
            axisBottom={{ legend: '时间', legendOffset: 36 }}
            axisLeft={{ legend: '消息数', legendOffset: -40 }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'seriesColor' }}
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}
            enableArea={true}
            enableGridX={false}
            enableGridY={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    translateX: 100,
                    itemWidth: 80,
                    itemHeight: 22,
                    symbolShape: 'circle'
                }
            ]}
        />
    )
}

// 时钟组件
const GlowClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    // 计算背景图片
    const getBackgroundImage = () => {
        const hour = time.getHours();
        // 如果在 6 点到 18 点之间，返回太阳，否则返回月亮
        if (hour >= 6 && hour < 18) {
            return "/img/background/太阳.png";
        } else {
            return "/img/background/月亮.png";
        }
    };

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center justify-center h-full">
            <div
                className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url('${getBackgroundImage()}')` }}
            ></div>

            {/* 💡 这个包装盒宽度跟随内部最大的元素（时间），内部元素默认左对齐 */}
            <div className="inline-flex flex-col">

                {/* 日期：通过 ml-1 稍微修正一下视觉上的左边距（因为字体可能有留白） */}
                <div className="date-display text-sm leading-none ml-1">
                    {time.toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '/')}
                </div>

                {/* 时间：leading-none 移除默认行高，让日期紧贴 */}
                <div className="digital-clock leading-none">
                    {time.toLocaleTimeString([], {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
};

// 热力图
function MyCalendar({data}: any) {
    return (
        <ResponsiveCalendar
            data={data}
            theme={calendarDarkTheme}
            from="2026-6-01"
            to="2026-12-31"
            // 设置未激活状态为深灰色，与黑色背景融合
            emptyColor="#575757"
            // 使用适合深色背景的绿色色阶（类似 GitHub Dark 风格）
            colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
            margin={{ top: 20, right: 10, bottom: 10, left: 20 }}
            yearSpacing={40}
            // 将边框颜色改为透明或与容器背景一致的深色，消除白线
            monthBorderColor="transparent"
            monthSpacing={10}
            dayBorderWidth={3}
            dayBorderColor="#121b32" // 设为容器的背景色 (例如 slate-950)
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'row',
                    translateY: 36,
                    itemCount: 4,
                    itemWidth: 42,
                    itemHeight: 36,
                    itemsSpacing: 14,
                    itemDirection: 'right-to-left',
                    // 4. 图例文字适配
                    // textColor: '#9ca3af'
                }
            ]}
        />
    )
}

