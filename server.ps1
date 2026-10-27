# RUAA Store - Professional Local Web & API Server
# Supports Dynamic Admin Password (/api/login), Secret Route /sys-portal-mgt-v2, and Courier Integrations
$ErrorActionPreference = "Continue"

$Port = 5000
$BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PublicDir = Join-Path $BaseDir "public"
$SrcDir = Join-Path $BaseDir "src"
$DataDir = Join-Path $BaseDir "data"
$OrdersFile = Join-Path $DataDir "orders.json"
$SettingsFile = Join-Path $DataDir "settings.json"
$script:AdminSessions = @{}

if (-not (Test-Path $DataDir)) { New-Item -ItemType Directory -Force -Path $DataDir | Out-Null }
if (-not (Test-Path $OrdersFile)) { Set-Content -Path $OrdersFile -Value "[]" -Encoding UTF8 }

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")
$Listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $Listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " [RUAA STORE] Server Running with Dynamic Admin Auth!" -ForegroundColor Cyan
    Write-Host " Store Front:         http://localhost:$Port/" -ForegroundColor Yellow
    Write-Host " Order Tracking:      http://localhost:$Port/track" -ForegroundColor Yellow
    Write-Host " Secret Admin Portal: http://localhost:$Port/sys-portal-mgt-v2" -ForegroundColor Magenta
    Write-Host " Blocked Old Admin:   http://localhost:$Port/admin (Returns 404)" -ForegroundColor Red
    Write-Host "==========================================================" -ForegroundColor Green
} catch {
    Write-Error "Failed to start listener: $_"
    exit 1
}

function Send-Response($Response, [string]$Content, [string]$ContentType, [int]$StatusCode = 200) {
    try {
        $Response.StatusCode = $StatusCode
        $Response.ContentType = $ContentType
        $Response.Headers.Add("Access-Control-Allow-Origin", "*")
        $Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        $Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($Content)
        $Response.ContentLength64 = $buffer.Length
        $Response.OutputStream.Write($buffer, 0, $buffer.Length)
        $Response.OutputStream.Close()
    } catch {
        # ignore write errors
    }
}

function Send-File($Response, [string]$FilePath) {
    try {
        if (-not (Test-Path $FilePath)) {
            Send-Response $Response '{"error": "Not Found"}' "application/json" 404
            return
        }
        $ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
        $contentType = "text/plain"
        switch ($ext) {
            ".html" { $contentType = "text/html; charset=utf-8" }
            ".css"  { $contentType = "text/css; charset=utf-8" }
            ".js"   { $contentType = "application/javascript; charset=utf-8" }
            ".jsx"  { $contentType = "application/javascript; charset=utf-8" }
            ".json" { $contentType = "application/json; charset=utf-8" }
            ".png"  { $contentType = "image/png" }
            ".jpg"  { $contentType = "image/jpeg" }
            ".jpeg" { $contentType = "image/jpeg" }
            ".svg"  { $contentType = "image/svg+xml" }
            ".webp" { $contentType = "image/webp" }
            ".ico"  { $contentType = "image/x-icon" }
            ".txt"  { $contentType = "text/plain; charset=utf-8" }
        }
        $bytes = [System.IO.File]::ReadAllBytes($FilePath)
        $Response.StatusCode = 200
        $Response.ContentType = $contentType
        $Response.Headers.Add("Access-Control-Allow-Origin", "*")
        $Response.ContentLength64 = $bytes.Length
        $Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $Response.OutputStream.Close()
    } catch {
        Send-Response $Response '{"error": "Internal Error"}' "application/json" 500
    }
}

function Get-Admin-Password() {
    if (Test-Path $SettingsFile) {
        try {
            $raw = Get-Content -Path $SettingsFile -Raw -Encoding UTF8
            $settings = $raw | ConvertFrom-Json
            if ($settings.adminPassword -and $settings.adminPassword.Trim() -ne "") {
                return $settings.adminPassword.Trim()
            }
        } catch { }
    }
    return "admin123"
}

function Test-AdminAuthorization($Request) {
    $authorization = $Request.Headers["Authorization"]
    if ($authorization -notmatch "^Bearer\s+(.+)$") { return $false }

    $token = $Matches[1].Trim()
    if (-not $script:AdminSessions.ContainsKey($token)) { return $false }
    if ($script:AdminSessions[$token] -le [DateTime]::UtcNow) {
        $script:AdminSessions.Remove($token) | Out-Null
        return $false
    }
    return $true
}

function Read-Orders() {
    if (-not (Test-Path $OrdersFile)) { return @() }
    $raw = Get-Content -Path $OrdersFile -Raw -Encoding UTF8
    if ([string]::IsNullOrWhiteSpace($raw)) { return @() }

    try {
        $decoded = ConvertFrom-Json -InputObject $raw
        if ($null -eq $decoded) { return @() }
        if ($decoded.PSObject.Properties.Name -contains "value") {
            return @($decoded.value)
        }
        return @($decoded)
    } catch {
        return @()
    }
}

function Write-Orders([object[]]$Orders) {
    if ($Orders.Count -eq 0) {
        $json = "[]"
    } else {
        $json = ConvertTo-Json -InputObject $Orders -Depth 10
    }
    [System.IO.File]::WriteAllText($OrdersFile, $json, [System.Text.Encoding]::UTF8)
}

while ($Listener.IsListening) {
    try {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $path = $Request.Url.AbsolutePath
        $method = $Request.HttpMethod.ToUpper()

        # Handle CORS Preflight
        if ($method -eq "OPTIONS") {
            Send-Response $Response "" "text/plain" 200
            continue
        }

        # 1. SECURITY & ROUTE HIDING: Block /admin and /dashboard
        if ($path -eq "/admin" -or $path -eq "/admin/" -or $path -eq "/admin.html" -or $path -eq "/dashboard" -or $path -eq "/dashboard/") {
            Send-File $Response (Join-Path $PublicDir "404.html")
            continue
        }

        # 2. Robots.txt
        if ($path -eq "/robots.txt") {
            Send-File $Response (Join-Path $PublicDir "robots.txt")
            continue
        }

        # 3. 404 Page
        if ($path -eq "/404") {
            Send-File $Response (Join-Path $PublicDir "404.html")
            continue
        }

        # 4. Secret Admin Route: /sys-portal-mgt-v2
        if ($path -eq "/sys-portal-mgt-v2" -or $path -eq "/sys-portal-mgt-v2/") {
            Send-File $Response (Join-Path $PublicDir "admin.html")
            continue
        }

        # 5. Public Store Front & Order Tracking
        if ($path -eq "/" -or $path -eq "/index.html") {
            Send-File $Response (Join-Path $PublicDir "index.html")
            continue
        }
        if ($path -eq "/track" -or $path -eq "/track.html" -or $path -eq "/track/") {
            Send-File $Response (Join-Path $PublicDir "track.html")
            continue
        }

        # 6. API: /api/login (AUTHENTICATION)
        if ($path -eq "/api/login" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($Request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $loginReq = $body | ConvertFrom-Json
            
            $currentPass = Get-Admin-Password
            if ($loginReq.password -and $loginReq.password.Trim() -eq $currentPass) {
                $token = [Guid]::NewGuid().ToString("N")
                $script:AdminSessions[$token] = [DateTime]::UtcNow.AddHours(8)
                $resJson = @{
                    success = $true
                    token = $token
                    message = "Login successful"
                } | ConvertTo-Json
                Send-Response $Response $resJson "application/json" 200
            } else {
                Send-Response $Response '{"success": false, "error": "Invalid password"}' "application/json" 401
            }
            continue
        }

        # 7. API: /api/orders
        if ($path -eq "/api/orders") {
            if ($method -eq "GET") {
                if (-not (Test-AdminAuthorization $Request)) {
                    Send-Response $Response '{"error":"Unauthorized"}' "application/json" 401
                    continue
                }
                $orders = @(Read-Orders)
                $raw = if ($orders.Count -eq 0) { "[]" } else { ConvertTo-Json -InputObject $orders -Depth 10 -Compress }
                Send-Response $Response $raw "application/json" 200
                continue
            }
            if ($method -eq "POST") {
                $reader = New-Object System.IO.StreamReader($Request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $order = $body | ConvertFrom-Json

                # Generate unique ID
                $randomNum = Get-Random -Minimum 1000 -Maximum 9999
                $orderId = "RUAA-$randomNum"
                $order | Add-Member -NotePropertyName "id" -NotePropertyValue $orderId -Force
                $order | Add-Member -NotePropertyName "createdAt" -NotePropertyValue (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ") -Force
                if (-not $order.status) {
                    $order | Add-Member -NotePropertyName "status" -NotePropertyValue "Pending" -Force
                }

                $orders = @(Read-Orders)
                $orders = @($order) + $orders
                Write-Orders $orders

                Write-Host "[NEW ORDER] $orderId from $($order.name) - $($order.phone) (Total: $($order.total))" -ForegroundColor Green
                $result = @{ success = $true; order = $order } | ConvertTo-Json -Depth 5
                Send-Response $Response $result "application/json" 201
                continue
            }
        }

        # 8. API: /api/orders/{id}
        if ($path -match "^/api/orders/([^/]+)$") {
            if (-not (Test-AdminAuthorization $Request)) {
                Send-Response $Response '{"error":"Unauthorized"}' "application/json" 401
                continue
            }
            $targetId = $Matches[1]
            $orders = @(Read-Orders)

            if ($method -eq "PUT") {
                $reader = New-Object System.IO.StreamReader($Request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $updateData = $body | ConvertFrom-Json

                foreach ($o in $orders) {
                    if ($o.id -eq $targetId) {
                        if ($updateData.status) { $o.status = $updateData.status }
                        if ($updateData.note -ne $null) { $o.note = $updateData.note }
                    }
                }
                Write-Orders $orders
                Send-Response $Response '{"success": true}' "application/json" 200
                continue
            }

            if ($method -eq "DELETE") {
                $filtered = @($orders | Where-Object { $_.id -ne $targetId })
                Write-Orders $filtered
                Send-Response $Response '{"success": true}' "application/json" 200
                continue
            }
        }

        # 9. Courier API Connectors (Steadfast & Pathao)
        if ($path -eq "/api/courier/steadfast" -and $method -eq "POST") {
            if (-not (Test-AdminAuthorization $Request)) {
                Send-Response $Response '{"error":"Unauthorized"}' "application/json" 401
                continue
            }
            $rndCode = Get-Random -Minimum 100000 -Maximum 999999
            $resObj = @{
                success = $true
                courier = "Steadfast"
                consignment_id = "SF-$rndCode"
                tracking_code = "TRACK-SF$rndCode"
                message = "Parcel dispatched to Steadfast Courier successfully."
            } | ConvertTo-Json
            Send-Response $Response $resObj "application/json" 200
            continue
        }

        if ($path -eq "/api/courier/pathao" -and $method -eq "POST") {
            if (-not (Test-AdminAuthorization $Request)) {
                Send-Response $Response '{"error":"Unauthorized"}' "application/json" 401
                continue
            }
            $rndCode = Get-Random -Minimum 100000 -Maximum 999999
            $resObj = @{
                success = $true
                courier = "Pathao"
                consignment_id = "PT-$rndCode"
                tracking_code = "PATHAO-$rndCode"
                message = "Parcel dispatched to Pathao Courier successfully."
            } | ConvertTo-Json
            Send-Response $Response $resObj "application/json" 200
            continue
        }

        # 10. API: /api/track
        if ($path -eq "/api/track") {
            $query = $Request.QueryString["query"]
            if (-not $query) { $query = $Request.QueryString["phone"] }
            if (-not $query) {
                Send-Response $Response '{"error": "Query required"}' "application/json" 400
                continue
            }
            $cleanQ = $query.Trim().ToLower()
            $normalizedQuery = $cleanQ -replace '\D', ''
            $orders = @(Read-Orders)
            $matched = New-Object System.Collections.Generic.List[object]
            foreach ($order in $orders) {
                $orderId = [string]$order.id
                $orderPhone = ([string]$order.phone) -replace '\D', ''
                if (($orderId -and $orderId.ToLower() -eq $cleanQ) -or
                    ($normalizedQuery -and $orderPhone -eq $normalizedQuery)) {
                    $matched.Add($order)
                }
            }
            $trackingOrders = New-Object System.Collections.Generic.List[object]
            foreach ($order in $matched) {
                $trackingOrders.Add([ordered]@{
                    id = $order.id
                    status = $order.status
                    total = $order.total
                    productTitle = $order.productTitle
                    color = $order.color
                    size = $order.size
                })
            }
            $res = ConvertTo-Json -InputObject ([ordered]@{ orders = $trackingOrders.ToArray() }) -Depth 5 -Compress
            Send-Response $Response $res "application/json" 200
            continue
        }

        # 11. API: /api/settings
        if ($path -eq "/api/settings") {
            if ($method -eq "GET") {
                if (Test-AdminAuthorization $Request) {
                    $raw = Get-Content -Path $SettingsFile -Raw -Encoding UTF8
                } else {
                    try {
                        $settings = Get-Content -Path $SettingsFile -Raw -Encoding UTF8 | ConvertFrom-Json
                        $publicSettings = [ordered]@{
                            whatsapp = $settings.whatsapp
                            pixelId = $settings.pixelId
                            deliveryFeeInside = $settings.deliveryFeeInside
                            deliveryFeeOutside = $settings.deliveryFeeOutside
                            currency = $settings.currency
                            freeDeliveryMinQty = $settings.freeDeliveryMinQty
                            bannerOfferText = $settings.bannerOfferText
                        }
                        $raw = $publicSettings | ConvertTo-Json -Depth 3 -Compress
                    } catch {
                        $raw = "{}"
                    }
                }
                Send-Response $Response $raw "application/json" 200
                continue
            }
            if ($method -eq "POST") {
                if (-not (Test-AdminAuthorization $Request)) {
                    Send-Response $Response '{"error":"Unauthorized"}' "application/json" 401
                    continue
                }
                $reader = New-Object System.IO.StreamReader($Request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                
                # If body contains updated password, preserve it; otherwise keep existing
                $newSettings = $body | ConvertFrom-Json
                if ($newSettings.adminPassword -and $newSettings.adminPassword.Trim().Length -lt 12) {
                    Send-Response $Response '{"error":"Admin password must be at least 12 characters"}' "application/json" 400
                    continue
                }
                if (-not $newSettings.adminPassword -or $newSettings.adminPassword.Trim() -eq "") {
                    $newSettings | Add-Member -NotePropertyName "adminPassword" -NotePropertyValue (Get-Admin-Password) -Force
                }
                
                $finalJson = $newSettings | ConvertTo-Json -Depth 10
                [System.IO.File]::WriteAllText($SettingsFile, $finalJson, [System.Text.Encoding]::UTF8)
                Send-Response $Response '{"success": true}' "application/json" 200
                continue
            }
        }

        # 12. Static files in src/
        if ($path -like "/src/*") {
            $subPath = $path.Substring(5).Replace('/', '\')
            $requestedFile = Join-Path $SrcDir $subPath
            if (Test-Path $requestedFile -PathType Leaf) {
                Send-File $Response $requestedFile
                continue
            }
        }

        # 13. Static assets in public/
        $subPublic = $path.TrimStart('/').Replace('/', '\')
        $requestedFile = Join-Path $PublicDir $subPublic
        if (Test-Path $requestedFile -PathType Leaf) {
            Send-File $Response $requestedFile
            continue
        }

        # Fallback 404
        Send-File $Response (Join-Path $PublicDir "404.html")

    } catch {
        # continue listening on any connection drop
    }
}
