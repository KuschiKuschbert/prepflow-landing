(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/webapp/temperature/components/SynchronizedChart.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const SynchronizedChart = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s((param)=>{
    let { logs, equipment, formatDateString, formatTime, getTypeIcon } = param;
    var _logs_;
    _s();
    const chartScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const xAxisScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Calculate chart dimensions and data
    const chartWidth = Math.max(800, logs.length * 12);
    const uniqueDates = [
        ...new Set(logs.map((l)=>l.log_date))
    ].sort();
    const dayCount = uniqueDates.length;
    const dayWidth = chartWidth / dayCount;
    // Calculate temperature range
    const temps = logs.map((log)=>log.temperature_celsius);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const tempRange = maxTemp - minTemp;
    const padding = tempRange * 0.1;
    const chartMinTemp = minTemp - padding;
    const chartMaxTemp = maxTemp + padding;
    const chartTempRange = chartMaxTemp - chartMinTemp;
    // Synchronize scrolling between chart and x-axis
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SynchronizedChart.useEffect": ()=>{
            const chartScroll = chartScrollRef.current;
            const xAxisScroll = xAxisScrollRef.current;
            if (!chartScroll || !xAxisScroll) return;
            let isSyncing = false;
            const syncScroll = {
                "SynchronizedChart.useEffect.syncScroll": (source, target)=>{
                    if (!isSyncing) {
                        isSyncing = true;
                        target.scrollLeft = source.scrollLeft;
                        // Use requestAnimationFrame to ensure the sync happens after the scroll
                        requestAnimationFrame({
                            "SynchronizedChart.useEffect.syncScroll": ()=>{
                                isSyncing = false;
                            }
                        }["SynchronizedChart.useEffect.syncScroll"]);
                    }
                }
            }["SynchronizedChart.useEffect.syncScroll"];
            const handleChartScroll = {
                "SynchronizedChart.useEffect.handleChartScroll": ()=>{
                    syncScroll(chartScroll, xAxisScroll);
                }
            }["SynchronizedChart.useEffect.handleChartScroll"];
            const handleXAxisScroll = {
                "SynchronizedChart.useEffect.handleXAxisScroll": ()=>{
                    syncScroll(xAxisScroll, chartScroll);
                }
            }["SynchronizedChart.useEffect.handleXAxisScroll"];
            chartScroll.addEventListener('scroll', handleChartScroll, {
                passive: true
            });
            xAxisScroll.addEventListener('scroll', handleXAxisScroll, {
                passive: true
            });
            return ({
                "SynchronizedChart.useEffect": ()=>{
                    chartScroll.removeEventListener('scroll', handleChartScroll);
                    xAxisScroll.removeEventListener('scroll', handleXAxisScroll);
                }
            })["SynchronizedChart.useEffect"];
        }
    }["SynchronizedChart.useEffect"], []);
    // Generate Y-axis scale steps
    const scaleSteps = 5;
    const stepSize = (chartMaxTemp - chartMinTemp) / (scaleSteps - 1);
    const yAxisLabels = Array.from({
        length: scaleSteps
    }, (_, i)=>{
        const temp = chartMaxTemp - i * stepSize;
        return temp.toFixed(1);
    });
    if (logs.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#0a0a0a] p-6 rounded-2xl border border-[#2a2a2a] flex items-center justify-center h-64",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-4xl mb-2",
                        children: "📊"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400",
                        children: "No temperature data available"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
            lineNumber: 101,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#0a0a0a] p-6 rounded-2xl border border-[#2a2a2a] relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-14 h-14 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl",
                                    children: getTypeIcon(equipment.equipment_type)
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-semibold text-white",
                                        children: equipment.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400",
                                        children: "Temperature Trend"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-6 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-[#29E7CD]",
                                        children: [
                                            ((_logs_ = logs[0]) === null || _logs_ === void 0 ? void 0 : _logs_.temperature_celsius) || '--',
                                            "°C"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 127,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: "Latest"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-lg font-semibold text-white",
                                        children: [
                                            (temps.reduce((sum, t)=>sum + t, 0) / temps.length).toFixed(1),
                                            "°C"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: "Average"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-lg font-semibold text-white",
                                        children: logs.length
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: "Readings"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative bg-[#111111] rounded-xl overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-64",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0 w-16 flex flex-col justify-between py-2.5 px-2 bg-[#111111] border-r border-[#2a2a2a] z-10",
                                children: yAxisLabels.map((label, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400 text-right",
                                        children: [
                                            label,
                                            "°C"
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 151,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: chartScrollRef,
                                className: "flex-1 overflow-x-auto",
                                style: {
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#4a5568 #1a202c'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: "".concat(chartWidth, "px"),
                                        height: '100%'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: chartWidth,
                                        height: "256",
                                        className: "w-full h-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                                                    id: "grid-".concat(equipment.id),
                                                    width: "40",
                                                    height: "40",
                                                    patternUnits: "userSpaceOnUse",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M 40 0 L 0 0 0 40",
                                                        fill: "none",
                                                        stroke: "#2a2a2a",
                                                        strokeWidth: "0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                lineNumber: 169,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                width: "100%",
                                                height: "100%",
                                                fill: "url(#grid-".concat(equipment.id, ")")
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                lineNumber: 174,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            equipment.min_temp_celsius && equipment.max_temp_celsius && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: (chartMaxTemp - equipment.max_temp_celsius) / chartTempRange * 240 + 8,
                                                width: "100%",
                                                height: (equipment.max_temp_celsius - equipment.min_temp_celsius) / chartTempRange * 240,
                                                fill: "#29E7CD",
                                                opacity: "0.1"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                lineNumber: 178,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            equipment.min_temp_celsius && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "0",
                                                y1: 248 - (equipment.min_temp_celsius - chartMinTemp) / chartTempRange * 240,
                                                x2: chartWidth,
                                                y2: 248 - (equipment.min_temp_celsius - chartMinTemp) / chartTempRange * 240,
                                                stroke: "#29E7CD",
                                                strokeWidth: "2",
                                                strokeDasharray: "5,5",
                                                opacity: "0.7"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                lineNumber: 190,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            equipment.max_temp_celsius && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "0",
                                                y1: 248 - (equipment.max_temp_celsius - chartMinTemp) / chartTempRange * 240,
                                                x2: chartWidth,
                                                y2: 248 - (equipment.max_temp_celsius - chartMinTemp) / chartTempRange * 240,
                                                stroke: "#29E7CD",
                                                strokeWidth: "2",
                                                strokeDasharray: "5,5",
                                                opacity: "0.7"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                lineNumber: 203,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fill: "none",
                                                stroke: "#29E7CD",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: (()=>{
                                                    const points = logs.map((log)=>{
                                                        // Calculate time-based X position
                                                        const timeParts = log.log_time.split(':');
                                                        const hours = parseInt(timeParts[0]);
                                                        const minutes = parseInt(timeParts[1]);
                                                        const timeOfDay = (hours * 60 + minutes) / (24 * 60);
                                                        const dateIndex = uniqueDates.indexOf(log.log_date);
                                                        const dayStartX = dateIndex * dayWidth + 10;
                                                        const timeOffsetX = timeOfDay * (dayWidth - 20);
                                                        const x = dayStartX + timeOffsetX;
                                                        const y = 248 - (log.temperature_celsius - chartMinTemp) / chartTempRange * 240;
                                                        return "".concat(x, ",").concat(y);
                                                    });
                                                    if (points.length < 2) return '';
                                                    // Create smooth curve
                                                    let path = "M ".concat(points[0]);
                                                    for(let i = 1; i < points.length; i++){
                                                        const [x1, y1] = points[i - 1].split(',').map(Number);
                                                        const [x2, y2] = points[i].split(',').map(Number);
                                                        const cp1x = x1 + (x2 - x1) * 0.5;
                                                        const cp1y = y1;
                                                        const cp2x = x2 - (x2 - x1) * 0.5;
                                                        const cp2y = y2;
                                                        path += " C ".concat(cp1x, ",").concat(cp1y, " ").concat(cp2x, ",").concat(cp2y, " ").concat(x2, ",").concat(y2);
                                                    }
                                                    return path;
                                                })()
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                lineNumber: 216,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            logs.map((log, index)=>{
                                                const timeParts = log.log_time.split(':');
                                                const hours = parseInt(timeParts[0]);
                                                const minutes = parseInt(timeParts[1]);
                                                const timeOfDay = (hours * 60 + minutes) / (24 * 60);
                                                const dateIndex = uniqueDates.indexOf(log.log_date);
                                                const dayStartX = dateIndex * dayWidth + 10;
                                                const timeOffsetX = timeOfDay * (dayWidth - 20);
                                                const x = dayStartX + timeOffsetX;
                                                const y = 248 - (log.temperature_celsius - chartMinTemp) / chartTempRange * 240;
                                                const isInRange = equipment.min_temp_celsius && equipment.max_temp_celsius ? log.temperature_celsius >= equipment.min_temp_celsius && log.temperature_celsius <= equipment.max_temp_celsius : true;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: x,
                                                            cy: y,
                                                            r: "4",
                                                            fill: isInRange ? "#29E7CD" : "#ef4444",
                                                            stroke: "white",
                                                            strokeWidth: "2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                            lineNumber: 275,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                                                            children: [
                                                                formatDateString(log.log_date),
                                                                " ",
                                                                formatTime(log.log_time),
                                                                " - ",
                                                                log.temperature_celsius,
                                                                "°C"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                            lineNumber: 283,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, log.id, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0));
                                            }),
                                            uniqueDates.slice(1).map((date, index)=>{
                                                const x = (index + 1) * dayWidth;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: x,
                                                    y1: "8",
                                                    x2: x,
                                                    y2: "248",
                                                    stroke: "#29E7CD",
                                                    strokeWidth: "1",
                                                    opacity: "0.3"
                                                }, date, false, {
                                                    fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0 w-16 flex flex-col justify-between py-2.5 px-2 bg-[#111111] border-l border-[#2a2a2a] z-10",
                                children: yAxisLabels.map((label, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400 text-left",
                                        children: [
                                            label,
                                            "°C"
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 313,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 311,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex border-t border-[#2a2a2a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 flex-shrink-0 bg-[#111111]"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 322,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: xAxisScrollRef,
                                className: "flex-1 overflow-x-auto",
                                style: {
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#4a5568 #1a202c'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: "".concat(chartWidth, "px")
                                    },
                                    className: "px-2 py-2 bg-[#111111]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex",
                                        children: uniqueDates.map((date, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center flex-shrink-0",
                                                style: {
                                                    width: "".concat(dayWidth, "px")
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs font-medium text-white",
                                                    children: formatDateString(date)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                    lineNumber: 339,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, date, false, {
                                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                                lineNumber: 334,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 332,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                    lineNumber: 331,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 323,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 flex-shrink-0 bg-[#111111]"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 347,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                        lineNumber: 321,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-4 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-3 h-3 rounded-full bg-[#29E7CD]"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-300",
                                        children: "In Range"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 356,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-3 h-3 rounded-full bg-red-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 359,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-300",
                                        children: "Out of Range"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                        lineNumber: 360,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                        lineNumber: 353,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    equipment.min_temp_celsius && equipment.max_temp_celsius && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-400",
                        children: [
                            "Safe Range: ",
                            equipment.min_temp_celsius,
                            "°C - ",
                            equipment.max_temp_celsius,
                            "°C"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                        lineNumber: 364,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
                lineNumber: 352,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/webapp/temperature/components/SynchronizedChart.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "60xV0FMrjE5wWOgXMBaWDLs3hLE=")), "60xV0FMrjE5wWOgXMBaWDLs3hLE=");
_c1 = SynchronizedChart;
SynchronizedChart.displayName = 'SynchronizedChart';
const __TURBOPACK__default__export__ = SynchronizedChart;
var _c, _c1;
__turbopack_context__.k.register(_c, "SynchronizedChart$memo");
__turbopack_context__.k.register(_c1, "SynchronizedChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/webapp/temperature/components/SynchronizedChart.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/webapp/temperature/components/SynchronizedChart.tsx [app-client] (ecmascript)"));
}),
}]);

//# sourceMappingURL=app_webapp_temperature_components_SynchronizedChart_tsx_b150c667._.js.map