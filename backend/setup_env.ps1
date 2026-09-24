Write-Host "Removing old broken virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Remove-Item -Recurse -Force venv
}

Write-Host "Hunting down your Python 3.12 installation..." -ForegroundColor Yellow
$pythonExe = $null

# Strategy 1: Use the official Python Launcher
try {
    $pythonExe = & py -3.12 -c "import sys; print(sys.executable)" 2>$null
} catch {}

# Strategy 2: Check standard 'python' in PATH if Strategy 1 fails
if ([string]::IsNullOrWhiteSpace($pythonExe)) {
    try {
        $possibleExe = & python -c "import sys; print(sys.executable)" 2>$null
        if ($possibleExe -match "312" -or $possibleExe -match "3.12") {
            $pythonExe = $possibleExe
        }
    } catch {}
}

# Strategy 3: Search C:\ drive broadly as a last resort
if ([string]::IsNullOrWhiteSpace($pythonExe)) {
    $pythonExe = Get-ChildItem -Path "C:\Users\$env:USERNAME\AppData", "C:\Program Files", "C:\Program Files (x86)" -Filter "python.exe" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch "anaconda" -and $_.FullName -notmatch ".gemini" -and ($_.FullName -match "312" -or $_.FullName -match "3\.12") } | Select-Object -ExpandProperty FullName -First 1
}

$pythonExe = $pythonExe -replace "`r", "" -replace "`n", ""

if ([string]::IsNullOrWhiteSpace($pythonExe)) {
    Write-Host "Could not find Python 3.12 on your computer. Please reinstall it!" -ForegroundColor Red
} else {
    Write-Host "Found Python 3.12 at: $pythonExe" -ForegroundColor Green
    & $pythonExe -m venv venv
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Virtual environment created successfully!" -ForegroundColor Green
        
        Write-Host "Installing requirements..." -ForegroundColor Yellow
        & .\venv\Scripts\pip.exe install -r requirements.txt
        
        Write-Host "To activate your environment for future commands, run:" -ForegroundColor Yellow
        Write-Host ".\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
    } else {
        Write-Host "Failed to create virtual environment." -ForegroundColor Red
    }
}
