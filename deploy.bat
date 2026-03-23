@echo off
echo.
echo ==========================================
echo  HealthExpress Deploy
echo ==========================================
git add .
set "timestamp=%date:~-4%-%date:~3,2%-%date:~0,2% %time:~0,5%"
git commit -m "feat: Rebuild surgery pages + hero fix + css utils [%timestamp%]"
git push origin main
echo.
echo Done. Vercel will pick this up automatically.
echo Check: https://vercel.com/health-express/healthexpress-india
pause
