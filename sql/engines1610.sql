select device SERIAL_NUM, case when device_fm = 'PASS' then'P' when device_fm ='FAIL' then 'F' end PASS_FAIL,to_char(end_dt,'yyyymmddhh24mi')PROCESS_DATE, 
b.name SYSTEM_ID,a.product STEP_NAME,test_time CYCLE_TIME from dare_pkg.mtemp_qube_prod@prodmx a left join semaforo b on a.facility = b.db_id
where test_dt > SYSDATE -.5
union all 
select device SERIAL_NUM, case when device_fm = 'PASS' then'P' when device_fm ='FAIL' then 'F' end PASS_FAIL,to_char(end_dt,'yyyymmddhh24mi')PROCESS_DATE, 
b.name SYSTEM_ID,a.product STEP_NAME,test_time CYCLE_TIME from dare_pkg.mtemp_qube_stan@prodmx a left join semaforo b on a.facility = b.db_id
where test_dt > SYSDATE -.5