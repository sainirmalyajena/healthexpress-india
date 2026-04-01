@echo off
echo.
echo ==========================================
echo  HealthExpress Deploy
echo ==========================================
git add .
set "timestamp=%date:~-4%-%date:~3,2%-%date:~0,2% %time:~0,5%"
git commit -m "feat: Upgrade MedBot + AI lead classification + remove framer-motion [%timestamp%]"
git push origin main
npx vercel --prod
echo.
echo Done!
pause
