select SERIAL_NUM,PASS_FAIL,to_char(PROCESS_DATE,'yyyymmddhh24mi')PROCESS_DATE,SYSTEM_ID,
'silens' STEP_NAME,CYCLE_TIME from los_assembly
where process_date > SYSDATE -9
-- where process_date > TO_DATE(To_Char(SYSDATE,'yyyy-mm-dd') ||' 04:10','YYYY-MM-DD HH24:MI')
-- and step_name like 'TOSA SUBASSEM3%'
and SYSTEM_ID in ('CYBOND74','CYBOND78')




