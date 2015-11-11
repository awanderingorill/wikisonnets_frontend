<?php
// Set your return content type
header('Content-type: application/xml');

// Website url to open
$url = 'http://feeds.feedburner.com/jQueryHowto';

// Get that website's content
$handle = fopen($url, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>