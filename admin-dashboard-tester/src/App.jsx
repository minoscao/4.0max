import { useEffect, useMemo, useState } from "react";
import {
  Bell, Camera, CaretRight, Check, CheckCircle, ClipboardText, Clock, Cube,
  Factory, Gear, ListChecks, MapPin, PaperPlaneTilt, Play, QrCode, Scan,
  ShieldCheck, Timer, User, UserPlus, UsersThree, WarningCircle, Wrench, XCircle,
} from "@phosphor-icons/react";
import { copy } from "./i18n.js";

const STORAGE_KEY = "m4-workflow-v2";
const WAIT_LIMIT_MS = 10 * 60 * 1000;
const machines = [
  { id:"M-12", nameKey:"pressMachine", line:"Line 2", station:"A-04" },
  { id:"M-03", nameKey:"motorStation", line:"Line 1", station:"B-11" },
  { id:"M-08", nameKey:"sensorStation", line:"Line 3", station:"C-02" },
  { id:"M-17", nameKey:"packingMachine", line:"Line 1", station:"B-08" },
];
const faults = ["cannotStart","abnormalNoise","sensorFault","qualityIssue","otherFault"];
const causes = ["electrical","mechanical","sensor","adjustment"];
const technicians = [
  { name:"Azlan", avatar:"/assets/avatar-azlan.png" },
  { name:"Mei Ling", avatar:"/assets/avatar-mei-ling.png" },
  { name:"Kumar", avatar:"/assets/avatar-kumar.png" },
];

function seedTasks(base=Date.now()) {
  return [
    { id:"WO-260824-01",machineId:"M-12",machineKey:"pressMachine",issueKey:"cannotStart",status:"reported",reporter:"Lim Wei",location:"Line 2 · A-04",reportedAt:base-12*60_000,photo:"",note:"" },
    { id:"WO-260824-02",machineId:"M-03",machineKey:"motorStation",issueKey:"abnormalNoise",status:"repairing",reporter:"Nur Aina",location:"Line 1 · B-11",assignee:"Azlan",avatar:technicians[0].avatar,reportedAt:base-18*60_000,acceptedAt:base-11*60_000,repairStartedAt:base-8*60_000,photo:"",note:"" },
    { id:"WO-260824-03",machineId:"M-08",machineKey:"sensorStation",issueKey:"sensorFault",status:"acceptance",reporter:"Lim Wei",location:"Line 3 · C-02",assignee:"Mei Ling",avatar:technicians[1].avatar,reportedAt:base-32*60_000,acceptedAt:base-27*60_000,repairStartedAt:base-23*60_000,repairCompletedAt:base-3*60_000,result:{causeKey:"sensor",note:"Sensor connector cleaned and signal tested.",photo:""},photo:"",note:"" },
    { id:"WO-260824-04",machineId:"M-17",machineKey:"packingMachine",issueKey:"qualityIssue",status:"closed",reporter:"Siti Hana",location:"Line 1 · B-08",assignee:"Kumar",avatar:technicians[2].avatar,reportedAt:base-68*60_000,acceptedAt:base-62*60_000,repairStartedAt:base-58*60_000,repairCompletedAt:base-43*60_000,closedAt:base-39*60_000,result:{causeKey:"adjustment",note:"Guide rail aligned and sample output checked.",photo:""},photo:"",note:"" },
  ];
}
function readTasks(){try{const data=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(data)&&data.length?data:seedTasks();}catch{return seedTasks();}}
function clock(value,lang){if(!value)return "—";return new Intl.DateTimeFormat(lang==="zh"?"zh-CN":lang==="bm"?"ms-MY":"en-MY",{hour:"2-digit",minute:"2-digit"}).format(value);}
function duration(start,end,lang){if(!start)return "—";const seconds=Math.max(0,Math.floor(((end||Date.now())-start)/1000));const mins=Math.floor(seconds/60);const secs=seconds%60;return lang==="zh"?`${mins}分 ${secs}秒`:`${mins}m ${secs}s`;}
function statusKey(status){return {reported:"statusReported",assigned:"statusAssigned",repairing:"statusRepairing",acceptance:"statusAcceptance",closed:"statusClosed"}[status];}
function StatusIcon({status,size=18}){if(status==="reported")return <WarningCircle size={size}/>;if(status==="assigned")return <UserPlus size={size}/>;if(status==="repairing")return <Wrench size={size}/>;return <CheckCircle size={size}/>;}
function StatusBadge({task,t}){return <span className={`status-badge ${task.status}`}><StatusIcon status={task.status} size={16}/>{t(statusKey(task.status))}</span>;}

function Header({role,setRole,lang,setLang,t}){
  const profile=role==="admin"?"Nadia":role==="operator"?"Lim Wei":"Azlan";
  return <header className="topbar">
    <div className="factory-context"><strong>M4</strong><span>{t("factory")}</span><i/><span>{t("shift")}</span><i/><span>07:00–19:00</span></div>
    <div className="role-switch">{[["admin","roleAdmin"],["operator","roleOperator"],["technician","roleTechnician"]].map(([key,label])=><button key={key} className={role===key?"active":""} onClick={()=>setRole(key)}>{t(label)}</button>)}</div>
    <div className="topbar-actions"><div className="languages">{[["bm","BM"],["zh","中文"],["en","EN"]].map(([key,label])=><button key={key} className={lang===key?"active":""} onClick={()=>setLang(key)}>{label}</button>)}</div><button className="icon-button notification" aria-label="Notifications"><Bell size={20}/><span/></button><div className="profile"><span>{profile[0]}</span><b>{profile}</b></div></div>
  </header>;
}

function TaskList({tasks,selectedId,onSelect,t,lang,now,emptyHint}){
  if(!tasks.length)return <div className="empty-state"><ClipboardText size={34}/><strong>{emptyHint||t("noOrders")}</strong><span>{t("noOrdersHint")}</span></div>;
  return <div className="task-list" role="listbox">{tasks.map(task=><button key={task.id} className={`task-row ${selectedId===task.id?"selected":""}`} onClick={()=>onSelect(task.id)} role="option" aria-selected={selectedId===task.id}><span className={`status-symbol ${task.status}`}><StatusIcon status={task.status} size={21}/></span><span className="task-copy"><strong>{task.machineId} · {t(task.machineKey)}</strong><small>{t(task.issueKey)} · {duration(task.reportedAt,task.closedAt||now,lang)}</small></span><StatusBadge task={task} t={t}/><CaretRight size={17}/></button>)}</div>;
}
function DurationStrip({task,now,t,lang}){return <div className="duration-strip"><div><Clock size={18}/><span>{t("waiting")}</span><strong>{duration(task.reportedAt,task.acceptedAt||now,lang)}</strong></div><div><Wrench size={18}/><span>{t("repairTime")}</span><strong>{task.repairStartedAt?duration(task.repairStartedAt,task.repairCompletedAt||now,lang):t("notStarted")}</strong></div><div><Timer size={18}/><span>{t("totalTime")}</span><strong>{duration(task.reportedAt,task.closedAt||now,lang)}</strong></div></div>;}
function Timeline({task,t,lang}){const steps=[["reported",task.reportedAt],["assigned",task.acceptedAt],["repairStarted",task.repairStartedAt],["repairDone",task.repairCompletedAt],["acceptedClosed",task.closedAt]];const active=steps.findIndex(([,time])=>!time);return <ol className="timeline">{steps.map(([key,time],index)=><li key={key} className={time?"complete":index===active?"active":""}><span>{time?<Check size={13} weight="bold"/>:index+1}</span><b>{t(key)}</b><small>{time?clock(time,lang):index===active?t("now"):"—"}</small></li>)}</ol>;}

function TaskDetail({task,now,t,lang,onFallbackAssign}){
  if(!task)return <div className="detail-empty"><ListChecks size={38}/><strong>{t("orderDetail")}</strong><span>{t("selectOrder")}</span></div>;
  const overdue=task.status==="reported"&&now-task.reportedAt>=WAIT_LIMIT_MS;
  return <article className="detail-pane"><header className="detail-header"><span className="machine-block"><Factory size={31}/></span><div><div className="detail-title"><h2>{task.machineId} · {t(task.machineKey)}</h2><StatusBadge task={task} t={t}/></div><p>{task.id}</p></div></header>
    <div className="fact-grid"><div><WarningCircle size={18}/><span>{t("fault")}</span><strong>{t(task.issueKey)}</strong></div><div><MapPin size={18}/><span>{t("location")}</span><strong>{task.location}</strong></div><div><User size={18}/><span>{t("reporter")}</span><strong>{task.reporter}</strong></div><div><UsersThree size={18}/><span>{t("technician")}</span><strong>{task.assignee||t("unassigned")}</strong></div></div>
    <DurationStrip task={task} now={now} t={t} lang={lang}/><Timeline task={task} t={t} lang={lang}/>
    {task.result&&<div className="result-record"><ShieldCheck size={22}/><div><strong>{t("resultRecorded")} · {t(task.result.causeKey)}</strong><p>{task.result.note}</p></div></div>}
    {task.status==="reported"&&<div className={`fallback-panel ${overdue?"overdue":""}`}><div>{overdue?<WarningCircle size={23}/>:<UsersThree size={23}/>}<span><strong>{overdue?t("fallbackTitle"):t("normalClaim")}</strong><small>{overdue?t("fallbackHint"):t("normalClaimHint")}</small></span></div>{overdue&&<div className="fallback-actions">{technicians.map(tech=><button key={tech.name} onClick={()=>onFallbackAssign(task.id,tech)}><img src={tech.avatar} alt=""/>{t("assign")} {tech.name}</button>)}</div>}</div>}
  </article>;
}

function EquipmentView({tasks,t}){return <main className="simple-page"><PageHeading title={t("equipmentTitle")} sub={t("adminSub")}/><div className="equipment-grid">{machines.map(machine=>{const active=tasks.filter(x=>x.machineId===machine.id&&x.status!=="closed").length;return <article key={machine.id}><Factory size={27}/><div><strong>{machine.id} · {t(machine.nameKey)}</strong><span>{machine.line} · {machine.station}</span></div><b className={active?"warning-text":"ok-text"}>{active?`${active} ${t("ordersCount")}`:"OK"}</b></article>;})}</div></main>;}
function TeamView({tasks,t}){return <main className="simple-page"><PageHeading title={t("teamTitle")} sub={t("normalClaimHint")}/><div className="team-grid">{technicians.map(tech=>{const active=tasks.filter(x=>x.assignee===tech.name&&!['closed','acceptance'].includes(x.status)).length;return <article key={tech.name}><img src={tech.avatar} alt=""/><div><strong>{tech.name}</strong><span>{active?t("busy"):t("teamAvailable")}</span></div><b>{active} {t("ordersCount")}</b></article>;})}</div></main>;}
function Settings({t,lang,setLang,onReset}){return <main className="simple-page settings-page"><PageHeading title={t("settingsTitle")} sub={t("settingsHint")}/><section><h2>{t("languageSetting")}</h2><div className="language-cards">{[["bm","Bahasa Melayu"],["zh","中文"],["en","English"]].map(([key,label])=><button key={key} className={lang===key?"active":""} onClick={()=>setLang(key)}><span>{label}</span>{lang===key&&<CheckCircle size={20} weight="fill"/>}</button>)}</div><button className="secondary-button" onClick={onReset}>{t("demoReset")}</button></section></main>;}
function PageHeading({title,sub,live,t}){return <div className="page-heading"><div><h1>{title}</h1><p>{sub}</p></div>{live&&<span className="live-chip"><i/>{t("live")}</span>}</div>;}

function AdminApp({tasks,setTasks,now,t,lang,notify,setLang}){
  const [section,setSection]=useState("live"),[filter,setFilter]=useState("open");
  const filtered=useMemo(()=>tasks.filter(task=>filter==="all"||(filter==="open"?task.status!=="closed":task.status==="closed")),[tasks,filter]);
  const [selectedId,setSelectedId]=useState(filtered[0]?.id);const selected=filtered.find(x=>x.id===selectedId)||filtered[0];
  useEffect(()=>{if(filtered.length&&!filtered.some(x=>x.id===selectedId))setSelectedId(filtered[0].id);},[filtered,selectedId]);
  const fallback=(id,tech)=>{setTasks(current=>current.map(task=>task.id===id&&task.status==="reported"?{...task,status:"assigned",assignee:tech.name,avatar:tech.avatar,acceptedAt:Date.now(),assignedByAdmin:true}:task));notify(`${t("assignedTo")} ${tech.name}`);};
  const nav=[["live","navLive",ClipboardText],["orders","navOrders",ListChecks],["equipment","navEquipment",Cube],["team","navTeam",UsersThree],["settings","navSettings",Gear]];
  const metrics=[["activeOrders",tasks.filter(x=>x.status!=="closed").length,ClipboardText],["waitingClaim",tasks.filter(x=>x.status==="reported").length,Clock],["repairing",tasks.filter(x=>["assigned","repairing"].includes(x.status)).length,Wrench],["waitingAccept",tasks.filter(x=>x.status==="acceptance").length,CheckCircle]];
  return <div className="role-layout"><aside className="role-sidebar"><nav>{nav.map(([key,label,Icon])=><button key={key} className={section===key?"active":""} onClick={()=>setSection(key)}><Icon size={21}/><span>{t(label)}</span></button>)}</nav></aside><main className="role-main">
    {section==="settings"?<Settings t={t} lang={lang} setLang={setLang} onReset={()=>{const next=seedTasks();setTasks(next);notify(t("resetDone"));}}/>:section==="equipment"?<EquipmentView tasks={tasks} t={t}/>:section==="team"?<TeamView tasks={tasks} t={t}/>:<><PageHeading title={t("adminTitle")} sub={t("adminSub")} live t={t}/><section className="metric-strip">{metrics.map(([key,value,Icon])=><div className="metric" key={key}><Icon size={27}/><span>{t(key)}</span><strong>{value}</strong></div>)}</section><section className="workspace"><div className="workspace-head"><div><Wrench size={22}/><h2>{section==="orders"?t("navOrders"):t("currentOrders")}</h2><span>{filtered.length}</span></div><div className="segmented">{["all","open","closed"].map(key=><button key={key} className={filter===key?"active":""} onClick={()=>setFilter(key)}>{t(key)}</button>)}</div></div><div className="workspace-grid"><TaskList tasks={filtered} selectedId={selected?.id} onSelect={setSelectedId} t={t} lang={lang} now={now}/><TaskDetail task={selected} now={now} t={t} lang={lang} onFallbackAssign={fallback}/></div></section></>}
  </main></div>;
}

function PhotoInput({label,hint,value,onChange,t}){const read=file=>{if(!file||!file.type.startsWith("image/"))return;const reader=new FileReader();reader.onload=()=>onChange(reader.result);reader.readAsDataURL(file);};return <label className={`photo-input ${value?"has-photo":""}`}><input type="file" accept="image/*" capture="environment" onChange={e=>read(e.target.files?.[0])}/>{value?<img src={value} alt={t("photoUploaded")}/>:<Camera size={28}/>}<span><strong>{label}</strong><small>{value?t("photoUploaded"):hint}</small></span></label>;}
function OperatorApp({tasks,setTasks,now,t,lang,notify}){
  const [machine,setMachine]=useState(null),[fault,setFault]=useState(""),[photo,setPhoto]=useState(""),[note,setNote]=useState("");
  const mine=tasks.filter(x=>x.reporter==="Lim Wei").sort((a,b)=>b.reportedAt-a.reportedAt);
  const submit=()=>{if(!machine||!fault)return notify(t("requiredFault"));if(!photo)return notify(t("requiredPhoto"));const created={id:`WO-${Date.now().toString().slice(-8)}`,machineId:machine.id,machineKey:machine.nameKey,issueKey:fault,status:"reported",reporter:"Lim Wei",location:`${machine.line} · ${machine.station}`,reportedAt:Date.now(),photo,note};setTasks(current=>[created,...current]);setMachine(null);setFault("");setPhoto("");setNote("");notify(t("reportSuccess"));};
  const close=id=>{setTasks(current=>current.map(task=>task.id===id&&task.status==="acceptance"?{...task,status:"closed",closedAt:Date.now()}:task));notify(t("closedSuccess"));};
  const rework=id=>{setTasks(current=>current.map(task=>task.id===id&&task.status==="acceptance"?{...task,status:"repairing",repairStartedAt:Date.now(),repairCompletedAt:null,closedAt:null}:task));notify(t("reworkSuccess"));};
  return <main className="worker-page"><div className="worker-heading"><span className="role-icon"><Scan size={28}/></span><div><h1>{t("operatorTitle")}</h1><p>{t("operatorSub")}</p></div></div><div className="worker-grid"><section className="report-panel">
    {!machine?<div className="scan-state"><span><QrCode size={74}/></span><h2>{t("scanMachine")}</h2><p>{t("scanHint")}</p><button className="primary-button" onClick={()=>setMachine(machines[0])}><Scan size={21}/>{t("startScan")}</button></div>:<><div className="scanned-machine"><span><Factory size={31}/></span><div><small>{t("scanned")}</small><strong>{machine.id} · {t(machine.nameKey)}</strong><p>{machine.line} · {machine.station}</p></div><button onClick={()=>setMachine(null)}>{t("scanAgain")}</button></div><fieldset className="fault-picker"><legend>{t("chooseFault")}</legend><div>{faults.map(key=><button type="button" key={key} className={fault===key?"selected":""} onClick={()=>setFault(key)}><WarningCircle size={21}/><span>{t(key)}</span>{fault===key&&<Check size={17} weight="bold"/>}</button>)}</div></fieldset><PhotoInput label={t("addPhoto")} hint={t("photoHint")} value={photo} onChange={setPhoto} t={t}/><label className="text-field"><span>{t("noteOptional")}</span><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={t("notePlaceholder")} maxLength={240}/></label><button className="primary-button submit-report" onClick={submit} disabled={!fault}><PaperPlaneTilt size={21}/>{t("submitRepair")}</button></>}
  </section><section className="my-orders"><header><h2>{t("myOrders")}</h2><span>{mine.length}</span></header>{mine.map(task=><article key={task.id}><div className="order-summary"><span className={`status-symbol ${task.status}`}><StatusIcon status={task.status} size={20}/></span><div><strong>{task.machineId} · {t(task.machineKey)}</strong><small>{task.id} · {duration(task.reportedAt,task.closedAt||now,lang)}</small></div><StatusBadge task={task} t={t}/></div>{task.status==="acceptance"&&<div className="acceptance-box"><p>{t("acceptanceHint")}</p>{task.result&&<blockquote>{task.result.note}</blockquote>}<div><button className="reject-button" onClick={()=>rework(task.id)}><XCircle size={19}/>{t("rejectResult")}</button><button className="accept-button" onClick={()=>close(task.id)}><CheckCircle size={19}/>{t("acceptResult")}</button></div></div>}</article>)}</section></div></main>;
}

function TechnicianApp({tasks,setTasks,now,t,lang,notify}){
  const me=technicians[0];const [tab,setTab]=useState("available"),[selectedId,setSelectedId]=useState(""),[cause,setCause]=useState(""),[note,setNote]=useState(""),[photo,setPhoto]=useState("");
  const available=tasks.filter(x=>x.status==="reported"),mine=tasks.filter(x=>x.assignee===me.name&&x.status!=="closed"),list=tab==="available"?available:mine,selected=list.find(x=>x.id===selectedId)||list[0];
  const claim=id=>{const current=tasks.find(task=>task.id===id);if(!current||current.status!=="reported")return notify(t("alreadyClaimed"));setTasks(items=>items.map(task=>task.id===id?{...task,status:"assigned",assignee:me.name,avatar:me.avatar,acceptedAt:Date.now()}:task));setTab("mine");notify(t("claimedSuccess"));};
  const start=id=>{setTasks(current=>current.map(task=>task.id===id&&task.status==="assigned"?{...task,status:"repairing",repairStartedAt:Date.now()}:task));notify(t("startedSuccess"));};
  const finish=id=>{if(!cause||!note.trim())return notify(t("resultRequired"));setTasks(current=>current.map(task=>task.id===id&&task.status==="repairing"?{...task,status:"acceptance",repairCompletedAt:Date.now(),result:{causeKey:cause,note:note.trim(),photo}}:task));setCause("");setNote("");setPhoto("");notify(t("handoverSuccess"));};
  return <main className="worker-page"><div className="worker-heading"><img src={me.avatar} alt=""/><div><h1>{t("technicianTitle")}</h1><p>{t("technicianSub")}</p></div><span className="available-chip"><i/>{me.name}</span></div><div className="technician-shell"><aside className="tech-list"><div className="worker-tabs"><button className={tab==="available"?"active":""} onClick={()=>setTab("available")}>{t("available")}<span>{available.length}</span></button><button className={tab==="mine"?"active":""} onClick={()=>setTab("mine")}>{t("mine")}<span>{mine.length}</span></button></div><TaskList tasks={list} selectedId={selected?.id} onSelect={setSelectedId} t={t} lang={lang} now={now} emptyHint={t(tab==="available"?"noAvailable":"noMine")}/></aside><section className="tech-detail">{selected?<><div className="tech-machine"><span><Factory size={34}/></span><div><h2>{selected.machineId} · {t(selected.machineKey)}</h2><p><MapPin size={16}/>{selected.location}</p></div><StatusBadge task={selected} t={t}/></div><div className="fault-callout"><WarningCircle size={22}/><div><small>{t("fault")}</small><strong>{t(selected.issueKey)}</strong>{selected.note&&<p>{selected.note}</p>}</div></div><DurationStrip task={selected} now={now} t={t} lang={lang}/>
    {selected.status==="reported"&&<div className="claim-zone"><p><UsersThree size={19}/>{t("broadcast")}</p><button className="primary-button" onClick={()=>claim(selected.id)}><UserPlus size={21}/>{t("claim")}</button></div>}{selected.status==="assigned"&&<div className="claim-zone"><p><MapPin size={19}/>{t("goToMachine")}</p><button className="primary-button" onClick={()=>start(selected.id)}><Play size={21}/>{t("startRepair")}</button></div>}{selected.status==="repairing"&&<div className="repair-form"><h3><Wrench size={21}/>{t("submitResult")}</h3><label><span>{t("resultCategory")}</span><select value={cause} onChange={e=>setCause(e.target.value)}><option value="">—</option>{causes.map(key=><option key={key} value={key}>{t(key)}</option>)}</select></label><label><span>{t("resultNote")}</span><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={t("resultPlaceholder")} maxLength={300}/></label><PhotoInput label={t("resultPhoto")} hint={t("photoHint")} value={photo} onChange={setPhoto} t={t}/><button className="primary-button" onClick={()=>finish(selected.id)}><CheckCircle size={21}/>{t("finishRepair")}</button></div>}{selected.status==="acceptance"&&<div className="waiting-acceptance"><CheckCircle size={31}/><strong>{t("statusAcceptance")}</strong><p>{t("handoverSuccess")}</p></div>}</>:<div className="detail-empty"><Wrench size={38}/><strong>{t(tab==="available"?"noAvailable":"noMine")}</strong></div>}</section></div></main>;
}

export function App(){
  const [tasks,setTasks]=useState(readTasks),[role,setRole]=useState(()=>localStorage.getItem("m4-role")||"admin"),[lang,setLang]=useState(()=>localStorage.getItem("m4-lang")||"zh"),[now,setNow]=useState(Date.now()),[toast,setToast]=useState("");
  const t=key=>copy[lang]?.[key]||copy.en[key]||key;
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);useEffect(()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks)),[tasks]);useEffect(()=>localStorage.setItem("m4-role",role),[role]);useEffect(()=>{localStorage.setItem("m4-lang",lang);document.documentElement.lang=lang==="zh"?"zh-CN":lang==="bm"?"ms":"en";},[lang]);
  const notify=message=>{setToast(message);clearTimeout(window.__m4ToastTimer);window.__m4ToastTimer=setTimeout(()=>setToast(""),3000);};
  return <div className="app-shell"><Header role={role} setRole={setRole} lang={lang} setLang={setLang} t={t}/>{role==="admin"?<AdminApp tasks={tasks} setTasks={setTasks} now={now} t={t} lang={lang} notify={notify} setLang={setLang}/>:role==="operator"?<OperatorApp tasks={tasks} setTasks={setTasks} now={now} t={t} lang={lang} notify={notify}/>:<TechnicianApp tasks={tasks} setTasks={setTasks} now={now} t={t} lang={lang} notify={notify}/>} {toast&&<div className="toast" role="status"><CheckCircle size={19} weight="fill"/>{toast}</div>}</div>;
}
