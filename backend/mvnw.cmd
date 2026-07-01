@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM   JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM   MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM   MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM ----------------------------------------------------------------------------

@IF "%MAVEN_BATCH_ECHO%"=="on" echo %MAVEN_BATCH_ECHO%

@REM Set env vars to control wrapper behavior
SET MAVEN_PROJECTBASEDIR=%~dp0
IF NOT "%MAVEN_BASEDIR%"=="" SET MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%

SET WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties
SET WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar

SET DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar

@REM Download the wrapper jar if it doesn't exist
IF NOT EXIST "%WRAPPER_JAR%" (
    echo Downloading Maven Wrapper...
    powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%WRAPPER_JAR%'"
    IF ERRORLEVEL 1 (
        echo ERROR: Failed to download Maven Wrapper. Check your internet connection.
        exit /b 1
    )
)

@REM Resolve JAVA_HOME
IF DEFINED JAVA_HOME (
    SET JAVA_EXECUTABLE=%JAVA_HOME%\bin\java.exe
) ELSE (
    FOR /f "tokens=*" %%i IN ('where java 2^>nul') DO SET JAVA_EXECUTABLE=%%i
)

IF NOT EXIST "%JAVA_EXECUTABLE%" (
    echo ERROR: JAVA_HOME is not set and java was not found on PATH. Java 21+ is required.
    exit /b 1
)

"%JAVA_EXECUTABLE%" %MAVEN_OPTS% -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
