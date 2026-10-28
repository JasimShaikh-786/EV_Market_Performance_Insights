@echo off
echo ========================================================
echo  Pushing EV Market Performance & Insights to GitHub
echo ========================================================
echo.
echo Make sure you have created the empty repo at:
echo https://github.com/new
echo Repo name: EV_Market_Performance_Insights
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo [OK] Successfully pushed to https://github.com/JasimShaikh-786/EV_Market_Performance_Insights
) else (
    echo [ERROR] Push failed. Please verify that the repository exists on GitHub.
)
pause
