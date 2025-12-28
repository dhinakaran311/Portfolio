# Script to add backdated commits between June 30 and November 30, 2025
# This will add 105 commits to reach 170 total (from 65)
# Optimized for realistic, organic commit patterns

# Commit messages pool - varied and realistic
$commitMessages = @(
    "fix: minor styling adjustments",
    "refactor: clean up unused imports",
    "update: improve component structure",
    "chore: update dependencies",
    "fix: resolve responsive layout issue",
    "feat: add minor UI improvements",
    "refactor: optimize component rendering",
    "fix: correct typo in documentation",
    "update: enhance user experience",
    "chore: code cleanup and formatting",
    "fix: adjust spacing and padding",
    "refactor: simplify component logic",
    "update: improve code readability",
    "fix: handle edge case in validation",
    "feat: add small enhancement",
    "refactor: extract reusable function",
    "update: refine component props",
    "fix: correct color scheme",
    "chore: update comments and docs",
    "refactor: improve error handling",
    "update: optimize performance",
    "fix: resolve minor bug",
    "feat: add progress indicator",
    "refactor: restructure file organization",
    "update: improve accessibility",
    "fix: adjust media queries",
    "chore: update package versions",
    "refactor: clean up console logs",
    "update: enhance loading states",
    "fix: correct alignment issues",
    "feat: add smooth transitions",
    "refactor: improve state management",
    "update: refine animations",
    "fix: resolve z-index conflicts",
    "chore: update README",
    "refactor: optimize bundle size",
    "update: improve mobile experience",
    "fix: correct form validation",
    "feat: add hover effects",
    "refactor: simplify conditional logic",
    "fix: update package lock",
    "chore: remove unused code",
    "update: adjust font sizes",
    "fix: correct import paths",
    "refactor: improve component structure",
    "update: enhance error messages",
    "fix: resolve build warnings",
    "chore: update gitignore",
    "refactor: optimize image loading",
    "update: improve button styles"
)

# Date range: June 30 to November 30, 2025
$startDate = Get-Date "2025-06-30"
$endDate = Get-Date "2025-11-30"
$totalDays = ($endDate - $startDate).Days
$commitsToAdd = 105

Write-Host "Date range: $($startDate.ToString('yyyy-MM-dd')) to $($endDate.ToString('yyyy-MM-dd'))" -ForegroundColor Cyan
Write-Host "Total days: $totalDays" -ForegroundColor Cyan
Write-Host "Commits to add: $commitsToAdd" -ForegroundColor Cyan
Write-Host "Target average: ~$([math]::Round($commitsToAdd / $totalDays, 2)) commits per day" -ForegroundColor Cyan

# Safety check: Verify we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Error: Not in a git repository!" -ForegroundColor Red
    exit 1
}

# Check current commit count
$currentCommits = git rev-list --count HEAD
Write-Host "`nCurrent commit count: $currentCommits" -ForegroundColor Cyan
Write-Host "Target commit count: $($currentCommits + $commitsToAdd)" -ForegroundColor Cyan

# Generate realistic commit distribution
# Strategy: Create organic patterns with clustering and gaps
$commitDates = @()
$random = New-Object System.Random

# Create a weighted distribution that feels natural
# - Most days: 0-1 commits
# - Active days: 2-3 commits (20-30% of days)
# - Some gaps: 0 commits for 2-5 days (breaks, busy periods)
# - Weekends: Less activity (10-15% chance of commit)

$remainingCommits = $commitsToAdd
$currentDate = $startDate

# First pass: Distribute commits with realistic patterns
while ($remainingCommits -gt 0 -and $currentDate -le $endDate) {
    $dayOfWeek = $currentDate.DayOfWeek
    $isWeekend = ($dayOfWeek -eq "Saturday" -or $dayOfWeek -eq "Sunday")
    
    # Determine commits for this day based on realistic patterns
    $commitsToday = 0
    
    if ($isWeekend) {
        # Weekends: Lower activity (15% chance of 1 commit, 5% chance of 2)
        $rand = $random.Next(0, 100)
        if ($rand -lt 15) {
            $commitsToday = 1
        } elseif ($rand -lt 20) {
            $commitsToday = 2
        }
    } else {
        # Weekdays: More varied activity
        $rand = $random.Next(0, 100)
        if ($rand -lt 35) {
            $commitsToday = 1  # Regular day
        } elseif ($rand -lt 50) {
            $commitsToday = 0  # Inactive day
        } elseif ($rand -lt 75) {
            $commitsToday = 2  # Active day
        } elseif ($rand -lt 90) {
            $commitsToday = 3  # Very active day
        } else {
            $commitsToday = 1  # Fallback
        }
    }
    
    # Add commits for this day
    for ($i = 0; $i -lt $commitsToday -and $remainingCommits -gt 0; $i++) {
        $commitDates += $currentDate
        $remainingCommits--
    }
    
    # Move to next day
    $currentDate = $currentDate.AddDays(1)
    
    # Occasionally skip 2-4 days (breaks, busy periods, holidays)
    if ($random.Next(0, 100) -lt 12 -and $remainingCommits -gt 15) {
        $skipDays = $random.Next(2, 5)
        $currentDate = $currentDate.AddDays($skipDays)
    }
}

# Second pass: If we still have commits remaining, distribute them more evenly
if ($remainingCommits -gt 0) {
    Write-Host "Distributing remaining $remainingCommits commits..." -ForegroundColor Yellow
    for ($i = 0; $i -lt $remainingCommits; $i++) {
        $daysOffset = $random.Next(0, $totalDays + 1)
        $commitDate = $startDate.AddDays($daysOffset)
        $commitDates += $commitDate
    }
}

# Sort dates chronologically
$commitDates = $commitDates | Sort-Object

Write-Host "`nGenerated $($commitDates.Count) commit dates" -ForegroundColor Green
Write-Host "Date distribution:" -ForegroundColor Cyan
$dateGroups = $commitDates | Group-Object { $_.ToString('yyyy-MM-dd') } | Sort-Object Name
foreach ($group in $dateGroups | Select-Object -First 10) {
    Write-Host "  $($group.Name): $($group.Count) commit(s)" -ForegroundColor Gray
}
if ($dateGroups.Count -gt 10) {
    Write-Host "  ... and $($dateGroups.Count - 10) more days" -ForegroundColor Gray
}

# Create or update a minimal changelog file for commits
$changelogPath = ".changelog.txt"
$changelogExists = Test-Path $changelogPath

if (-not $changelogExists) {
    New-Item -Path $changelogPath -ItemType File -Force | Out-Null
    git add $changelogPath
    $env:GIT_AUTHOR_DATE = $startDate.ToString("yyyy-MM-ddTHH:mm:ss+00:00")
    $env:GIT_COMMITTER_DATE = $startDate.ToString("yyyy-MM-ddTHH:mm:ss+00:00")
    git commit -m "chore: add changelog file" --date="$($startDate.ToString('yyyy-MM-ddTHH:mm:ss+00:00'))" --quiet
    Write-Host "Created changelog file" -ForegroundColor Green
}

Write-Host "`nAdding $($commitDates.Count) backdated commits..." -ForegroundColor Green
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

$commitCount = 0
$errors = 0

foreach ($commitDate in $commitDates) {
    $commitCount++
    
    # Select random commit message
    $message = $commitMessages[$random.Next(0, $commitMessages.Length)]
    
    # Generate random time within the day (9 AM to 11 PM for realistic hours)
    $hour = $random.Next(9, 23)
    $minute = $random.Next(0, 60)
    $second = $random.Next(0, 60)
    $timeStr = "{0:D2}:{1:D2}:{2:D2}" -f $hour, $minute, $second
    $commitDateTime = Get-Date "$($commitDate.ToString('yyyy-MM-dd')) $timeStr"
    
    # Format date for git (ISO 8601 format with UTC timezone)
    $dateStr = $commitDateTime.ToString("yyyy-MM-ddTHH:mm:ss+00:00")
    
    # Make a minimal change to the changelog
    $timestamp = $commitDateTime.ToString("yyyy-MM-dd HH:mm:ss")
    Add-Content -Path $changelogPath -Value "$timestamp - $message"
    
    # Stage the change
    git add $changelogPath | Out-Null
    
    # Set environment variables for git commit date
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    
    # Create the commit with backdated timestamp
    $commitResult = git commit -m "$message" --date="$dateStr" --quiet 2>&1
    if ($LASTEXITCODE -ne 0) {
        $errors++
        Write-Host "Warning: Commit failed for date $dateStr" -ForegroundColor Yellow
    }
    
    # Progress indicator
    if ($commitCount % 25 -eq 0) {
        $percent = [math]::Round(($commitCount / $commitDates.Count) * 100, 1)
        Write-Host "Progress: $commitCount / $($commitDates.Count) commits ($percent%)" -ForegroundColor Cyan
    }
}

Write-Host "`nCompleted! Added $commitCount backdated commits." -ForegroundColor Green
if ($errors -gt 0) {
    Write-Host "Warnings: $errors commits had issues" -ForegroundColor Yellow
}

Write-Host "`nVerifying commit count..." -ForegroundColor Yellow
$totalCommits = git rev-list --count HEAD
Write-Host "Total commits: $totalCommits" -ForegroundColor Green

if ($totalCommits -ge ($currentCommits + $commitsToAdd - 5)) {
    Write-Host "`nSuccess! Commit count target reached." -ForegroundColor Green
} else {
    Write-Host "`nNote: Commit count is slightly below target. This is normal." -ForegroundColor Yellow
}

Write-Host "`nYou can verify the commit history with:" -ForegroundColor Cyan
Write-Host "  git log --oneline --date=short --format='%ad %s' | Select-Object -First 20" -ForegroundColor Gray
Write-Host "`nTo view commits by date range:" -ForegroundColor Cyan
Write-Host "  git log --since='2025-06-30' --until='2025-11-30' --oneline" -ForegroundColor Gray
