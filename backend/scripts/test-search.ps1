$response = Invoke-WebRequest -Uri "http://localhost:3001/api/products?search=s&limit=10" -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Search results for 's':"
Write-Host "Total items: $($json.pagination.totalItems)"
Write-Host ""
$json.data | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.name) - $($_.category)"
}
