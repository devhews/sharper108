import type {Shift} from './types';
export function minutes(value:string){const m=/^(\d{1,2}):(\d\d)(?::\d\d)?$/.exec(value||'');if(!m)return null;const hh=Number(m[1]),mm=Number(m[2]);return hh<24&&mm<60?hh*60+mm:null;}
export function shiftMinutes(shift:Pick<Shift,'start_time'|'end_time'>){const a=minutes(shift.start_time),b=minutes(shift.end_time);if(a===null||b===null)return 0;return (b-a+1440)%1440;}
export function totalMinutes(rows:Pick<Shift,'start_time'|'end_time'>[]){return rows.reduce((sum,row)=>sum+shiftMinutes(row),0);}
export function hours(m:number){return (m/60).toFixed(2);}
export function clockTime(value:string){return value?.slice(0,5)||'';}
export function shortNotes(value:string,max=85){return value.length>max?value.slice(0,max-1)+'…':value;}
export function norm(value:string){return(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');}
export function escapeCsv(value:unknown){return '"'+String(value??'').replace(/"/g,'""')+'"';}
export function saveBlob(content:Blob,filename:string){const url=URL.createObjectURL(content);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
