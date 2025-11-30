$response = Invoke-RestMethod "http://localhost:3001/api/products?search=s&limit=10"
Write-Host "Total results: $($response.data.Count)"
Write-Host "`nFirst 10 results:"
$response.data | ForEach-Object { Write-Host "  - $($_.name)" }
