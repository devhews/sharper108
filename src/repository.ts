import {supabase} from './supabase';
import type {RecordData,TableName} from './types';
export const QUERY_KEY=['australia108','records'];
export async function fetchRecords():Promise<RecordData>{const client=supabase;if(!client)throw Error('Database not configured');const tables:TableName[]=['staff','roster_assignments','building_information','cleaning_issues'];const results=await Promise.all(tables.map(t=>client.from(t).select('*').order('created_at',{ascending:true})));for(const result of results)if(result.error)throw result.error;return Object.fromEntries(tables.map((t,i)=>[t,results[i].data??[]])) as RecordData;}
export async function upsertRecord(table:TableName,record:Record<string,unknown>){if(!supabase)throw Error('Database not configured');const {error}=await supabase.from(table).upsert(record);if(error)throw error;}
export async function removeRecord(table:TableName,id:string){if(!supabase)throw Error('Database not configured');const {error}=await supabase.from(table).delete().eq('id',id);if(error)throw error;}
