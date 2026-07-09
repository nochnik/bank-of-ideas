$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"

Get-Content "$PSScriptRoot\.env" | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), 'Process')
    }
}

$java   = "$env:JAVA_HOME\bin\java.exe"
$jar    = "$PSScriptRoot\.mvn\wrapper\maven-wrapper.jar"
$projDir = $PSScriptRoot

& $java -cp $jar "-Dmaven.multiModuleProjectDirectory=$projDir" org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
