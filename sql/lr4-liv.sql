select SERIAL_NUM,PASS_FAIL,to_char(PROCESS_DATE,'yyyymmddhh24mi')PROCESS_DATE,SYSTEM_ID,


--case when step_name = 'PRE-PURGE' then SYSTEM_ID||'pre' else SYSTEM_ID||'post' end SYSTEM_ID,
 

 STEP_NAME,round((completion_date - process_date)*24*60*60, 2) cycle_time from process_execution
-- where process_date between to_date('201509241615','yyyymmddhh24mi') and to_date('201509251454','yyyymmddhh24mi')
-- and step_name like 'TOSA SUBASSEM3%'
where process_date > sysdate -1
 --and step_name like 'TOSA SUBASSEM3%'

-- and SYSTEM_ID in ('CYTEST1202')
and SYSTEM_ID in ('CYTEST701','CYTEST702','CYTEST1201','CYTEST1202')

