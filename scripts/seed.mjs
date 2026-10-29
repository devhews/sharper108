// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.mjs
// Use ONLY on the supervisor's trusted computer. Never embed the service role key in web files.
import fs from 'node:fs';import{createClient}from'@supabase/supabase-js';
const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key)throw Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
const source=JSON.parse(fs.readFileSync(new URL('./source-backup.json',import.meta.url),'utf8')).records;
const client=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
const normalized=x=>(x||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const staff=(source.staff||[]).map(s=>({id:s.id,name:s.name,role:s.role||'',employment_type:s.type||'',notes:s.notes||''}));
const roster=Object.entries(source.roster||{}).flatMap(([shift_group,rows])=>rows.map(r=>({id:r.id,staff_id:staff.find(s=>normalized(s.name)===normalized(r.name))?.id||null,name:r.name,shift_group,start_time:r.start,end_time:r.end,notes:r.notes||''})));
const building=(source.building||[]).map(b=>({id:b.id,title:b.title,category:b.category||'',location:b.location||'',contact:b.contact||'',details:b.details||'',notes:b.notes||''}));
const cleaning=(source.cleaning||[]).map(c=>({id:c.id,title:c.title||c.issue||'Cleaning issue',location:c.location||'',surface:c.surface||'',attempts:c.attempts||'',outcome:c.outcome||'',status:c.status||'Unresolved',notes:c.notes||''}));
for(const [table,records] of [['staff',staff],['roster_assignments',roster],['building_information',building],['cleaning_issues',cleaning]]){if(!records.length){console.log(`${table}: 0`);continue}const{error}=await client.from(table).upsert(records);if(error)throw Error(`${table}: ${error.message}`);console.log(`${table}: ${records.length} imported/upserted`)}
console.log('Import complete. Names that differ across the directory and roster were NOT auto-merged.');
