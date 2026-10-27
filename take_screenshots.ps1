$brainDir = "C:\Users\rayhanur\.gemini\antigravity\brain\08160709-88c8-452e-99b3-31c45b64226f"
Set-Location $brainDir
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
& $edge --headless --disable-gpu --window-size=1280,900 --screenshot=landing_desktop.png "http://localhost:5000/"
& $edge --headless --disable-gpu --window-size=390,844 --screenshot=landing_mobile.png "http://localhost:5000/"
& $edge --headless --disable-gpu --window-size=1280,900 --screenshot=admin_portal.png "http://localhost:5000/sys-portal-mgt-v2"
& $edge --headless --disable-gpu --window-size=1280,900 --screenshot=admin_blocked_404.png "http://localhost:5000/admin"

Get-ChildItem -Path $brainDir -Filter "*.png" | Select-Object Name, Length
