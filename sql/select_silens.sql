SELECT serial_num, pass_fail, To_Char(process_date, 'yyyymmddhh24mi')process_date, system_id, step_name, cycle_time FROM lr4_shim_assembly
WHERE process_date BETWEEN To_Date('201508220630','yyyymmddhh24mi') AND To_Date('201508221830','yyyymmddhh24mi')
AND step_name LIKE 'TOSA SUBASSEM3%'