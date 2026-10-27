$c1 = (Invoke-WebRequest -Uri 'http://localhost:5000/' -UseBasicParsing).StatusCode
$c2 = (Invoke-WebRequest -Uri 'http://localhost:5000/admin' -UseBasicParsing).StatusCode
$c3 = (Invoke-WebRequest -Uri 'http://localhost:5000/track' -UseBasicParsing).StatusCode
$c4 = (Invoke-WebRequest -Uri 'http://localhost:5000/images/hero/hero_banner_new.jpg' -UseBasicParsing).StatusCode
$c5 = (Invoke-WebRequest -Uri 'http://localhost:5000/api/orders' -UseBasicParsing).StatusCode
Write-Output "Store Front: HTTP $c1"
Write-Output "Admin Panel: HTTP $c2"
Write-Output "Tracking: HTTP $c3"
Write-Output "Local Images: HTTP $c4"
Write-Output "Orders API: HTTP $c5"
