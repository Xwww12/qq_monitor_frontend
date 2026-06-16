export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0f172a] overflow-hidden">
      {/* 顶部主光：强烈的靛蓝色 */}
      <div className="absolute -top-[10%] left-[15%] w-[600px] h-[600px]">
        <div className="absolute inset-0 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute inset-[20%] rounded-full bg-indigo-400/40 blur-[60px]" />
      </div>

      {/* 右侧重点：明亮的粉色光晕 */}
      <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px]">
        <div className="absolute inset-0 rounded-full bg-pink-500/25 blur-[100px] mix-blend-screen" />
        <div className="absolute inset-[25%] rounded-full bg-pink-300/40 blur-[40px] mix-blend-screen" />
      </div>

      {/* 左下角：补光，增加通透感 */}
      <div className="absolute -bottom-[10%] -left-[5%] w-[700px] h-[700px]">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute inset-[30%] rounded-full bg-cyan-400/30 blur-[70px] mix-blend-overlay" />
      </div>

      {/* 噪点纹理 */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
