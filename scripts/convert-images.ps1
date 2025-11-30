# Simple image converter using .NET System.Drawing
Add-Type -AssemblyName System.Drawing

function Convert-TifToJpeg {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )
    
    try {
        $bitmap = New-Object System.Drawing.Bitmap($InputPath)
        $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $bitmap.Dispose()
        Write-Host "Converted: $OutputPath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Failed to convert $InputPath : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Clean up existing files
Remove-Item public\*.tif -ErrorAction SilentlyContinue
Remove-Item public\*.jpg -ErrorAction SilentlyContinue

Write-Host "Converting Phase 1 Pictures..." -ForegroundColor Yellow

# Convert all Phase 1 TIF files to JPEG
Get-ChildItem "Export Phase 1 Pictures\*.tif" | ForEach-Object {
    $inputFile = $_.FullName
    $filename = $_.Name
    # Replace spaces with hyphens and change extension
    $outputFilename = $filename -replace '\s+', '-' -replace '\.tif$', '.jpg'
    $outputPath = "public\$outputFilename"
    
    Convert-TifToJpeg -InputPath $inputFile -OutputPath $outputPath
}

Write-Host "Converting Phase 2 Pictures..." -ForegroundColor Yellow

# Convert all Phase 2 TIF files to JPEG
Get-ChildItem "Export Phase 2 Pictures\*.tif" | ForEach-Object {
    $cleanName = $_.BaseName -replace '\s+', '-'
    $outputPath = "public\$cleanName.jpg"
    Convert-TifToJpeg -InputPath $_.FullName -OutputPath $outputPath
}

Write-Host "Conversion complete!" -ForegroundColor Green
Write-Host "Files saved to public\ folder as .jpg" -ForegroundColor Green
