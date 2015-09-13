select SERIAL_NUM,PASS_FAIL,to_char(PROCESS_DATE,'yyyymmddhh24mi')PROCESS_DATE,SYSTEM_ID,'silens' STEP_NAME,CYCLE_TIME from lr4_shim_assembly
where process_date > sysdate -.5 and step_name like 'TOSA SUBASSEM3%'
--and SYSTEM_ID = 'CYBOND38'




