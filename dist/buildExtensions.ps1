Import-Module -Name ($PSScriptRoot + "\Invoke-MsBuild.psm1")
Invoke-MsBuild -Path ($PSScriptRoot + "\..\src\Extensions\Extensions.csproj") -MsBuildParameters "/t:Build /p:Configuration=Release"
Copy-Item -Path ($PSScriptRoot + "\..\src\Extensions\bin\Release\Extensions.dll") -Destination $PSScriptRoot