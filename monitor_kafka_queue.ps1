# Real-time Kafka Queue Monitoring Script

Write-Host "=== Real-time Kafka Queue Monitor ===" -ForegroundColor Green
Write-Host ""

Write-Host "This script displays:" -ForegroundColor Cyan
Write-Host "  1. Last logs from Student (Consumer)" -ForegroundColor White
Write-Host "  2. Last logs from Instructor (Producer)" -ForegroundColor White
Write-Host "  3. Course count in database" -ForegroundColor White
Write-Host ""

Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

$iteration = 0

while ($true) {
    $iteration++
    Clear-Host
    
    Write-Host "=== Kafka Queue Monitor - Iteration $iteration ===" -ForegroundColor Green
    Write-Host "Time: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Student (Consumer) - Last 5 logs:" -ForegroundColor Yellow
    Write-Host "-----------------------------------" -ForegroundColor Gray
    docker compose logs --tail=5 student 2>$null
    Write-Host ""
    
    Write-Host "Instructor (Producer) - Last 3 logs:" -ForegroundColor Yellow
    Write-Host "-----------------------------------" -ForegroundColor Gray
    docker compose logs --tail=3 instructor 2>$null
    Write-Host ""
    
    Write-Host "Database - Course Count:" -ForegroundColor Yellow
    Write-Host "-----------------------------------" -ForegroundColor Gray
    try {
        $count = docker exec postgres psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM courses;" 2>$null
        $count = $count.Trim()
        Write-Host "Total Courses: $count" -ForegroundColor Cyan
    }
    catch {
        Write-Host "Could not get count" -ForegroundColor Red
    }
    Write-Host ""
    
    Write-Host "-----------------------------------" -ForegroundColor Gray
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    
    Start-Sleep -Seconds 2
}

