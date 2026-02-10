@echo off
rem Lightweight mvnw.cmd that delegates to installed Maven
setlocal
if defined MAVEN_HOME (
  "%MAVEN_HOME%\bin\mvn" %*
  exit /b %ERRORLEVEL%
)
where mvn >nul 2>nul
if %ERRORLEVEL%==0 (
  mvn %*
  exit /b %ERRORLEVEL%
)
rem fallback to known Maven path
"C:\Maven\apache-maven-3.8.8\bin\mvn.cmd" %*
exit /b %ERRORLEVEL%
