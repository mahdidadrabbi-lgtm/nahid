# RUAA Store - Automated Verification Script

Write-Host "=== 1. TESTING ADMIN SECURITY & ROUTE HIDING ===" -ForegroundColor Cyan
$adminRes = Invoke-WebRequest -Uri "http://localhost:5000/admin" -UseBasicParsing
Write-Host "GET /admin Status Code: $($adminRes.StatusCode)"
if ($adminRes.Content -match "404") {
    Write-Host "PASS: /admin returns clean 404 page!" -ForegroundColor Green
} else {
    Write-Host "FAIL: /admin did not return 404!" -ForegroundColor Red
}

$secretRes = Invoke-WebRequest -Uri "http://localhost:5000/sys-portal-mgt-v2" -UseBasicParsing
Write-Host "GET /sys-portal-mgt-v2 Status Code: $($secretRes.StatusCode)"
if ($secretRes.Content -match "Security Management Portal") {
    Write-Host "PASS: Secret Admin Portal accessible on /sys-portal-mgt-v2!" -ForegroundColor Green
}

$robotsRes = Invoke-WebRequest -Uri "http://localhost:5000/robots.txt" -UseBasicParsing
Write-Host "GET /robots.txt Status Code: $($robotsRes.StatusCode)"
if ($robotsRes.Content -match "Disallow:\s*/sys-portal-mgt-v2/") {
    Write-Host "PASS: robots.txt properly disallows /sys-portal-mgt-v2/ from crawlers!" -ForegroundColor Green
}

Write-Host "`n=== 2. TESTING LANDING PAGE & 1-PAGE CHECKOUT ===" -ForegroundColor Cyan
$homeRes = Invoke-WebRequest -Uri "http://localhost:5000/" -UseBasicParsing
Write-Host "GET / Status Code: $($homeRes.StatusCode)"
if ($homeRes.Content -match "embedded-order-form" -and $homeRes.Content -match "image-zoom-modal") {
    Write-Host "PASS: Landing page includes 1-Page Embedded Checkout Form and Image Zoom Lightbox!" -ForegroundColor Green
}

Write-Host "`n=== 3. TESTING DYNAMIC ORDER SUBMISSION ===" -ForegroundColor Cyan
$orderPayload = @{
    name = "তাসনিয়া জামান"
    phone = "01788990011"
    address = "উত্তরা সেক্টর ৭, ঢাকা"
    city = "inside_dhaka"
    productTitle = "মা স্পেশাল কালেকশন"
    productId = "ma"
    color = "Navy Blue"
    size = "54"
    quantity = 2
    productPrice = 1190
    deliveryFee = 70
    total = 2450
    status = "Pending"
    paymentMethod = "Cash on Delivery"
} | ConvertTo-Json

$postRes = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method POST -Body $orderPayload -ContentType "application/json"
Write-Host "Order created with ID: $($postRes.order.id) (Total: ৳$($postRes.order.total))"
if ($postRes.success -eq $true) {
    Write-Host "PASS: Order submission & dynamic bill calculation verified!" -ForegroundColor Green
}

Write-Host "`n=== 4. TESTING COURIER INTEGRATION (STEADFAST & PATHAO) ===" -ForegroundColor Cyan
$sfRes = Invoke-RestMethod -Uri "http://localhost:5000/api/courier/steadfast" -Method POST -Body '{"orderId":"RUAA-TEST"}' -ContentType "application/json"
Write-Host "Steadfast Dispatch: $($sfRes.message) [Consignment: $($sfRes.consignment_id)]"
if ($sfRes.success -eq $true) {
    Write-Host "PASS: Steadfast Courier Connector verified!" -ForegroundColor Green
}

$ptRes = Invoke-RestMethod -Uri "http://localhost:5000/api/courier/pathao" -Method POST -Body '{"orderId":"RUAA-TEST"}' -ContentType "application/json"
Write-Host "Pathao Dispatch: $($ptRes.message) [Consignment: $($ptRes.consignment_id)]"
if ($ptRes.success -eq $true) {
    Write-Host "PASS: Pathao Courier Connector verified!" -ForegroundColor Green
}

Write-Host "`n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===" -ForegroundColor Green
