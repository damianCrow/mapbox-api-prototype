<?php  

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

	require 'vendor/autoload.php';
	use GuzzleHttp\Client;

	$client = new Client();
	$resultsArray = [];

	$response = $client->request('GET', 'https://api.twitter.com/1.1/search/tweets.json?q=%23FormulaE&count=100',
			['headers' => ['Authorization' => 'Bearer AAAAAAAAAAAAAAAAAAAAACuS0wAAAAAA2s5TNT5STESnlAzvW8P8OdEf0Vw%3DgHl0L5VI1kbDEgALJbRuBPPG49mKI4c2PkrXf5nc7Pm7XKT7ZM']
	]);

	$responseObj = json_decode($response->getBody()) -> statuses;

	foreach($responseObj as $key => $value) {

		if(isset($value) && $value -> user -> location !== '' || null) {

			$response2 = $client->request('GET', 'http://maps.googleapis.com/maps/api/geocode/json?address='. urlencode($value -> user -> location) .'&sensor=false');
		
			if($response2->getStatusCode() === 200 && json_decode($response2->getBody()) -> results[0] -> geometry -> location !== null) {

				$propsObj = json_decode($response2->getBody()) -> results[0] -> geometry -> location;
				$propsObj -> text = $value -> text;

				array_push($resultsArray, $propsObj);
			}
		}
	}

	print_r(json_encode($resultsArray));
?>