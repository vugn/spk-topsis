<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== SPK TOPSIS Application Test ===\n\n";

// Test 1: Check if data exists
echo "1. Checking database data...\n";
$alternatives = App\Models\Alternative::count();
$criteria = App\Models\Criterion::count();
$evaluations = App\Models\Evaluation::count();

echo "   - Alternatives: $alternatives\n";
echo "   - Criteria: $criteria\n";
echo "   - Evaluations: $evaluations\n";

// Test 2: Test TOPSIS calculation
echo "\n2. Testing TOPSIS calculation...\n";
try {
    $service = new App\Services\TopsisService();
    $results = $service->calculateTopsis();
    echo "   ✓ TOPSIS calculation successful!\n";
    echo "   - Number of results: " . count($results) . "\n";

    $savedResults = $service->getResults();
    echo "   - Results saved to database: " . $savedResults->count() . "\n";

    if ($savedResults->count() > 0) {
        $best = $savedResults->first();
        echo "   - Best alternative: " . $best->alternative->name . " (Score: " . number_format($best->preference_score, 4) . ")\n";
    }
} catch (Exception $e) {
    echo "   ✗ TOPSIS calculation failed: " . $e->getMessage() . "\n";
}

// Test 3: Check routes
echo "\n3. Checking important routes...\n";
$routes = [
    'dashboard',
    'alternatives.index',
    'criteria.index',
    'evaluations.index',
    'topsis.index'
];

foreach ($routes as $route) {
    try {
        $url = route($route);
        echo "   ✓ Route '$route': $url\n";
    } catch (Exception $e) {
        echo "   ✗ Route '$route': Error - " . $e->getMessage() . "\n";
    }
}

echo "\n=== Test completed ===\n";
echo "Application is ready to use at: http://127.0.0.1:8000\n";
echo "Login or register to start using the SPK TOPSIS system.\n";
