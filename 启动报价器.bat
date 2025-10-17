@echo off
chcp 65001 >nul
title 装修项目报价器

echo ========================================
echo           装修项目报价器
echo ========================================
echo.
echo 正在启动报价器...
echo.

REM 检查是否存在可执行文件
if exist "报价器.exe" (
    echo 找到可执行文件，正在启动...
    start "" "报价器.exe"
    echo.
    echo 报价器已启动！
    echo 请在浏览器中访问: http://localhost:3000
    echo.
    echo 按任意键关闭此窗口...
    pause >nul
) else (
    echo 错误：未找到 报价器.exe 文件！
    echo 请确保可执行文件在当前目录中。
    echo.
    echo 按任意键关闭此窗口...
    pause >nul
)
