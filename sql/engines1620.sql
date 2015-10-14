select device SERIAL_NUM, case when device_fm = 'PASS' then'P' when device_fm ='FAIL' then 'F' end PASS_FAIL,to_char(end_dt,'yyyymmddhh24mi')PROCESS_DATE, 
facility SYSTEM_ID,product STEP_NAME,test_time CYCLE_TIME from dare_pkg.eml10gb_prod@prodmx
where test_dt > SYSDATE -.5
union all
select device SERIAL_NUM, case when device_fm = 'PASS' then'P' when device_fm ='FAIL' then 'F' end PASS_FAIL,to_char(end_dt,'yyyymmddhh24mi')PROCESS_DATE, 
facility SYSTEM_ID,product STEP_NAME,test_time CYCLE_TIME from dare_pkg.eml10gb_stan@prodmx
where test_dt > SYSDATE -.5