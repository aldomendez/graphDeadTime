select SERIAL_NUM,PASS_FAIL,to_char(PROCESS_DATE,'yyyymmddhh24mi')PROCESS_DATE,SYSTEM_ID,'silens' STEP_NAME,CYCLE_TIME from lr4_shim_assembly
-- where process_date between to_date('201509120630','yyyymmddhh24mi') and to_date('201509121830','yyyymmddhh24mi')
-- and step_name like 'TOSA SUBASSEM3%'
where process_date > sysdate -.5 and step_name like 'TOSA SUBASSEM3%'
-- and SYSTEM_ID in ('CYBOND14','CYBOND38')




