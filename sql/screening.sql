select device SERIAL_NUM,device_fm PASS_FAIL, to_char(end_dt,'yyyymmddhh24mi')PROCESS_DATE, facility SYSTEM_ID,operation STEP_NAME,TEST_TIME CYCLE_TIME 
-- from pgt.dtl_deflector_assy
from pkg.screen_test_rosa
where end_dt > sysdate -(4/24) and product = 'LR4-ROSA'
-- where end_dt between to_date('201509130630','yyyymmddhh24mi') and to_date('201509150600','yyyymmddhh24mi')
union all
select device SERIAL_NUM,device_fm PASS_FAIL, to_char(end_dt,'yyyymmddhh24mi')PROCESS_DATE, facility SYSTEM_ID,operation STEP_NAME,TEST_TIME CYCLE_TIME 
-- from pgt.dtl_deflector_assy
from pkg.screen_test
where end_dt > sysdate -(4/24) and product = 'LR4-TOSA'
-- where end_dt between to_date('201509130630','yyyymmddhh24mi') and to_date('201509150600','yyyymmddhh24mi')
