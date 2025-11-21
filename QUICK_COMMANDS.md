# Quick PowerShell Commands

## Send Single Course

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/add-course" -Method POST -ContentType "application/json" -Body '{"id": 1, "name": "Node.js Basics"}'
```

## Send Multiple Courses (50 courses)

```powershell
for ($i=1; $i -le 50; $i++) {
    Invoke-RestMethod -Uri "http://localhost:8080/add-course" -Method POST -ContentType "application/json" -Body "{`"id`": $i, `"name`": `"Course $i`"}"
    Start-Sleep -Milliseconds 5000
}
```

## Send Multiple Courses (100 courses - fast)

```powershell
for ($i=1; $i -le 100; $i++) {
    Invoke-RestMethod -Uri "http://localhost:8080/add-course" -Method POST -ContentType "application/json" -Body "{`"id`": $i, `"name`": `"Course $i`"}"
    Start-Sleep -Milliseconds 5000
}
```

## Wait 1 Second

```powershell
Start-Sleep -Seconds 1
```

## Wait 3 Seconds

```powershell
Start-Sleep -Seconds 3
```

## Wait 100 Milliseconds

```powershell
Start-Sleep -Milliseconds 100
```

## Wait 500 Milliseconds

```powershell
Start-Sleep -Milliseconds 500
```

## Get All Courses

```powershell
Invoke-RestMethod -Uri "http://localhost:8081/get-all-courses" -Method GET
```

## Check Database

```powershell
docker exec -it postgres psql -U postgres -d postgres -c "SELECT COUNT(*) FROM courses;"
```

## Monitor Consumer Logs

```powershell
docker compose logs -f student
```

## Monitor Producer Logs

```powershell
docker compose logs -f instructor
```

## Complete Test Flow

```powershell
# 1. Send 10 courses
for ($i=1; $i -le 10; $i++) {
    Invoke-RestMethod -Uri "http://localhost:8080/add-course" -Method POST -ContentType "application/json" -Body "{`"id`": $i, `"name`": `"Course $i`"}"
    Start-Sleep -Milliseconds 200
}

# 2. Wait for processing
Start-Sleep -Seconds 5

# 3. Check database
docker exec -it postgres psql -U postgres -d postgres -c "SELECT COUNT(*) FROM courses;"
```

## Notes

- Use `-Seconds` for seconds (e.g., `-Seconds 1`)
- Use `-Milliseconds` for milliseconds (e.g., `-Milliseconds 100`)
- **DO NOT** add "s" or "ms" after the number
- Correct: `Start-Sleep -Seconds 1`
- Wrong: `Start-Sleep -Seconds 1s`
- Correct: `Start-Sleep -Milliseconds 100`
- Wrong: `Start-Sleep -Milliseconds 100ms`

