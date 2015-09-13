<?php
require '../Slim/Slim.php';
include "../inc/database.php";

$app = new Slim();

$app->get('/', 'index' );
$app->get('/type/:machineName', 'csvFromTypeOfMachine' );
$app->get('/all', 'csvFromAllCyBonders' );



function index()
{
    echo "Error: solo puedes accesar el servicio con una petision. Revisa la API!";
}

function csvFromAllCyBonders()
{
    try {
        $DB = new MxOptix();
        $query = file_get_contents('sql/silens.sql');
        $DB->setQuery($query);
        $results = null;
        oci_execute($DB->statement);
        oci_fetch_all($DB->statement, $results,0,-1,OCI_FETCHSTATEMENT_BY_ROW);
        // print_r($results);
        // print_r($results);
        $ans = array2csv($results);
        file_put_contents('silens.csv', $ans);
        echo trim($ans);
        $DB->close();
    } catch (Exception $e) {
        $DB->close();
        echo ('Caught exception: '.  $e->getMessage(). "\n");
    }
}
function csvFromTypeOfMachine($machineName='')
{
    try {
        $DB = new MxOptix();
        $query = file_get_contents('sql/silens.sql');
        $DB->setQuery($query);
        $results = null;
        $DB->bind_vars(':system_id',$machineName);
        oci_execute($DB->statement);
        oci_fetch_all($DB->statement, $results,0,-1,OCI_FETCHSTATEMENT_BY_ROW);
        // print_r($results);
        // print_r($results);
        $ans = array2csv($results);
        file_put_contents('silens.csv', $ans);
        echo trim($ans);
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