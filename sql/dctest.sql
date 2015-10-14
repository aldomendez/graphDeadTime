  select SERIAL_NUM,PASS_FAIL,to_char(PROCESS_DATE,'yyyymmddhh24mi')PROCESS_DATE,SYSTEM_ID,'silens' STEP_NAME,round((completion_date - process_date) * 24 * 60 * 60,2) CYCLE_TIME  from PROCESS_EXECUTION
 where process_date > SYSDATE -1
 -- and system_id = 'BR-PMQPSK-DCMT3'
and system_id in ('BR-PMQPSK-DCMT1','BR-PMQPSK-DCMT2','BR-PMQPSK-DCMT3','PMQPSKRFTESTSET1','PMQPSKHD1','PMQPSKHD2')
 and completion_date is not null