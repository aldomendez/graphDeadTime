<?php
require '../Slim/Slim.php';
include "../inc/database.php";

$app = new Slim();

$app->get('/', 'index' );
$app->get('/cache/:file', 'backup' );
$app->get('/mxoptix/:area', 'query_to_mxoptix' );
$app->get('/pgt/:area', 'query_to_PGT' );
$app->get('/mxapps/:area', 'query_to_MxApps' );



function backup($file='')
{
    $file = $file . '.csv';
    if (file_exists($file)) {
        echo file_get_contents($file);
    }else{
        echo "file not exists";
    }
}

function index()
{
    echo "Error: solo puedes accesar el servicio con una peticion. Revisa la API!";
}

function query_to_mxoptix($area){
    if( $area != '' ){
        queryAndReturnCSV_Ans('MxOptix', $area);
    }
}
function query_to_PGT($area){
    if( $area != '' ){
        queryAndReturnCSV_Ans('PGT', $area);
    }
}
function query_to_MxApps($area){
    if( $area != '' ){
        queryAndReturnCSV_Ans('MxApps', $area);
    }
}

function queryAndReturnCSV_Ans($connection, $area)
{
    try {
        $DB = new $connection();
        $query = file_get_contents('sql/' . $area .'.sql');
        $DB->setQuery($query);
        $results = null;
        oci_execute($DB->statement);
        oci_fetch_all($DB->statement, $results,0,-1,OCI_FETCHSTATEMENT_BY_ROW);
        $ans = trim(array2csv($results));
        file_put_contents($area . '.csv', $ans);
        echo $ans;
        $DB->close();
    } catch (Exception $e) {
        $DB->close();
        echo ('Caught exception: '.  $e->getMessage(). "\n");
    }
}
function csvFromTypeOfMachine($machineName='')
{
    try {
        $DB = new PGT();
        $query = file_get_contents('sql/deflector.sql');
        $DB->setQuery($query);
        $results = null;
        // $DB->bind_vars(':system_id',$machineName);
        oci_execute($DB->statement);
        oci_fetch_all($DB->statement, $results,0,-1,OCI_FETCHSTATEMENT_BY_ROW);
        $ans = trim(array2csv($results));
        file_put_contents('deflector.csv', $ans);
        echo $ans;
        $DB->close();
    } catch (Exception $e) {
        $DB->close();
        echo ('Caught exception: '.  $e->getMessage(). "\n");
    }
}
function example(){
    try {
        
        $DB = new MxOptix();
        global $app;
        $body = $app->request()->getBody();
        $body = json_decode($body, true);
        // print_r($body);
        $DB->setQuery($body['query']);
        $results = null;
        oci_execute($DB->statement);
        oci_fetch_all($DB->statement, $results,0,-1,OCI_FETCHSTATEMENT_BY_ROW);
        // print_r($results);
        // print_r($results);
        echo array2csv($results);
        $DB->close();
    } catch (Exception $e) {
        $DB->close();
        echo ('Caught exception: '.  $e->getMessage(). "\n");
    }
}
function array2csv($array) {
    $ans = '';
    $start = true;
    $head = array();
    foreach($array as $key => $value) {
        if ($start) {
            foreach ($value as $key2 => $value2) {
                array_push($head, $key2);
            }
            $ans .= implode(",", $head) . PHP_EOL;
            $start = false;
        }
        $ans .= implode(',', $value) . PHP_EOL;
    }
    return $ans;
}

$app->run();