import {describe,it,expect} from 'vitest';
import {shiftMinutes,totalMinutes} from './utils';
describe('roster totals',()=>{it('counts paid breaks as part of shift',()=>expect(shiftMinutes({start_time:'07:00',end_time:'15:00'})).toBe(480));it('handles overnight',()=>expect(shiftMinutes({start_time:'22:00',end_time:'06:00'})).toBe(480));it('adds shifts',()=>expect(totalMinutes([{start_time:'07:00',end_time:'15:00'},{start_time:'12:00',end_time:'16:00'}])).toBe(720));it('returns zero for missing times',()=>expect(shiftMinutes({start_time:'',end_time:''})).toBe(0));});
