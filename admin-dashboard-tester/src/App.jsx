import { useEffect, useMemo, useState } from "react";
import {
  Bell, Broadcast, CaretDown, CaretRight, ChartBar, Check, ClipboardText,
  Clock, Cube, DotsThreeVertical, DownloadSimple, Factory, FunnelSimple,
  Gauge, Gear, GearSix, ClockCounterClockwise, MagnifyingGlass, SidebarSimple, SquaresFour,
  Tag, Timer, User, UserPlus, Users, UsersThree, Warning, WarningCircle,
  Wrench,
} from "@phosphor-icons/react";

const technicians = [
  { name: "Azlan", avatar: "/assets/avatar-azlan.png", status: "维修中", load: 78 },
  { name: "Mei Ling", avatar: "/assets/avatar-mei-ling.png", status: "可接单", load: 34 },
  { name: "Kumar", avatar: "/assets/avatar-kumar.png", status: "休息中", load: 0 },
];

const initialTasks = [
  { id: "M-12", machine: "冲压机", issue: "无法启动", status: "timeout", statusText: "响应超时", elapsed: "已等待 24 分钟", assignee: "未分配", avatar: null, line: "2号产线", station: "A-04", reporter: "Lim Wei", reportedAt: "10:24", target: "目标 ≤ 10分钟", wait: 70, repair: 50, total: "2小时 0分钟", Icon: Factory },
  { id: "M-03", machine: "电机故障", issue: "电机过热停机", status: "repair", statusText: "维修中", elapsed: "18 分钟", assignee: "Azlan", avatar: "/assets/avatar-azlan.png", line: "1号产线", station: "B-11", reporter: "Nur Aina", reportedAt: "10:07", target: "预计 10:50 完成", wait: 22, repair: 58, total: "1小时 20分钟", Icon: GearSix },
  { id: "M-08", machine: "传感器异常", issue: "定位信号不稳定", status: "acceptance", statusText: "待验收", elapsed: "维修已完成", assignee: "Mei Ling", avatar: "/assets/avatar-mei-ling.png", line: "3号产线", station: "C-02", reporter: "Chen Hao", reportedAt: "09:42", target: "等待操作工确认", wait: 18, repair: 42, total: "1小时 0分钟", Icon: Broadcast },
  { id: "M-21", machine: "液压压力异常", issue: "压力低于安全值", status: "accepted", statusText: "已接单", elapsed: "6 分钟", assignee: "Kumar", avatar: "/assets/avatar-kumar.png", line: "2号产线", station: "A-09", reporter: "Siti Hana", reportedAt: "10:31", target: "工程师正在前往", wait: 16, repair: 0, total: "16分钟", Icon: Gauge },
];

const navigation = [
  { label: "总览", Icon: SquaresFour }, { label: "维修工单", Icon: ClipboardText },
  { label: "设备", Icon: Cube }, { label: "维修人员", Icon: Users },
  { label: "班次", Icon: Clock }, { label: "分析", Icon: ChartBar },
  { label: "故障分类", Icon: Warning }, { label: "设置", Icon: Gear },
];

const filters = [
  { key: "all", label: "全部" }, { key: "waiting", label: "待响应" },
  { key: "repair", label: "维修中" }, { key: "acceptance", label: "待验收" },
];

const metrics = [
  { label: "运行设备", value: "28", suffix: "/ 32", Icon: Cube },
  { label: "待处理", value: "6", suffix: "", Icon: ClipboardText, accent: true },
  { label: "平均响应", value: "8", suffix: "分钟", Icon: Clock },
  { label: "今日停机", value: "2", suffix: "小时 18分", Icon: Timer },
];

function countFor(tasks, filter) {
  if (filter === "waiting") return tasks.filter((task) => ["timeout", "accepted"].includes(task.status)).length;
  if (filter === "repair") return tasks.filter((task) => task.status === "repair").length;
  if (filter === "acceptance") return tasks.filter((task) => task.status === "acceptance").length;
  return tasks.length;
}

function StatusIcon({ status, size = 17 }) {
  if (status === "timeout") return <WarningCircle size={size} />;
  if (status === "acceptance") return <Check size={size} weight="bold" />;
  if (status === "repair") return <Wrench size={size} />;
  return <ClipboardText size={size} />;
}

function AppHeader({ language, setLanguage, notify }) {
  return (
    <header className="topbar">
      <div className="factory-context"><span>Kilang 2</span><i /><span>早班</span><i /><span>07:00–19:00</span></div>
      <div className="role-switch" aria-label="界面角色">
        <button className="active">管理员</button>
        <button onClick={() => notify("操作工端将在下一阶段开放")}>操作工</button>
        <button onClick={() => notify("维修工程师端将在下一阶段开放")}>维修工程师</button>
      </div>
      <div className="topbar-actions">
        <div className="languages" aria-label="语言">
          {["BM", "中文", "EN"].map((item) => <button key={item} className={language === item ? "active" : ""} onClick={() => setLanguage(item)}>{item}</button>)}
        </div>
        <label className="global-search"><MagnifyingGlass size={18} /><input aria-label="全局搜索" placeholder="搜索设备、工单或人员" /></label>
        <button className="icon-button notification" aria-label="通知" title="通知"><Bell size={21} /><span>3</span></button>
        <button className="profile-button" aria-label="用户菜单"><span>N</span><b>Nadia</b><CaretDown size={14} /></button>
      </div>
    </header>
  );
}

function Sidebar({ activeNav, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">M4</div>
      <nav aria-label="主导航">
        {navigation.map(({ label, Icon }) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => onNavigate(label)} title={label}><Icon size={23} /><span>{label}</span></button>)}
      </nav>
      <button className="collapse-button" aria-label="收起侧边栏"><SidebarSimple size={24} /></button>
    </aside>
  );
}

function MetricStrip() {
  return (
    <section className="metric-strip" aria-label="班次概况">
      {metrics.map(({ label, value, suffix, Icon, accent }) => <div className="metric" key={label}><Icon size={31} /><div><span>{label}</span><strong className={accent ? "accent" : ""}>{value}<small>{suffix}</small></strong></div></div>)}
    </section>
  );
}

function WorkspaceToolbar({ tasks, filter, setFilter, searchOpen, setSearchOpen }) {
  return (
    <div className="workspace-toolbar">
      <div className="workspace-title"><Wrench size={24} /><h2>当前任务</h2><span>{tasks.length}</span></div>
      <div className="filter-tabs" role="tablist" aria-label="任务筛选">
        {filters.map((item) => <button key={item.key} role="tab" aria-selected={filter === item.key} className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)}>{item.label}<span>{countFor(tasks, item.key)}</span></button>)}
      </div>
      <button className="filter-button" aria-label="搜索任务" title="搜索任务" onClick={() => setSearchOpen(!searchOpen)}><MagnifyingGlass size={18} /><FunnelSimple size={16} /></button>
    </div>
  );
}

function TaskList({ tasks, selectedId, onSelect, query, setQuery, searchOpen }) {
  return (
    <div className="master-pane">
      {searchOpen && <label className="task-search"><MagnifyingGlass size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索设备或故障" /></label>}
      <div className="task-rows" role="listbox" aria-label="当前任务列表">
        {tasks.length ? tasks.map((task) => {
          const Icon = task.Icon;
          return (
            <button key={task.id} role="option" aria-selected={selectedId === task.id} className={`task-row ${selectedId === task.id ? "selected" : ""}`} onClick={() => onSelect(task.id)}>
              <span className="machine-icon"><Icon size={29} /></span>
              <span className="task-copy"><strong>{task.id} · {task.machine}</strong><small className={`status ${task.status}`}><StatusIcon status={task.status} />{task.statusText} · {task.elapsed}</small></span>
              <span className="assignee">{task.avatar ? <img src={task.avatar} alt="" /> : <User size={19} />}<span>{task.assignee}</span></span>
              <CaretRight size={17} />
            </button>
          );
        }) : <div className="empty-state"><MagnifyingGlass size={26} /><strong>没有匹配的任务</strong><span>换一个关键词或筛选条件</span></div>}
      </div>
      <button className="view-all">查看全部任务 <CaretRight size={18} /></button>
    </div>
  );
}

function ProgressTimeline({ status }) {
  const current = status === "repair" ? 2 : status === "acceptance" ? 3 : 1;
  const steps = ["报修", "等待接单", "维修", "验收"];
  return (
    <ol className="timeline" aria-label="维修进度">
      {steps.map((step, index) => {
        const complete = index < current;
        const active = index === current;
        return <li key={step} className={complete ? "complete" : active ? "active" : ""}><span>{complete ? <Check size={14} weight="bold" /> : index + 1}</span><b>{step}</b>{index === 0 && <small>10:24</small>}{active && <small>当前</small>}</li>;
      })}
    </ol>
  );
}

function AssignmentPanel({ onAssign, onCancel }) {
  return (
    <div className="assignment-panel">
      <div><strong>选择维修工程师</strong><span>指派后将立即通知工程师</span></div>
      <div className="assignment-options">
        {technicians.map((tech) => <button key={tech.name} disabled={tech.status === "休息中"} onClick={() => onAssign(tech)}><img src={tech.avatar} alt="" /><span><b>{tech.name}</b><small>{tech.status} · 负荷 {tech.load}%</small></span><CaretRight size={16} /></button>)}
      </div>
      <button className="cancel-assign" onClick={onCancel}>取消</button>
    </div>
  );
}

function TaskDetail({ task, onAssign, notify }) {
  const [assigning, setAssigning] = useState(false);
  const Icon = task.Icon;
  return (
    <article className="detail-pane">
      <div className="detail-header">
        <span className="detail-machine-icon"><Icon size={34} /></span>
        <div className="detail-heading"><div><h3>{task.id} {task.machine}</h3><span className={`status-badge ${task.status}`}>{task.statusText}</span></div><p>{task.line} · 工位 {task.station}</p></div>
        <div className={`response-time ${task.status}`}><span><WarningCircle size={19} />{task.status === "timeout" ? "等待响应" : task.statusText}</span><strong>{task.status === "timeout" ? "24" : task.elapsed.replace(/[^0-9]/g, "") || "—"}<small>{task.status === "timeout" ? "分钟" : ""}</small></strong><small>{task.target}</small></div>
        <button className="icon-button detail-menu" aria-label="更多操作" title="更多操作"><DotsThreeVertical size={21} /></button>
      </div>
      <dl className="detail-facts">
        <div><dt><Tag size={17} />故障类型</dt><dd>{task.issue}</dd></div><div><dt><Clock size={17} />报修时间</dt><dd>{task.reportedAt}</dd></div>
        <div><dt><User size={17} />报修人</dt><dd>{task.reporter}</dd></div><div><dt><UsersThree size={17} />当前负责人</dt><dd>{task.assignee}</dd></div>
      </dl>
      <ProgressTimeline status={task.status} />
      {assigning ? <AssignmentPanel onCancel={() => setAssigning(false)} onAssign={(tech) => { onAssign(task.id, tech); setAssigning(false); }} /> : (
        <div className="detail-actions">
          <button className="primary-action" onClick={() => setAssigning(true)}><UserPlus size={20} />{task.assignee === "未分配" ? "指派工程师" : "重新指派"}</button>
          <button className="secondary-action" onClick={() => notify(`${task.id} 设备资料已打开（测试）`)}><Factory size={20} />查看设备</button>
          <button className="quiet-action" onClick={() => notify(`${task.id} 暂无更多维修记录`)}><ClockCounterClockwise size={20} />查看维修记录</button>
        </div>
      )}
    </article>
  );
}

function DowntimeChart({ tasks }) {
  return (
    <section className="analytics-panel downtime-panel">
      <header><Clock size={23} /><h2>停机组成</h2><div className="legend"><span><i className="wait" />等待</span><span><i className="repair" />维修</span></div></header>
      <div className="downtime-rows">{tasks.slice(0, 3).map((task) => <div className="downtime-row" key={task.id}><strong>{task.id}</strong><div className="stacked-bar" aria-label={`${task.id} 停机组成`}><span className="wait" style={{ width: `${Math.max(20, task.wait)}%` }}>{task.wait}分钟</span><span className="repair" style={{ width: `${Math.max(24, task.repair)}%` }}>{task.repair || "—"}{task.repair ? "分钟" : ""}</span></div><small>{task.total}</small></div>)}</div>
    </section>
  );
}

function TechnicianStatus() {
  return (
    <section className="analytics-panel technician-panel">
      <header><UsersThree size={24} /><h2>工程师状态</h2><span>工作负载</span></header>
      <div className="tech-rows">{technicians.map((tech) => <div className="tech-row" key={tech.name}><img src={tech.avatar} alt="" /><strong>{tech.name}</strong><span className={tech.status === "可接单" ? "available" : tech.status === "维修中" ? "working" : "resting"}>{tech.status}</span><div className="load-bar"><i style={{ width: `${tech.load}%` }} /></div><b>{tech.load ? `${tech.load}%` : "—"}</b></div>)}</div>
    </section>
  );
}

export function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedId, setSelectedId] = useState("M-12");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState("中文");
  const [activeNav, setActiveNav] = useState("总览");
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__m4ToastTimer);
    window.__m4ToastTimer = window.setTimeout(() => setToast(""), 2600);
  };

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const filterMatch = filter === "all" || (filter === "waiting" && ["timeout", "accepted"].includes(task.status)) || task.status === filter;
    const queryMatch = `${task.id}${task.machine}${task.issue}${task.assignee}`.toLowerCase().includes(query.toLowerCase());
    return filterMatch && queryMatch;
  }), [tasks, filter, query]);
  const selectedTask = visibleTasks.find((task) => task.id === selectedId) || visibleTasks[0] || tasks[0];

  useEffect(() => {
    if (visibleTasks.length && !visibleTasks.some((task) => task.id === selectedId)) {
      setSelectedId(visibleTasks[0].id);
    }
  }, [visibleTasks, selectedId]);

  const assignTask = (taskId, tech) => {
    setTasks((current) => current.map((task) => task.id === taskId ? { ...task, assignee: tech.name, avatar: tech.avatar, status: "accepted", statusText: "已接单", elapsed: "刚刚指派", target: `${tech.name} 正在前往` } : task));
    notify(`已将 ${taskId} 指派给 ${tech.name}`);
  };

  const navigate = (label) => { setActiveNav(label); if (label !== "总览") notify(`${label} 页面将在下一阶段开放`); };

  return (
    <div className="app-shell">
      <Sidebar activeNav={activeNav} onNavigate={navigate} />
      <div className="app-frame">
        <AppHeader language={language} setLanguage={setLanguage} notify={notify} />
        <main className="dashboard">
          <div className="page-heading"><div><h1>班次控制台</h1><p>8月21日 · 当前班次</p></div><button className="export-button" onClick={() => notify("周报已导出（测试数据）")}><DownloadSimple size={20} />导出周报</button></div>
          <MetricStrip />
          <section className="task-workspace">
            <WorkspaceToolbar tasks={tasks} filter={filter} setFilter={setFilter} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
            <TaskList tasks={visibleTasks} selectedId={selectedTask.id} onSelect={setSelectedId} query={query} setQuery={setQuery} searchOpen={searchOpen} />
            {visibleTasks.length ? <TaskDetail key={selectedTask.id} task={selectedTask} onAssign={assignTask} notify={notify} /> : <div className="detail-empty"><MagnifyingGlass size={28} /><strong>没有可显示的任务详情</strong><span>清除搜索条件后再选择任务</span></div>}
          </section>
          <div className="analytics-grid"><DowntimeChart tasks={tasks} /><TechnicianStatus /></div>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="移动端主导航">{navigation.slice(0, 5).map(({ label, Icon }) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => navigate(label)}><Icon size={22} /><span>{label}</span></button>)}</nav>
      {toast && <div className="toast" role="status"><Check size={18} weight="bold" />{toast}</div>}
    </div>
  );
}
