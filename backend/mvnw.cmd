@echo off
set "MAVEN_PROJECTBASEDIR=%~dp0."
if not defined JAVA_HOME (
  echo JAVA_HOME is not set 1>&2
  exit /b 1
)
"%JAVA_HOME%\bin\java.exe" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -cp "%~dp0.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*