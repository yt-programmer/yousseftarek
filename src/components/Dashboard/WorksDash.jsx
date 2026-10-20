import { useEffect, useState } from "react";
import { FaLayerGroup } from "react-icons/fa";
import ShowWorks from "./ShowWorks";
import { Skeleton, StateCard } from "./ui";
import { useGetProjects } from "../../hooks/useGetProjects";
import AddWorks from "./AddWorks";
export default function WorksDash() {
 const [page,setPage]=useState(1); const [filter,setFilter]=useState("All");
 const {data,isLoading,error,refetch,filters,total,totalPages}=useGetProjects(10,page,filter);
 const categories=[...new Set((filters||[]).map((item)=>String(item).trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 const changeFilter=(next)=>{if(next===filter)return;setPage(1);setFilter(next);};
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{if(page>totalPages)setPage(totalPages);},[page,totalPages]);
 return <div className="space-y-6"><div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-gradient-to-br from-[#151b1a] to-[#111318] p-5 sm:flex-row sm:items-center sm:justify-between md:p-7"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-400">Portfolio content</p><h2 className="mt-2 text-2xl font-semibold">Projects library</h2><p className="mt-2 text-sm leading-6 text-gray-400">Manage project cards, images, technology stacks and live links.</p></div><AddWorks refetch={refetch}/></div>
 <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111318] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-gray-200">Filter projects</p><p className="mt-1 text-xs text-gray-500">The same categories are used on the public portfolio.</p></div><div className="flex flex-wrap gap-2">{["All",...categories].map((category)=><button key={category} onClick={()=>changeFilter(category)} aria-pressed={filter===category} className={`rounded-full border px-3 py-2 text-xs font-medium capitalize transition ${filter===category?"border-emerald-500 bg-emerald-600 text-white":"border-white/10 text-gray-400 hover:border-emerald-500/50 hover:text-emerald-300"}`}>{category}</button>)}</div></div>
 {!isLoading&&!error&&<p className="text-xs text-gray-500">{total} {total===1?"project":"projects"}{filter!=="All"?` · ${filter}`:""}</p>}
 {isLoading&&<Skeleton rows={3}/>}{error&&<StateCard kind="error" title="Could not load projects" text={error} onRetry={refetch}/>}{data&&data.length>0?<ShowWorks refetch={refetch} works={data} offset={(page-1)*10}/>:!isLoading&&!error&&<div className="rounded-xl border border-dashed border-white/10 bg-[#111318] px-5 py-14 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-300"><FaLayerGroup/></span><h3 className="mt-4 font-semibold">{filter==="All"?"No projects yet":"No projects in this category"}</h3><p className="mt-2 text-sm text-gray-500">{filter==="All"?"Add your first project using the button above.":"Try another category or add a project to this category."}</p></div>}
 {!isLoading&&!error&&totalPages>1&&<div className="flex items-center justify-center gap-3"><button onClick={()=>setPage((v)=>Math.max(1,v-1))} disabled={page<=1} className="rounded-lg border border-white/10 px-3 py-2 text-gray-300 disabled:opacity-30">Previous</button><span className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Page {page} / {totalPages}</span><button onClick={()=>setPage((v)=>Math.min(totalPages,v+1))} disabled={page>=totalPages} className="rounded-lg border border-white/10 px-3 py-2 text-gray-300 disabled:opacity-30">Next</button></div>}</div>;
}
