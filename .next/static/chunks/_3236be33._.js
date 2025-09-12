(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/OptimizedImage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OptimizedImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
;
function OptimizedImage(param) {
    let { src, alt, width, height, priority = false, className = '', sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw', quality = 85 } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        src: src,
        alt: alt,
        width: width,
        height: height,
        priority: priority,
        className: className,
        sizes: sizes,
        quality: quality,
        placeholder: "blur",
        blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    }, void 0, false, {
        fileName: "[project]/components/OptimizedImage.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = OptimizedImage;
var _c;
__turbopack_context__.k.register(_c, "OptimizedImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TemperatureLogsTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OptimizedImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/OptimizedImage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCountryFormatting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useCountryFormatting.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const temperatureTypes = [
    {
        value: 'fridge',
        label: 'Fridge',
        icon: '🧊'
    },
    {
        value: 'freezer',
        label: 'Freezer',
        icon: '❄️'
    },
    {
        value: 'food_cooking',
        label: 'Food Cooking',
        icon: '🔥'
    },
    {
        value: 'food_hot_holding',
        label: 'Food Hot Holding',
        icon: '🍲'
    },
    {
        value: 'food_cold_holding',
        label: 'Food Cold Holding',
        icon: '🥗'
    },
    {
        value: 'storage',
        label: 'Storage',
        icon: '📦'
    }
];
function TemperatureLogsTab(param) {
    let { logs, equipment, selectedDate, setSelectedDate, selectedType, setSelectedType, showAddLog, setShowAddLog, newLog, setNewLog, onAddLog, onRefreshLogs } = param;
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const { formatDate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCountryFormatting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCountryFormatting"])();
    // Helper functions
    const formatTime = (timeString)=>{
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        return "".concat(hours, ":").concat(minutes);
    };
    const formatDateString = (dateString)=>{
        if (!dateString) return '';
        const date = new Date(dateString);
        return formatDate(date);
    };
    const getTemperatureStatus = (temp, location)=>{
        const equipmentItem = equipment.find((e)=>e.name === location);
        if (!equipmentItem || !equipmentItem.is_active) return 'normal';
        if (equipmentItem.min_temp_celsius && temp < equipmentItem.min_temp_celsius) return 'low';
        if (equipmentItem.max_temp_celsius && temp > equipmentItem.max_temp_celsius) return 'high';
        return 'normal';
    };
    const getFoodSafetyStatus = (temp, logTime, logDate, type)=>{
        if (type !== 'food_cooking' && type !== 'food_hot_holding' && type !== 'food_cold_holding') {
            return null;
        }
        if (temp < 5 || temp > 60) {
            return {
                status: 'safe',
                message: 'Outside danger zone',
                color: 'text-green-400',
                icon: '✅'
            };
        }
        const logDateTime = new Date("".concat(logDate, "T").concat(logTime));
        const now = new Date();
        const hoursInDangerZone = (now.getTime() - logDateTime.getTime()) / (1000 * 60 * 60);
        if (hoursInDangerZone < 2) {
            return {
                status: 'safe',
                message: "".concat((2 - hoursInDangerZone).toFixed(1), "h remaining - can refrigerate"),
                color: 'text-green-400',
                icon: '✅'
            };
        } else if (hoursInDangerZone < 4) {
            return {
                status: 'warning',
                message: "".concat((4 - hoursInDangerZone).toFixed(1), "h remaining - use immediately"),
                color: 'text-yellow-400',
                icon: '⚠️'
            };
        } else {
            return {
                status: 'danger',
                message: "".concat(hoursInDangerZone.toFixed(1), "h in danger zone - DISCARD"),
                color: 'text-red-400',
                icon: '🚨'
            };
        }
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'high':
                return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'low':
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default:
                return 'text-green-400 bg-green-400/10 border-green-400/20';
        }
    };
    const getTypeIcon = (type)=>{
        const typeInfo = temperatureTypes.find((t)=>t.value === type);
        return (typeInfo === null || typeInfo === void 0 ? void 0 : typeInfo.icon) || '🌡️';
    };
    const getTypeLabel = (type)=>{
        const typeInfo = temperatureTypes.find((t)=>t.value === type);
        return (typeInfo === null || typeInfo === void 0 ? void 0 : typeInfo.label) || type;
    };
    const getTimePeriod = (time)=>{
        const hour = parseInt(time.split(':')[0]);
        if (hour >= 5 && hour < 9) return {
            period: 'morning',
            label: '🌅 Morning (5:00-8:59)',
            icon: '🌅'
        };
        if (hour >= 9 && hour < 12) return {
            period: 'late-morning',
            label: '☀️ Late Morning (9:00-11:59)',
            icon: '☀️'
        };
        if (hour >= 12 && hour < 14) return {
            period: 'midday',
            label: '🌞 Midday (12:00-13:59)',
            icon: '🌞'
        };
        if (hour >= 14 && hour < 17) return {
            period: 'afternoon',
            label: '🌤️ Afternoon (14:00-16:59)',
            icon: '🌤️'
        };
        if (hour >= 17 && hour < 20) return {
            period: 'dinner',
            label: '🌆 Dinner Prep (17:00-19:59)',
            icon: '🌆'
        };
        if (hour >= 20 && hour < 22) return {
            period: 'evening',
            label: '🌙 Evening (20:00-21:59)',
            icon: '🌙'
        };
        return {
            period: 'night',
            label: '🌚 Night (22:00-4:59)',
            icon: '🌚'
        };
    };
    const groupLogsByTimePeriod = (logs)=>{
        const grouped = logs.reduce((acc, log)=>{
            const timePeriod = getTimePeriod(log.log_time);
            if (!acc[timePeriod.period]) {
                acc[timePeriod.period] = {
                    period: timePeriod.period,
                    label: timePeriod.label,
                    icon: timePeriod.icon,
                    logs: []
                };
            }
            acc[timePeriod.period].logs.push(log);
            return acc;
        }, {});
        const periodOrder = [
            'morning',
            'late-morning',
            'midday',
            'afternoon',
            'dinner',
            'evening',
            'night'
        ];
        return periodOrder.filter((period)=>grouped[period]).map((period)=>grouped[period]).map((group)=>({
                ...group,
                logs: group.logs.sort((a, b)=>a.log_time.localeCompare(b.log_time))
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.filterDate', 'Filter by Date')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 170,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    const currentDate = new Date(selectedDate);
                                                    currentDate.setDate(currentDate.getDate() - 1);
                                                    setSelectedDate(currentDate.toISOString().split('T')[0]);
                                                },
                                                className: "bg-[#2a2a2a] text-white px-3 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center justify-center",
                                                title: "Previous day",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg",
                                                    children: "←"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 172,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: selectedDate,
                                                onChange: (e)=>setSelectedDate(e.target.value),
                                                className: "px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 183,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    const currentDate = new Date(selectedDate);
                                                    currentDate.setDate(currentDate.getDate() + 1);
                                                    setSelectedDate(currentDate.toISOString().split('T')[0]);
                                                },
                                                className: "bg-[#2a2a2a] text-white px-3 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center justify-center",
                                                title: "Next day",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg",
                                                    children: "→"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 189,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setSelectedDate(new Date().toISOString().split('T')[0]);
                                                },
                                                className: "bg-[#29E7CD]/10 text-[#29E7CD] px-3 py-2 rounded-xl hover:bg-[#29E7CD]/20 transition-all duration-200 text-sm font-medium",
                                                title: "Go to today",
                                                children: "Today"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 200,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 171,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.filterEquipment', 'Filter by Equipment')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedType,
                                        onChange: (e)=>setSelectedType(e.target.value),
                                        className: "px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: t('temperature.allEquipment', 'All Equipment')
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 218,
                                                columnNumber: 15
                                            }, this),
                                            equipment.filter((eq)=>eq.is_active).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: item.equipment_type,
                                                    children: [
                                                        getTypeIcon(item.equipment_type),
                                                        " ",
                                                        item.name
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 17
                                                }, this)),
                                            temperatureTypes.filter((type)=>type.value === 'food_cooking' || type.value === 'food_hot_holding' || type.value === 'food_cold_holding').map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: type.value,
                                                    children: [
                                                        type.icon,
                                                        " ",
                                                        type.label
                                                    ]
                                                }, type.value, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowAddLog(true),
                        className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200",
                        children: [
                            "➕ ",
                            t('temperature.addLog', 'Add Temperature Log')
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            showAddLog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-semibold text-white mb-2",
                        children: t('temperature.addNewLog', 'Add New Temperature Log')
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-400 mb-4",
                        children: "💡 You can log multiple temperatures per day for the same equipment (e.g., morning and evening checks). There's a 5-minute cooling off period between entries for the same equipment."
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 p-4 bg-blue-400/10 border border-blue-400/20 rounded-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-blue-400 mb-2",
                                children: "🍽️ Queensland 2-Hour/4-Hour Rule"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 254,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-300 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "• ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-green-400",
                                                children: "0-2 hours"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 256,
                                                columnNumber: 20
                                            }, this),
                                            " in danger zone (5°C-60°C): Can refrigerate for later use"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "• ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-yellow-400",
                                                children: "2-4 hours"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 257,
                                                columnNumber: 20
                                            }, this),
                                            " in danger zone: Must use immediately"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 257,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "• ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-400",
                                                children: "4+ hours"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 258,
                                                columnNumber: 20
                                            }, this),
                                            " in danger zone: Must discard"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 255,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                        lineNumber: 253,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: onAddLog,
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.date', 'Date')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 263,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: newLog.log_date,
                                        onChange: (e)=>setNewLog({
                                                ...newLog,
                                                log_date: e.target.value
                                            }),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 262,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.time', 'Time')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "time",
                                        value: newLog.log_time,
                                        onChange: (e)=>setNewLog({
                                                ...newLog,
                                                log_time: e.target.value
                                            }),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.equipment', 'Equipment')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: newLog.temperature_type,
                                        onChange: (e)=>{
                                            const selectedEquipment = equipment.find((eq)=>eq.equipment_type === e.target.value);
                                            setNewLog({
                                                ...newLog,
                                                temperature_type: e.target.value,
                                                location: (selectedEquipment === null || selectedEquipment === void 0 ? void 0 : selectedEquipment.name) || ''
                                            });
                                        },
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: t('temperature.selectEquipment', 'Select Equipment')
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 297,
                                                columnNumber: 17
                                            }, this),
                                            equipment.filter((eq)=>eq.is_active).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: item.equipment_type,
                                                    children: [
                                                        getTypeIcon(item.equipment_type),
                                                        " ",
                                                        item.name,
                                                        " (",
                                                        getTypeLabel(item.equipment_type),
                                                        ")"
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                    lineNumber: 300,
                                                    columnNumber: 19
                                                }, this)),
                                            temperatureTypes.filter((type)=>type.value === 'food_cooking' || type.value === 'food_hot_holding' || type.value === 'food_cold_holding').map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: type.value,
                                                    children: [
                                                        type.icon,
                                                        " ",
                                                        type.label,
                                                        " (Food Safety)"
                                                    ]
                                                }, type.value, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                    lineNumber: 310,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 282,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.temperature', 'Temperature (°C)')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.1",
                                        value: newLog.temperature_celsius,
                                        onChange: (e)=>setNewLog({
                                                ...newLog,
                                                temperature_celsius: e.target.value
                                            }),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "e.g., 3.5",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 318,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 316,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: [
                                            'food_cooking',
                                            'food_hot_holding',
                                            'food_cold_holding'
                                        ].includes(newLog.temperature_type) ? t('temperature.foodItem', 'Food Item') : t('temperature.location', 'Location')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 329,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: newLog.location,
                                        onChange: (e)=>setNewLog({
                                                ...newLog,
                                                location: e.target.value
                                            }),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: [
                                            'food_cooking',
                                            'food_hot_holding',
                                            'food_cold_holding'
                                        ].includes(newLog.temperature_type) ? 'e.g., Chicken Curry, Soup Station 1, Salad Bar' : 'e.g., Main Fridge, Freezer 1',
                                        required: [
                                            'food_cooking',
                                            'food_hot_holding',
                                            'food_cold_holding'
                                        ].includes(newLog.temperature_type)
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 335,
                                        columnNumber: 15
                                    }, this),
                                    [
                                        'food_cooking',
                                        'food_hot_holding',
                                        'food_cold_holding'
                                    ].includes(newLog.temperature_type) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-400 mt-1",
                                        children: "💡 Specify the exact food item for proper 2-hour/4-hour rule tracking"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 348,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 328,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.loggedBy', 'Logged By')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 354,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: newLog.logged_by,
                                        onChange: (e)=>setNewLog({
                                                ...newLog,
                                                logged_by: e.target.value
                                            }),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "Staff member name"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 355,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 353,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.notes', 'Notes')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 364,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: newLog.notes,
                                        onChange: (e)=>setNewLog({
                                                ...newLog,
                                                notes: e.target.value
                                            }),
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        placeholder: "Additional notes or observations",
                                        rows: 3
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 365,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 363,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2 flex space-x-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "bg-[#29E7CD] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200",
                                        children: t('temperature.save', 'Save Log')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 374,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShowAddLog(false),
                                        className: "bg-[#2a2a2a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200",
                                        children: t('temperature.cancel', 'Cancel')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 380,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                        lineNumber: 261,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                lineNumber: 248,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: logs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-20 h-20 rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center mx-auto mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-4xl",
                                children: "🌡️"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 397,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                            lineNumber: 396,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold text-white mb-2",
                            children: t('temperature.noLogs', 'No Temperature Logs')
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                            lineNumber: 399,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: t('temperature.noLogsDesc', 'Start logging temperatures to ensure food safety compliance')
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                            lineNumber: 400,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                    lineNumber: 395,
                    columnNumber: 11
                }, this) : groupLogsByTimePeriod(logs).map((timeGroup)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl",
                                            children: timeGroup.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                            lineNumber: 408,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 407,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-white",
                                                children: timeGroup.label
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 411,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400",
                                                children: [
                                                    timeGroup.logs.length,
                                                    " temperature reading",
                                                    timeGroup.logs.length !== 1 ? 's' : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 412,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 410,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 406,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: timeGroup.logs.map((log)=>{
                                    const status = getTemperatureStatus(log.temperature_celsius, log.location || '');
                                    const foodSafety = getFoodSafetyStatus(log.temperature_celsius, log.log_time, log.log_date, log.temperature_type);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-lg",
                                                                    children: getTypeIcon(log.temperature_type)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                    lineNumber: 426,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                lineNumber: 425,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-lg font-semibold text-white",
                                                                        children: log.location || getTypeLabel(log.temperature_type)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                        lineNumber: 429,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center space-x-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm text-gray-400",
                                                                                children: log.log_time
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                                lineNumber: 431,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-gray-500",
                                                                                children: "•"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                                lineNumber: 432,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-gray-500",
                                                                                children: getTypeLabel(log.temperature_type)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                                lineNumber: 433,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                        lineNumber: 430,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                lineNumber: 428,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                        lineNumber: 424,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-1 rounded-full text-xs font-medium border ".concat(getStatusColor(status)),
                                                                children: status === 'high' ? '⚠️ High' : status === 'low' ? '⚠️ Low' : '✅ Normal'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                lineNumber: 438,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xl font-bold text-[#29E7CD]",
                                                                children: [
                                                                    log.temperature_celsius,
                                                                    "°C"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                lineNumber: 441,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                        lineNumber: 437,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 423,
                                                columnNumber: 23
                                            }, this),
                                            log.location && log.location !== getTypeLabel(log.temperature_type) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-300 text-sm mb-2",
                                                children: [
                                                    "📍 ",
                                                    log.location
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 448,
                                                columnNumber: 25
                                            }, this),
                                            log.logged_by && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400 mb-2",
                                                children: [
                                                    "👤 ",
                                                    t('temperature.loggedBy', 'Logged by'),
                                                    ": ",
                                                    log.logged_by
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 452,
                                                columnNumber: 25
                                            }, this),
                                            log.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-300 text-sm mb-3",
                                                children: log.notes
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 456,
                                                columnNumber: 25
                                            }, this),
                                            foodSafety && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-3 p-3 rounded-xl border ".concat(foodSafety.color.replace('text-', 'bg-').replace('-400', '-400/10'), " border-").concat(foodSafety.color.replace('text-', '').replace('-400', '-400/20')),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg",
                                                            children: foodSafety.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium ".concat(foodSafety.color),
                                                                    children: "Queensland 2-Hour/4-Hour Rule"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                    lineNumber: 465,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs ".concat(foodSafety.color),
                                                                    children: foodSafety.message
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                    lineNumber: 468,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                            lineNumber: 464,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 461,
                                                columnNumber: 25
                                            }, this),
                                            log.photo_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OptimizedImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: log.photo_url,
                                                    alt: "Temperature reading",
                                                    width: 96,
                                                    height: 96,
                                                    className: "w-24 h-24 object-cover rounded-xl border border-[#2a2a2a]"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                    lineNumber: 478,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 477,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "bg-[#2a2a2a] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#3a3a3a] transition-all duration-200 text-sm",
                                                        children: [
                                                            "📷 ",
                                                            t('temperature.addPhoto', 'Add Photo')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                        lineNumber: 489,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "bg-[#2a2a2a] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#3a3a3a] transition-all duration-200 text-sm",
                                                        children: [
                                                            "✏️ ",
                                                            t('temperature.edit', 'Edit')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                        lineNumber: 492,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 488,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, log.id, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 422,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 417,
                                columnNumber: 15
                            }, this)
                        ]
                    }, timeGroup.period, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                        lineNumber: 404,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                lineNumber: 393,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
_s(TemperatureLogsTab, "be79vA9AgCtxNrmm5bcUw3xwT0s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCountryFormatting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCountryFormatting"]
    ];
});
_c = TemperatureLogsTab;
var _c;
__turbopack_context__.k.register(_c, "TemperatureLogsTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_3236be33._.js.map