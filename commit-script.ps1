$ErrorActionPreference = "Stop"

$files = git ls-files --others --modified --exclude-standard
if ($files -is [string]) { $files = @($files) }
if (-not $files) {
    Write-Host "No files to commit"
    exit
}

$startDate = Get-Date -Year 2026 -Month 4 -Day 22 -Hour 10 -Minute 0 -Second 0
$numFiles = $files.Count
$shuffledFiles = $files | Sort-Object { Get-Random }

$commitMessages = @(
    "feat: update components",
    "fix: adjust layout issues",
    "chore: update dependencies",
    "feat: add new assets",
    "refactor: improve code structure",
    "style: format code",
    "feat: implement new features",
    "fix: resolve issues",
    "docs: update documentation",
    "perf: optimize assets",
    "feat: enhance user interface",
    "fix: minor bug fixes",
    "chore: configuration updates"
)

$fileIndex = 0

# 13 days (0 to 12) from April 22 to May 4
for ($d = 0; $d -le 12; $d++) {
    $currentDay = $startDate.AddDays($d)
    $commitsToday = Get-Random -Minimum 1 -Maximum 4
    
    for ($c = 0; $c -lt $commitsToday; $c++) {
        if ($fileIndex -ge $numFiles) { break }
        
        $filesToCommit = Get-Random -Minimum 1 -Maximum 4
        $filesForThisCommit = @()
        for ($i = 0; $i -lt $filesToCommit; $i++) {
            if ($fileIndex -lt $numFiles) {
                $filesForThisCommit += $shuffledFiles[$fileIndex]
                $fileIndex++
            }
        }
        
        if ($filesForThisCommit.Count -gt 0) {
            foreach ($f in $filesForThisCommit) {
                # Provide string correctly without nested quotes breaking
                git add $f
            }
            $msg = $commitMessages | Get-Random
            $timeOffsetHours = Get-Random -Minimum 8 -Maximum 22
            $timeOffsetMins = Get-Random -Minimum 0 -Maximum 59
            $commitDate = $currentDay.Date.AddHours($timeOffsetHours).AddMinutes($timeOffsetMins).ToString("yyyy-MM-ddTHH:mm:ss")
            $env:GIT_COMMITTER_DATE = $commitDate
            git commit -m "$msg" --date=$commitDate | Out-Null
            Write-Host "Committed $($filesForThisCommit.Count) files on $commitDate"
        }
    }
}

# Any leftover files
while ($fileIndex -lt $numFiles) {
    $filesToCommit = Get-Random -Minimum 1 -Maximum 4
    $filesForThisCommit = @()
    for ($i = 0; $i -lt $filesToCommit; $i++) {
        if ($fileIndex -lt $numFiles) {
            $filesForThisCommit += $shuffledFiles[$fileIndex]
            $fileIndex++
        }
    }
    if ($filesForThisCommit.Count -gt 0) {
        foreach ($f in $filesForThisCommit) {
            git add $f
        }
        $msg = $commitMessages | Get-Random
        $timeOffsetHours = Get-Random -Minimum 8 -Maximum 22
        $timeOffsetMins = Get-Random -Minimum 0 -Maximum 59
        $commitDate = $startDate.AddDays(12).Date.AddHours($timeOffsetHours).AddMinutes($timeOffsetMins).ToString("yyyy-MM-ddTHH:mm:ss")
        $env:GIT_COMMITTER_DATE = $commitDate
        git commit -m "$msg" --date=$commitDate | Out-Null
        Write-Host "Committed $($filesForThisCommit.Count) files on $commitDate"
    }
}

if (Test-Path env:\GIT_COMMITTER_DATE) {
    Remove-Item env:\GIT_COMMITTER_DATE
}
Write-Host "All files successfully committed with faked history!"
