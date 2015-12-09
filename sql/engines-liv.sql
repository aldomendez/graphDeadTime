  select device SERIAL_NUM, case when device_fm = 'PASS' then'P' when device_fm ='FAIL' then 'F' end PASS_FAIL,to_char(end_dt,'yyyymmddhh24mi')PROCESS_DATE, 
facility SYSTEM_ID,product STEP_NAME,test_time CYCLE_TIME from DARE_PKG.MTEMP_QUBE_PROD@prodmx
where test_dt between 
      to_date('2015-10-01 10:00','yyyy-mm-dd hh24:mi') and to_date('2015-10-01 14:00','yyyy-mm-dd hh24:mi') and facility in ('1018EN00')
union all
select device SERIAL_NUM, case when device_fm = 'PASS' then'P' when device_fm ='FAIL' then 'F' end PASS_FAIL,to_char(end_dt,'yyyymmddhh24mi')PROCESS_DATE, 
facility SYSTEM_ID,product STEP_NAME,test_time CYCLE_TIME from DARE_PKG.MTEMP_QUBE_stan@prodmx
where test_dt between 
      to_date('2015-10-01 10:00','yyyy-mm-dd hh24:mi') and to_date('2015-10-01 14:00','yyyy-mm-dd hh24:mi') and facility in ('1018EN00')