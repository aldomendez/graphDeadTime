select SERIAL_NUM,PASS_FAIL,to_char(PROCESS_DATE,'yyyymmddhh24mi')PROCESS_DATE,SYSTEM_ID,'silens' STEP_NAME,CYCLE_TIME from lr4_shim_assembly
-- where process_date > SYSDATE -1
where process_date > TO_DATE(To_Char(SYSDATE,'yyyy-mm-dd') ||' 06:30','YYYY-MM-DD HH24:MI')
and step_name like 'TOSA SUBASSEM3%'
--and SYSTEM_ID in ('CYBOND46','CYBOND48','CYBOND67','CYBOND68')




