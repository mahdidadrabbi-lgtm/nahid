$imgDir = "C:\Users\rayhanur\.gemini\antigravity\scratch\ruaa-store\public\images"
if (-not (Test-Path $imgDir)) { New-Item -ItemType Directory -Force -Path $imgDir | Out-Null }

$imageGroups = [ordered]@{
  hero = @("hero_banner_new.jpg")
  ma = @("ma_navy.jpg", "ma_black.jpg", "ma_maroon.jpg", "ma_olive.jpg", "ma_coffee.jpg")
  classic = @("classic_black.jpg", "classic_maroon.jpg", "classic_blue.jpg", "classic_olive.jpg", "classic_coffee.jpg")
  "boro-bon" = @("boro_bon_black_new.jpg", "boro_bon_maroon_new.jpg", "boro_bon_blue_new.jpg", "boro_bon_olive_new.jpg", "boro_bon_coffee_new.jpg")
  "ma-boro-meye" = @("ma_boro_meye_blue_latest.jpg", "ma_boro_meye_black_latest.jpg", "ma_boro_meye_maroon_latest.jpg", "ma_boro_meye_olive_latest.jpg", "ma_boro_meye_coffee_latest.jpg")
  kids = @("kids_black.jpg", "kids_maroon.jpg", "kids_blue.jpg", "kids_olive.jpg")
  "choto-bon" = @("chotobon_black.jpg", "chotobon_maroon.jpg", "chotobon_blue.jpg", "chotobon_olive.jpg", "chotobon_coffee.jpg")
}

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$failures = @()
foreach ($category in $imageGroups.Keys) {
    $categoryDir = Join-Path $imgDir $category
    if (-not (Test-Path $categoryDir)) { New-Item -ItemType Directory -Force -Path $categoryDir | Out-Null }

    foreach ($img in $imageGroups[$category]) {
        $targetPath = Join-Path $categoryDir $img
        $downloadPath = "$targetPath.download"
        $sourceUrl = "https://ruaa-store.vercel.app/$img"
        try {
            $bytes = $wc.DownloadData($sourceUrl)
            $expectedType = if ([System.IO.Path]::GetExtension($img) -eq ".png") { "image/png" } else { "image/jpeg" }
            $signature = [BitConverter]::ToString($bytes, 0, [Math]::Min(8, $bytes.Length))
            if ($expectedType -eq "image/png" -and $signature -notlike "89-50-4E-47-0D-0A-1A-0A*") {
                throw "Downloaded file does not have a PNG signature"
            }
            if ($expectedType -eq "image/jpeg" -and $signature -notlike "FF-D8-FF*") {
                throw "Downloaded file does not have a JPEG signature"
            }

            [System.IO.File]::WriteAllBytes($downloadPath, $bytes)
            Move-Item -LiteralPath $downloadPath -Destination $targetPath -Force
            Write-Output "Downloaded: $category/$img"
        } catch {
            $failures += "$category/$img - $($_.Exception.Message)"
            Write-Error "Failed: $category/$img - $($_.Exception.Message)"
        } finally {
            if (Test-Path $downloadPath) { Remove-Item -LiteralPath $downloadPath -Force }
        }
    }
}

if ($failures.Count -gt 0) {
    throw "$($failures.Count) image(s) could not be downloaded and verified."
}

Write-Output "All images downloaded and verified in category folders!"
