export type Group='weekdayDay'|'weekdayNight'|'weekendDay'|'weekendNight';
export const GROUPS: {key:Group;label:string;period:'weekday'|'weekend';shift:'day'|'night'}[]=[
 {key:'weekdayDay',label:'Weekdays · Day Shift',period:'weekday',shift:'day'},
 {key:'weekdayNight',label:'Weekdays · Night Shift',period:'weekday',shift:'night'},
 {key:'weekendDay',label:'Weekend · Day Shift',period:'weekend',shift:'day'},
 {key:'weekendNight',label:'Weekend · Night Shift',period:'weekend',shift:'night'}];
export type Staff={id:string;name:string;role:string;employment_type:string;notes:string;created_at?:string};
export type Shift={id:string;staff_id:string|null;name:string;shift_group:Group;start_time:string;end_time:string;notes:string;created_at?:string};
export type Building={id:string;title:string;category:string;location:string;contact:string;details:string;notes:string};
export type Issue={id:string;title:string;location:string;surface:string;attempts:string;outcome:string;status:string;notes:string;photo_url?:string|null};
export type TableName='staff'|'roster_assignments'|'building_information'|'cleaning_issues';
export type RecordData={staff:Staff[];roster_assignments:Shift[];building_information:Building[];cleaning_issues:Issue[]};
export type Role='supervisor'|'staff';
