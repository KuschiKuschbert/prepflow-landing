module.exports = [
"[project]/hooks/useCountryFormatting.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCountryFormatting",
    ()=>useCountryFormatting
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$CountryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/CountryContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/country-config.ts [app-ssr] (ecmascript)");
;
;
function useCountryFormatting() {
    const { countryConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$CountryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCountry"])();
    const formatCurrency = (amount, includeTax = true)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrencyWithTax"])(amount, countryConfig.code, includeTax);
    };
    const formatDate = (date, options)=>{
        return new Intl.DateTimeFormat(countryConfig.locale, options).format(date);
    };
    const formatNumber = (num, options)=>{
        return new Intl.NumberFormat(countryConfig.locale, options).format(num);
    };
    const formatPercentage = (value)=>{
        return new Intl.NumberFormat(countryConfig.locale, {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value);
    };
    const calculateTax = (amount)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTaxBreakdown"])(amount, countryConfig.code);
    };
    const getTaxInfo = ()=>({
            rate: countryConfig.taxRate,
            name: countryConfig.taxName,
            currency: countryConfig.currency
        });
    return {
        countryConfig,
        formatCurrency,
        formatDate,
        formatNumber,
        formatPercentage,
        calculateTax,
        getTaxInfo
    };
}
}),
"[project]/components/OptimizedImage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OptimizedImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
;
;
function OptimizedImage({ src, alt, width, height, priority = false, className = '', sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw', quality = 85 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TemperatureLogsTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OptimizedImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/OptimizedImage.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCountryFormatting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useCountryFormatting.ts [app-ssr] (ecmascript)");
'use client';
;
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
function TemperatureLogsTab({ logs, equipment, selectedDate, setSelectedDate, selectedType, setSelectedType, showAddLog, setShowAddLog, newLog, setNewLog, onAddLog, onRefreshLogs }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const { formatDate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCountryFormatting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCountryFormatting"])();
    // Helper functions
    const formatTime = (timeString)=>{
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
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
        const logDateTime = new Date(`${logDate}T${logTime}`);
        const now = new Date();
        const hoursInDangerZone = (now.getTime() - logDateTime.getTime()) / (1000 * 60 * 60);
        if (hoursInDangerZone < 2) {
            return {
                status: 'safe',
                message: `${(2 - hoursInDangerZone).toFixed(1)}h remaining - can refrigerate`,
                color: 'text-green-400',
                icon: '✅'
            };
        } else if (hoursInDangerZone < 4) {
            return {
                status: 'warning',
                message: `${(4 - hoursInDangerZone).toFixed(1)}h remaining - use immediately`,
                color: 'text-yellow-400',
                icon: '⚠️'
            };
        } else {
            return {
                status: 'danger',
                message: `${hoursInDangerZone.toFixed(1)}h in danger zone - DISCARD`,
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
        return typeInfo?.icon || '🌡️';
    };
    const getTypeLabel = (type)=>{
        const typeInfo = temperatureTypes.find((t)=>t.value === type);
        return typeInfo?.label || type;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.filterDate', 'Filter by Date')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 170,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    const currentDate = new Date(selectedDate);
                                                    currentDate.setDate(currentDate.getDate() - 1);
                                                    setSelectedDate(currentDate.toISOString().split('T')[0]);
                                                },
                                                className: "bg-[#2a2a2a] text-white px-3 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center justify-center",
                                                title: "Previous day",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: selectedDate,
                                                onChange: (e)=>setSelectedDate(e.target.value),
                                                className: "px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 183,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    const currentDate = new Date(selectedDate);
                                                    currentDate.setDate(currentDate.getDate() + 1);
                                                    setSelectedDate(currentDate.toISOString().split('T')[0]);
                                                },
                                                className: "bg-[#2a2a2a] text-white px-3 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center justify-center",
                                                title: "Next day",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.filterEquipment', 'Filter by Equipment')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedType,
                                        onChange: (e)=>setSelectedType(e.target.value),
                                        className: "px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: t('temperature.allEquipment', 'All Equipment')
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 218,
                                                columnNumber: 15
                                            }, this),
                                            equipment.filter((eq)=>eq.is_active).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                                            temperatureTypes.filter((type)=>type.value === 'food_cooking' || type.value === 'food_hot_holding' || type.value === 'food_cold_holding').map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            showAddLog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-semibold text-white mb-2",
                        children: t('temperature.addNewLog', 'Add New Temperature Log')
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-400 mb-4",
                        children: "💡 You can log multiple temperatures per day for the same equipment (e.g., morning and evening checks). There's a 5-minute cooling off period between entries for the same equipment."
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 p-4 bg-blue-400/10 border border-blue-400/20 rounded-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-blue-400 mb-2",
                                children: "🍽️ Queensland 2-Hour/4-Hour Rule"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                lineNumber: 254,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-300 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "• ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "• ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "• ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: onAddLog,
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.date', 'Date')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 263,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.time', 'Time')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.equipment', 'Equipment')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: newLog.temperature_type,
                                        onChange: (e)=>{
                                            const selectedEquipment = equipment.find((eq)=>eq.equipment_type === e.target.value);
                                            setNewLog({
                                                ...newLog,
                                                temperature_type: e.target.value,
                                                location: selectedEquipment?.name || ''
                                            });
                                        },
                                        className: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: t('temperature.selectEquipment', 'Select Equipment')
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 297,
                                                columnNumber: 17
                                            }, this),
                                            equipment.filter((eq)=>eq.is_active).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                                            temperatureTypes.filter((type)=>type.value === 'food_cooking' || type.value === 'food_hot_holding' || type.value === 'food_cold_holding').map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.temperature', 'Temperature (°C)')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                    ].includes(newLog.temperature_type) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.loggedBy', 'Logged By')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 354,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                        children: t('temperature.notes', 'Notes')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 364,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2 flex space-x-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "bg-[#29E7CD] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200",
                                        children: t('temperature.save', 'Save Log')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                        lineNumber: 374,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: logs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-20 h-20 rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center mx-auto mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold text-white mb-2",
                            children: t('temperature.noLogs', 'No Temperature Logs')
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                            lineNumber: 399,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                }, this) : groupLogsByTimePeriod(logs).map((timeGroup)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-white",
                                                children: timeGroup.label
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 411,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: timeGroup.logs.map((log)=>{
                                    const status = getTemperatureStatus(log.temperature_celsius, log.location || '');
                                    const foodSafety = getFoodSafetyStatus(log.temperature_celsius, log.log_time, log.log_date, log.temperature_type);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-lg font-semibold text-white",
                                                                        children: log.location || getTypeLabel(log.temperature_type)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                        lineNumber: 429,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center space-x-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm text-gray-400",
                                                                                children: log.log_time
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                                lineNumber: 431,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-gray-500",
                                                                                children: "•"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                                lineNumber: 432,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`,
                                                                children: status === 'high' ? '⚠️ High' : status === 'low' ? '⚠️ Low' : '✅ Normal'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                lineNumber: 438,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                            log.location && log.location !== getTypeLabel(log.temperature_type) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                            log.logged_by && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                            log.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-300 text-sm mb-3",
                                                children: log.notes
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                lineNumber: 456,
                                                columnNumber: 25
                                            }, this),
                                            foodSafety && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `mb-3 p-3 rounded-xl border ${foodSafety.color.replace('text-', 'bg-').replace('-400', '-400/10')} border-${foodSafety.color.replace('text-', '').replace('-400', '-400/20')}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg",
                                                            children: foodSafety.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `text-sm font-medium ${foodSafety.color}`,
                                                                    children: "Queensland 2-Hour/4-Hour Rule"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx",
                                                                    lineNumber: 465,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `text-xs ${foodSafety.color}`,
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
                                            log.photo_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OptimizedImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
}),
"[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TemperatureEquipmentTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-ssr] (ecmascript)");
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
function TemperatureEquipmentTab({ equipment, quickTempLoading, onUpdateEquipment, onCreateEquipment, onDeleteEquipment, onQuickTempLog }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [editingEquipment, setEditingEquipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newEquipment, setNewEquipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        equipmentType: '',
        location: '',
        minTemp: null,
        maxTemp: null
    });
    const [showCreateForm, setShowCreateForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const getTypeIcon = (type)=>{
        const typeInfo = temperatureTypes.find((t)=>t.value === type);
        return typeInfo?.icon || '🌡️';
    };
    const getTypeLabel = (type)=>{
        const typeInfo = temperatureTypes.find((t)=>t.value === type);
        return typeInfo?.label || type;
    };
    const handleCreateEquipment = async (e)=>{
        e.preventDefault();
        try {
            await onCreateEquipment(newEquipment.name, newEquipment.equipmentType, newEquipment.location || null, newEquipment.minTemp, newEquipment.maxTemp);
            setNewEquipment({
                name: '',
                equipmentType: '',
                location: '',
                minTemp: null,
                maxTemp: null
            });
            setShowCreateForm(false);
        } catch (error) {
        // Handle error gracefully
        }
    };
    const handleUpdateEquipment = async (equipmentId, updates)=>{
        try {
            await onUpdateEquipment(equipmentId, updates);
            setEditingEquipment(null);
        } catch (error) {
        // Handle error gracefully
        }
    };
    const handleDeleteEquipment = async (equipmentId)=>{
        if (confirm('Are you sure you want to delete this equipment? This will also delete all associated temperature logs.')) {
            try {
                await onDeleteEquipment(equipmentId);
            } catch (error) {
            // Handle error gracefully
            }
        }
    };
    const toggleEquipmentStatus = async (equipmentId, currentStatus)=>{
        try {
            await onUpdateEquipment(equipmentId, {
                is_active: !currentStatus
            });
        } catch (error) {
        // Handle error gracefully
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-semibold text-white",
                                children: t('temperature.equipment', 'Temperature Equipment')
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 mt-1",
                                children: t('temperature.equipmentDesc', 'Manage your temperature monitoring equipment')
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowCreateForm(!showCreateForm),
                        className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "➕"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: t('temperature.addEquipment', 'Add Equipment')
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            showCreateForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-white mb-4",
                        children: "➕ Add New Equipment"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleCreateEquipment,
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-2",
                                                children: "Equipment Name"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: newEquipment.name,
                                                onChange: (e)=>setNewEquipment({
                                                        ...newEquipment,
                                                        name: e.target.value
                                                    }),
                                                className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                placeholder: "e.g., Main Fridge, Freezer 1",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 133,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-2",
                                                children: "Equipment Type"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 144,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: newEquipment.equipmentType,
                                                onChange: (e)=>setNewEquipment({
                                                        ...newEquipment,
                                                        equipmentType: e.target.value
                                                    }),
                                                className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                required: true,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Select type..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 19
                                                    }, this),
                                                    temperatureTypes.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: type.value,
                                                            children: [
                                                                type.icon,
                                                                " ",
                                                                type.label
                                                            ]
                                                        }, type.value, true, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 21
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-2",
                                                children: "Location (Optional)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 163,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: newEquipment.location,
                                                onChange: (e)=>setNewEquipment({
                                                        ...newEquipment,
                                                        location: e.target.value
                                                    }),
                                                className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                placeholder: "e.g., Kitchen, Storage Room"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-2",
                                                children: "Min Temperature (°C)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 174,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                step: "0.1",
                                                value: newEquipment.minTemp || '',
                                                onChange: (e)=>setNewEquipment({
                                                        ...newEquipment,
                                                        minTemp: e.target.value ? parseFloat(e.target.value) : null
                                                    }),
                                                className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                placeholder: "Optional"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 175,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-2",
                                                children: "Max Temperature (°C)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 189,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                step: "0.1",
                                                value: newEquipment.maxTemp || '',
                                                onChange: (e)=>setNewEquipment({
                                                        ...newEquipment,
                                                        maxTemp: e.target.value ? parseFloat(e.target.value) : null
                                                    }),
                                                className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                placeholder: "Optional"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200",
                                        children: "Add Equipment"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShowCreateForm(false),
                                        className: "bg-[#2a2a2a] text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                lineNumber: 127,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: equipment.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-4xl mb-4",
                            children: "🌡️"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-white mb-2",
                            children: "No Equipment Added"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 mb-4",
                            children: "Add temperature monitoring equipment to start tracking"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowCreateForm(true),
                            className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200",
                            children: "Add Your First Equipment"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this) : equipment.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl",
                                                children: getTypeIcon(item.equipment_type)
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 242,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-semibold text-white",
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400",
                                                        children: getTypeLabel(item.equipment_type)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 21
                                                    }, this),
                                                    item.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-500 text-sm",
                                                        children: [
                                                            "📍 ",
                                                            item.location
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 247,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 243,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                        lineNumber: 241,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-400",
                                                        children: "Temperature Range"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 254,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-lg font-semibold text-white",
                                                        children: item.min_temp_celsius && item.max_temp_celsius ? `${item.min_temp_celsius}°C - ${item.max_temp_celsius}°C` : 'Not set'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 253,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `w-3 h-3 rounded-full ${item.is_active ? 'bg-green-400' : 'bg-gray-400'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 264,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-gray-300",
                                                        children: item.is_active ? 'Active' : 'Inactive'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 263,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>onQuickTempLog(item.id, item.name, item.equipment_type),
                                                        disabled: quickTempLoading[item.id] || !item.is_active,
                                                        className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-4 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm",
                                                        children: quickTempLoading[item.id] ? 'Logging...' : 'Quick Log'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 271,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>toggleEquipmentStatus(item.id, item.is_active),
                                                        className: `px-3 py-2 rounded-xl font-semibold transition-all duration-200 text-sm ${item.is_active ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`,
                                                        children: item.is_active ? 'Deactivate' : 'Activate'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setEditingEquipment(editingEquipment === item.id ? null : item.id),
                                                        className: "bg-[#2a2a2a] text-gray-300 px-3 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 text-sm",
                                                        children: editingEquipment === item.id ? 'Cancel' : 'Edit'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDeleteEquipment(item.id),
                                                        className: "bg-red-500/20 text-red-400 px-3 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-200 text-sm",
                                                        children: "Delete"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                        lineNumber: 297,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 270,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                        lineNumber: 252,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                lineNumber: 240,
                                columnNumber: 15
                            }, this),
                            editingEquipment === item.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 pt-6 border-t border-[#2a2a2a]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: (e)=>{
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        handleUpdateEquipment(item.id, {
                                            name: formData.get('name'),
                                            equipment_type: formData.get('equipmentType'),
                                            location: formData.get('location') || null,
                                            min_temp_celsius: formData.get('minTemp') ? parseFloat(formData.get('minTemp')) : null,
                                            max_temp_celsius: formData.get('maxTemp') ? parseFloat(formData.get('maxTemp')) : null
                                        });
                                    },
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                                            children: "Equipment Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 323,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            name: "name",
                                                            defaultValue: item.name,
                                                            className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 324,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                                            children: "Equipment Type"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 334,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            name: "equipmentType",
                                                            defaultValue: item.equipment_type,
                                                            className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                            required: true,
                                                            children: temperatureTypes.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: type.value,
                                                                    children: [
                                                                        type.icon,
                                                                        " ",
                                                                        type.label
                                                                    ]
                                                                }, type.value, true, {
                                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                                    lineNumber: 342,
                                                                    columnNumber: 29
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 335,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                            lineNumber: 321,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                                            children: "Location"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 352,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            name: "location",
                                                            defaultValue: item.location || '',
                                                            className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                            placeholder: "Optional"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 353,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                    lineNumber: 351,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                                            children: "Min Temperature (°C)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 363,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            step: "0.1",
                                                            name: "minTemp",
                                                            defaultValue: item.min_temp_celsius || '',
                                                            className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                            placeholder: "Optional"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 364,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                    lineNumber: 362,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                                            children: "Max Temperature (°C)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 375,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            step: "0.1",
                                                            name: "maxTemp",
                                                            defaultValue: item.max_temp_celsius || '',
                                                            className: "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent",
                                                            placeholder: "Optional"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                            lineNumber: 376,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                    lineNumber: 374,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                            lineNumber: 350,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex space-x-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200",
                                                children: "Update Equipment"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                                lineNumber: 388,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                            lineNumber: 387,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                    lineNumber: 310,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                                lineNumber: 309,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                        lineNumber: 239,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RechartsTemperatureChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$ReferenceLine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/ReferenceLine.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function RechartsTemperatureChart({ logs, equipment, timeFilter }) {
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Filter logs by equipment and time
    const getFilteredLogs = ()=>{
        if (!equipment || !equipment.name) return [];
        // Filter by equipment
        const equipmentLogs = logs.filter((log)=>log.location === equipment.name);
        if (equipmentLogs.length === 0) return [];
        // Sort by timestamp
        const sortedLogs = equipmentLogs.sort((a, b)=>{
            const dateA = new Date(`${a.log_date}T${a.log_time}`);
            const dateB = new Date(`${b.log_date}T${b.log_time}`);
            return dateA.getTime() - dateB.getTime();
        });
        // Apply time filter
        const now = new Date();
        const mostRecentLog = sortedLogs[sortedLogs.length - 1];
        const mostRecentTime = new Date(`${mostRecentLog.log_date}T${mostRecentLog.log_time}`);
        let cutoffTime;
        switch(timeFilter){
            case '24h':
                cutoffTime = new Date(mostRecentTime.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                cutoffTime = new Date(mostRecentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                cutoffTime = new Date(mostRecentTime.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                return sortedLogs;
        }
        return sortedLogs.filter((log)=>{
            const logTime = new Date(`${log.log_date}T${log.log_time}`);
            return logTime >= cutoffTime;
        });
    };
    const filteredLogs = getFilteredLogs();
    // Transform data for Recharts
    const chartData = filteredLogs.map((log)=>({
            timestamp: `${log.log_date}T${log.log_time}`,
            temperature: log.temperature_celsius,
            time: new Date(`${log.log_date}T${log.log_time}`).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }),
            date: new Date(`${log.log_date}T${log.log_time}`).toLocaleDateString()
        }));
    // Handle loading state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (chartData.length > 0 && equipment && equipment.name) {
            const timer = setTimeout(()=>{
                setIsLoaded(true);
            }, 200);
            return ()=>clearTimeout(timer);
        } else {
            setIsLoaded(false);
        }
    }, [
        chartData.length,
        equipment?.name,
        timeFilter
    ]);
    // Don't render chart if not loaded, no data, or invalid equipment
    if (!isLoaded || chartData.length === 0 || !equipment || !equipment.name) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 opacity-20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-3/4 h-1 bg-gradient-to-r from-transparent via-[#29E7CD] to-transparent rounded-full animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-2",
                                children: [
                                    0,
                                    1,
                                    2,
                                    3,
                                    4
                                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse",
                                        style: {
                                            animationDelay: `${i * 0.2}s`,
                                            animationDuration: '1.5s'
                                        }
                                    }, i, false, {
                                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                                        lineNumber: 142,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-gray-400 text-sm font-medium relative z-10",
                    children: "Drawing temperature path..."
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
            lineNumber: 125,
            columnNumber: 7
        }, this);
    }
    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label })=>{
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-800 border border-[#29E7CD] rounded-xl p-3 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white font-medium text-sm",
                        children: [
                            data.date,
                            " at ",
                            data.time
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#29E7CD] font-semibold text-lg",
                        children: [
                            data.temperature,
                            "°C"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                lineNumber: 168,
                columnNumber: 9
            }, this);
        }
        return null;
    };
    // Custom tick formatter for X-axis
    const formatXAxisTick = (tickItem)=>{
        const date = new Date(tickItem);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-96",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
            width: "100%",
            height: "100%",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LineChart"], {
                data: chartData,
                margin: {
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                        strokeDasharray: "3 3",
                        stroke: "#2a2a2a",
                        strokeOpacity: 0.5
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                        dataKey: "timestamp",
                        tickFormatter: formatXAxisTick,
                        stroke: "#9ca3af",
                        fontSize: 12,
                        tickLine: false,
                        axisLine: false,
                        interval: "preserveStartEnd"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                        stroke: "#9ca3af",
                        fontSize: 12,
                        tickLine: false,
                        axisLine: false,
                        domain: [
                            'dataMin - 2',
                            'dataMax + 2'
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                        content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomTooltip, {}, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                            lineNumber: 218,
                            columnNumber: 29
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this),
                    equipment.min_temp_celsius !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$ReferenceLine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReferenceLine"], {
                        y: equipment.min_temp_celsius,
                        stroke: "#ef4444",
                        strokeDasharray: "5 5",
                        strokeWidth: 2,
                        label: {
                            value: `Min: ${equipment.min_temp_celsius}°C`,
                            position: 'insideTopLeft',
                            style: {
                                fill: '#ef4444',
                                fontSize: '12px'
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                        lineNumber: 222,
                        columnNumber: 13
                    }, this),
                    equipment.max_temp_celsius !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$ReferenceLine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReferenceLine"], {
                        y: equipment.max_temp_celsius,
                        stroke: "#ef4444",
                        strokeDasharray: "5 5",
                        strokeWidth: 2,
                        label: {
                            value: `Max: ${equipment.max_temp_celsius}°C`,
                            position: 'insideTopRight',
                            style: {
                                fill: '#ef4444',
                                fontSize: '12px'
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                        lineNumber: 236,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                        type: "monotone",
                        dataKey: "temperature",
                        stroke: "#29E7CD",
                        strokeWidth: 3,
                        dot: {
                            fill: '#29E7CD',
                            stroke: '#ffffff',
                            strokeWidth: 2,
                            r: 4
                        },
                        activeDot: {
                            r: 6,
                            stroke: '#29E7CD',
                            strokeWidth: 2,
                            fill: '#ffffff'
                        },
                        animationDuration: 1000,
                        animationEasing: "ease-in-out"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
            lineNumber: 189,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CleanTemperatureChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$RechartsTemperatureChart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/webapp/temperature/components/RechartsTemperatureChart.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function CleanTemperatureChart({ logs, equipment, timeFilter }) {
    const chartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Filter logs based on time range and equipment
    const getFilteredLogs = ()=>{
        // First filter by equipment name (matching log.location with equipment.name)
        let equipmentFilteredLogs = logs;
        if (equipment && equipment.name) {
            equipmentFilteredLogs = logs.filter((log)=>log.location === equipment.name);
        }
        console.log('🔍 Filter Debug:', {
            totalLogs: logs.length,
            equipmentName: equipment?.name,
            equipmentFilteredCount: equipmentFilteredLogs.length,
            timeFilter,
            sampleEquipmentLogs: equipmentFilteredLogs.slice(0, 3)
        });
        console.log('🔍 Filter Debug - Expanded:', 'Total logs:', logs.length, 'Equipment name:', equipment?.name, 'Equipment filtered count:', equipmentFilteredLogs.length, 'Time filter:', timeFilter, 'Sample logs:', equipmentFilteredLogs.slice(0, 3));
        // If we have logs but they're all from the same date (historical data),
        // don't apply time filtering - just return all equipment-filtered logs
        const uniqueDates = [
            ...new Set(equipmentFilteredLogs.map((log)=>log.log_date))
        ];
        if (uniqueDates.length === 1 && equipmentFilteredLogs.length > 0) {
            return equipmentFilteredLogs;
        }
        // For historical data that doesn't extend to current date, be more flexible with time filtering
        const now = new Date();
        const cutoffDate = new Date();
        switch(timeFilter){
            case '24h':
                // For 24h, if we have historical data, show the most recent 24 hours of available data
                if (equipmentFilteredLogs.length > 0) {
                    const mostRecentLog = equipmentFilteredLogs.reduce((latest, log)=>{
                        const logDate = new Date(`${log.log_date} ${log.log_time}`);
                        const latestDate = new Date(`${latest.log_date} ${latest.log_time}`);
                        return logDate > latestDate ? log : latest;
                    });
                    const mostRecentDate = new Date(`${mostRecentLog.log_date} ${mostRecentLog.log_time}`);
                    cutoffDate.setTime(mostRecentDate.getTime() - 24 * 60 * 60 * 1000);
                } else {
                    cutoffDate.setHours(now.getHours() - 24);
                }
                break;
            case '7d':
                // For 7d, if we have historical data, show the most recent 7 days of available data
                if (equipmentFilteredLogs.length > 0) {
                    const mostRecentLog = equipmentFilteredLogs.reduce((latest, log)=>{
                        const logDate = new Date(`${log.log_date} ${log.log_time}`);
                        const latestDate = new Date(`${latest.log_date} ${latest.log_time}`);
                        return logDate > latestDate ? log : latest;
                    });
                    const mostRecentDate = new Date(`${mostRecentLog.log_date} ${mostRecentLog.log_time}`);
                    cutoffDate.setTime(mostRecentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                } else {
                    cutoffDate.setDate(now.getDate() - 7);
                }
                break;
            case '30d':
                // For 30d, if we have historical data, show the most recent 30 days of available data
                if (equipmentFilteredLogs.length > 0) {
                    const mostRecentLog = equipmentFilteredLogs.reduce((latest, log)=>{
                        const logDate = new Date(`${log.log_date} ${log.log_time}`);
                        const latestDate = new Date(`${latest.log_date} ${latest.log_time}`);
                        return logDate > latestDate ? log : latest;
                    });
                    const mostRecentDate = new Date(`${mostRecentLog.log_date} ${mostRecentLog.log_time}`);
                    cutoffDate.setTime(mostRecentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
                } else {
                    cutoffDate.setDate(now.getDate() - 30);
                }
                break;
            case 'all':
            default:
                return equipmentFilteredLogs;
        }
        return equipmentFilteredLogs.filter((log)=>{
            const logDate = new Date(`${log.log_date} ${log.log_time}`);
            return logDate >= cutoffDate;
        });
    };
    const filteredLogs = getFilteredLogs();
    const chartData = filteredLogs.map((log)=>{
        const timestamp = `${log.log_date} ${log.log_time}`;
        const timestampMs = new Date(timestamp).getTime();
        return {
            timestamp: timestamp,
            timestampMs: timestampMs,
            temperature: log.temperature_celsius,
            date: log.log_date,
            time: log.log_time
        };
    }).sort((a, b)=>a.timestampMs - b.timestampMs);
    // Debug the chart data structure
    console.log('🔍 Chart Data Structure:', {
        chartDataLength: chartData.length,
        sampleChartData: chartData.slice(0, 3),
        timestampFormat: chartData.length > 0 ? chartData[0].timestamp : 'N/A',
        temperatureValues: chartData.slice(0, 3).map((d)=>d.temperature)
    });
    console.log('🔍 Chart Data Structure - Expanded:', 'Chart data length:', chartData.length, 'Sample chart data:', chartData.slice(0, 3), 'Timestamp format:', chartData.length > 0 ? chartData[0].timestamp : 'N/A', 'Temperature values:', chartData.slice(0, 3).map((d)=>d.temperature));
    // Handle loading state to prevent FOUC and stray chart elements
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Show chart immediately to prevent FOUC
        if (filteredLogs.length > 0 && equipment && equipment.name) {
            setIsLoaded(true);
        } else {
            setIsLoaded(false);
        }
    }, [
        filteredLogs.length,
        equipment?.name,
        timeFilter
    ]);
    const isTemperatureInRange = (temp)=>{
        if (equipment.min_temp_celsius === null || equipment.max_temp_celsius === null) {
            return true;
        }
        return temp >= equipment.min_temp_celsius && temp <= equipment.max_temp_celsius;
    };
    // Adaptive features based on data density and time range
    const getAdaptiveSettings = ()=>{
        const dataLength = chartData.length;
        const timeRange = timeFilter;
        // Adaptive data sampling for performance
        const shouldSample = dataLength > 1000;
        const sampleRate = dataLength > 5000 ? 5 : dataLength > 2000 ? 3 : 1;
        // Adaptive chart height based on data density
        const chartHeight = dataLength > 500 ? 200 : dataLength > 100 ? 250 : 300;
        // Adaptive dot size based on data density
        const dotSize = dataLength > 1000 ? 2 : dataLength > 500 ? 3 : 4;
        const showDots = dataLength < 200;
        // Adaptive line width
        const lineWidth = dataLength > 1000 ? 1 : dataLength > 500 ? 2 : 3;
        // Smart X-axis interval based on data density and time range
        const getXAxisInterval = ()=>{
            if (dataLength < 20) return 0; // Show all labels for small datasets
            if (dataLength < 50) return 1; // Show every other label
            if (dataLength < 100) return 2; // Show every 3rd label
            if (dataLength < 200) return 3; // Show every 4th label
            if (dataLength < 500) return 4; // Show every 5th label
            if (dataLength < 1000) return 5; // Show every 6th label
            return 6; // Show every 7th label for very dense data
        };
        return {
            shouldSample,
            sampleRate,
            chartHeight,
            dotSize,
            showDots,
            lineWidth,
            xAxisInterval: getXAxisInterval()
        };
    };
    const adaptiveSettings = getAdaptiveSettings();
    // Sample data if needed for performance
    const getOptimizedData = ()=>{
        if (!adaptiveSettings.shouldSample) {
            return chartData;
        }
        const sampled = [];
        for(let i = 0; i < chartData.length; i += adaptiveSettings.sampleRate){
            sampled.push(chartData[i]);
        }
        // Always include the last point
        if (chartData.length > 0 && sampled[sampled.length - 1] !== chartData[chartData.length - 1]) {
            sampled.push(chartData[chartData.length - 1]);
        }
        return sampled;
    };
    const optimizedData = getOptimizedData();
    // Add out-of-range highlighting to chart data
    const enhancedData = optimizedData.map((point, index)=>({
            ...point,
            isOutOfRange: !isTemperatureInRange(point.temperature),
            isRecentOutOfRange: !isTemperatureInRange(point.temperature) && index >= optimizedData.length - 5 // Last 5 points
        }));
    // Debug logging to understand data flow
    console.log('🔍 Chart Debug Info:', {
        equipmentName: equipment?.name,
        filteredLogsCount: filteredLogs.length,
        chartDataCount: chartData.length,
        optimizedDataCount: optimizedData.length,
        enhancedDataCount: enhancedData.length,
        sampleData: enhancedData.slice(0, 3),
        timeFilter,
        isLoaded
    });
    console.log('🔍 Chart Debug Info - Expanded:', 'Equipment name:', equipment?.name, 'Filtered logs count:', filteredLogs.length, 'Chart data count:', chartData.length, 'Optimized data count:', optimizedData.length, 'Enhanced data count:', enhancedData.length, 'Sample enhanced data:', enhancedData.slice(0, 3), 'Time filter:', timeFilter, 'Is loaded:', isLoaded);
    const latestLog = filteredLogs.length > 0 ? filteredLogs[filteredLogs.length - 1] : null;
    const latestTemperature = latestLog?.temperature_celsius;
    const latestStatus = latestTemperature !== null && latestTemperature !== undefined ? isTemperatureInRange(latestTemperature) ? 'In Range' : 'Out of Range' : 'N/A';
    const statusColor = latestStatus === 'In Range' ? 'text-green-400' : 'text-red-400';
    // Check for recent out-of-range temperatures
    const hasRecentOutOfRange = enhancedData.some((point)=>point.isRecentOutOfRange);
    // Daily compliance tracking
    const getDailyCompliance = ()=>{
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = filteredLogs.filter((log)=>log.log_date === today);
        return {
            hasMinimumLogs: todayLogs.length >= 2,
            logCount: todayLogs.length,
            hasFoodTemp: todayLogs.some((log)=>log.temperature_type === 'food' || log.temperature_type === 'Food'),
            lastLogTime: todayLogs.length > 0 ? todayLogs[todayLogs.length - 1].log_time : null
        };
    };
    const dailyCompliance = getDailyCompliance();
    // Smart alerts for unusual patterns (only non-redundant alerts)
    const getSmartAlerts = ()=>{
        const alerts = [];
        // Only show alerts that aren't already covered by daily compliance status
        // Alert: No recent logs (if no logs in last 4 hours)
        const now = new Date();
        const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
        const recentLogs = filteredLogs.filter((log)=>{
            const logTime = new Date(`${log.log_date} ${log.log_time}`);
            return logTime >= fourHoursAgo;
        });
        if (recentLogs.length === 0 && filteredLogs.length > 0) {
            alerts.push({
                type: 'warning',
                message: 'No logs in last 4 hours',
                icon: '⏰'
            });
        }
        return alerts;
    };
    const smartAlerts = getSmartAlerts();
    const formatXAxisLabel = (tickItem)=>{
        const date = new Date(tickItem);
        // Use consistent formatting to prevent hydration mismatches
        switch(timeFilter){
            case '24h':
                return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
            case '7d':
                const weekdays = [
                    'Sun',
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat'
                ];
                return weekdays[date.getDay()] + ' ' + date.getDate();
            case '30d':
                const months = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ];
                return date.getDate() + ' ' + months[date.getMonth()];
            case 'all':
            default:
                const shortMonths = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ];
                return date.getDate() + ' ' + shortMonths[date.getMonth()];
        }
    };
    const formatTooltipLabel = (label)=>{
        const date = new Date(label);
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${hours}:${minutes}`;
    };
    const formatTooltipValue = (value)=>{
        return `${value?.toFixed(1)}°C`;
    };
    // Clean up event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleGlobalMouseUp = ()=>{
        // Handle mouse up events if needed
        };
        const handleGlobalTouchEnd = ()=>{
        // Handle touch end events if needed
        };
        document.addEventListener('mouseup', handleGlobalMouseUp);
        document.addEventListener('touchend', handleGlobalTouchEnd);
        return ()=>{
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('touchend', handleGlobalTouchEnd);
        };
    }, []);
    if (!chartData || chartData.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-white",
                            children: equipment.name
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                            lineNumber: 359,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-2 h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                    lineNumber: 361,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `text-sm ${statusColor}`,
                                    children: latestStatus
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                            lineNumber: 360,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                    lineNumber: 358,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center py-12 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-20 h-20 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-full flex items-center justify-center mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-10 h-10 text-gray-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                    lineNumber: 369,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 368,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                            lineNumber: 367,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "text-lg font-medium text-white mb-2",
                            children: "No Temperature Data"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                            lineNumber: 372,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 text-sm max-w-sm",
                            children: "No temperature logs found for this equipment."
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                            lineNumber: 373,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                    lineNumber: 366,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
            lineNumber: 357,
            columnNumber: 7
        }, this);
    }
    // Don't render chart if not loaded, no data, or invalid equipment
    if (!isLoaded || chartData.length === 0 || !equipment || !equipment.name) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-6 bg-[#2a2a2a] rounded w-1/3 mb-4"
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                    lineNumber: 386,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-8 bg-[#2a2a2a] rounded w-1/4 mb-4"
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                    lineNumber: 387,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-48 bg-[#2a2a2a] rounded"
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                    lineNumber: 388,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
            lineNumber: 385,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] temperature-chart-container`,
        ref: chartRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-white chart-title",
                                children: equipment.name
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            hasRecentOutOfRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-3 h-3 bg-red-500 rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 402,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-2 h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 406,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm ${statusColor}`,
                                children: latestStatus
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 407,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                        lineNumber: 405,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                lineNumber: 398,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-2xl font-bold text-white mb-2",
                children: latestTemperature ? `${latestTemperature.toFixed(1)}°C` : '--'
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-gray-400 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    optimizedData.length,
                                    " of ",
                                    chartData.length,
                                    " readings",
                                    adaptiveSettings.shouldSample && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-2 text-yellow-400",
                                        children: "(sampled for performance)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                        lineNumber: 420,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 417,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[#29E7CD]",
                                children: [
                                    timeFilter.toUpperCase(),
                                    " view"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 425,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                        lineNumber: 416,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex items-center space-x-1 ${dailyCompliance.hasMinimumLogs ? 'text-green-400' : 'text-red-400'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: dailyCompliance.hasMinimumLogs ? '✅' : '❌'
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                                lineNumber: 436,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    dailyCompliance.logCount,
                                                    "/2+ logs today"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                                lineNumber: 437,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                        lineNumber: 433,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex items-center space-x-1 ${dailyCompliance.hasFoodTemp ? 'text-green-400' : 'text-yellow-400'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: dailyCompliance.hasFoodTemp ? '✅' : '📋'
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                                lineNumber: 442,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: dailyCompliance.hasFoodTemp ? 'Food temped' : 'No food temp'
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                                lineNumber: 443,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                        lineNumber: 439,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 432,
                                columnNumber: 11
                            }, this),
                            dailyCompliance.lastLogTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-500",
                                children: [
                                    "Last: ",
                                    dailyCompliance.lastLogTime
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 447,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                        lineNumber: 431,
                        columnNumber: 9
                    }, this),
                    smartAlerts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 space-y-1",
                        children: smartAlerts.map((alert, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-center space-x-2 px-2 py-1 rounded text-xs ${alert.type === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : alert.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: alert.icon
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                        lineNumber: 467,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: alert.message
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                        lineNumber: 468,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                                lineNumber: 457,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                        lineNumber: 455,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                lineNumber: 415,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full",
                style: {
                    height: `${adaptiveSettings.chartHeight}px`
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$RechartsTemperatureChart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    logs: logs,
                    equipment: equipment,
                    timeFilter: timeFilter
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                    lineNumber: 479,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
                lineNumber: 478,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx",
        lineNumber: 394,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/LoadingSkeleton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardGridSkeleton",
    ()=>CardGridSkeleton,
    "ChartSkeleton",
    ()=>ChartSkeleton,
    "FormSkeleton",
    ()=>FormSkeleton,
    "HeroSkeleton",
    ()=>HeroSkeleton,
    "LoadingSkeleton",
    ()=>LoadingSkeleton,
    "PageSkeleton",
    ()=>PageSkeleton,
    "PricingSkeleton",
    ()=>PricingSkeleton,
    "StatsGridSkeleton",
    ()=>StatsGridSkeleton,
    "TableSkeleton",
    ()=>TableSkeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function LoadingSkeleton({ variant = 'card', className = '', count = 1, height, width }) {
    const baseClasses = 'animate-pulse bg-[#2a2a2a] rounded-xl';
    const variants = {
        card: 'h-32',
        table: 'h-64',
        chart: 'h-80',
        list: 'h-16',
        form: 'h-96',
        stats: 'h-24',
        text: 'h-4',
        button: 'h-10 w-24'
    };
    const skeletonClasses = `${baseClasses} ${variants[variant]} ${className}`;
    const style = {
        ...height && {
            height
        },
        ...width && {
            width
        }
    };
    if (count === 1) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: skeletonClasses,
            style: style
        }, void 0, false, {
            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
            lineNumber: 40,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: Array.from({
            length: count
        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: skeletonClasses,
                style: style
            }, i, false, {
                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
function PageSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] p-4 sm:p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 bg-[#2a2a2a] rounded-3xl w-1/3 mb-4"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 bg-[#2a2a2a] rounded-xl w-1/2"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-12 bg-[#2a2a2a] rounded-2xl w-32 animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-12 bg-[#2a2a2a] rounded-2xl w-40 animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-12 bg-[#2a2a2a] rounded-2xl w-28 animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1f1f1f] rounded-3xl shadow-lg border border-[#2a2a2a] p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-pulse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-6 bg-[#2a2a2a] rounded-xl w-1/4 mb-6"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    ...Array(5)
                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-16 bg-[#2a2a2a] rounded-xl"
                                    }, i, false, {
                                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                        lineNumber: 76,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
            lineNumber: 56,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
function TableSkeleton({ rows = 5, columns = 4 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1f1f1f] rounded-3xl shadow-lg border border-[#2a2a2a] overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-6 py-4 border-b border-[#2a2a2a]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4",
                        children: Array.from({
                            length: columns
                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 bg-[#2a2a2a] rounded w-24"
                            }, i, false, {
                                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                lineNumber: 94,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "divide-y divide-[#2a2a2a]",
                children: Array.from({
                    length: rows
                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 py-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-pulse",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: Array.from({
                                    length: columns
                                }).map((_, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 bg-[#2a2a2a] rounded w-20"
                                    }, j, false, {
                                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                        lineNumber: 107,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                lineNumber: 105,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, this)
                    }, i, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
function ChartSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "animate-pulse",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-6 bg-[#2a2a2a] rounded-xl w-1/3 mb-4"
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-80 bg-[#2a2a2a] rounded-xl"
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
function CardGridSkeleton({ count = 6 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4",
        children: Array.from({
            length: count
        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-[#2a2a2a] rounded w-3/4 mb-3"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 bg-[#2a2a2a] rounded w-1/2 mb-2"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 bg-[#2a2a2a] rounded w-2/3"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                lineNumber: 133,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, this);
}
function StatsGridSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",
        children: Array.from({
            length: 4
        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-[#2a2a2a] rounded w-1/2 mb-3"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 bg-[#2a2a2a] rounded w-1/3 mb-2"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 149,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 bg-[#2a2a2a] rounded w-2/3"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                lineNumber: 147,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
        lineNumber: 145,
        columnNumber: 5
    }, this);
}
function FormSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "animate-pulse",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-6 bg-[#2a2a2a] rounded-xl w-1/4 mb-6"
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        [
                            ...Array(4)
                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 bg-[#2a2a2a] rounded w-1/3 mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                        lineNumber: 165,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-10 bg-[#2a2a2a] rounded-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-10 bg-[#2a2a2a] rounded-xl w-24"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
            lineNumber: 160,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
        lineNumber: 159,
        columnNumber: 5
    }, this);
}
function HeroSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-16 bg-[#2a2a2a] rounded-3xl w-2/3 mb-8 mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-6 bg-[#2a2a2a] rounded-xl w-1/2 mb-12 mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center gap-4 mb-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-14 bg-[#2a2a2a] rounded-2xl w-48"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-14 bg-[#2a2a2a] rounded-2xl w-40"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                                lineNumber: 186,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-96 bg-[#2a2a2a] rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                lineNumber: 181,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
            lineNumber: 180,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}
function PricingSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "animate-pulse",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-8 bg-[#2a2a2a] rounded-xl w-1/3 mb-6"
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 199,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-12 bg-[#2a2a2a] rounded-xl w-1/4 mb-4"
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4 bg-[#2a2a2a] rounded w-1/2 mb-8"
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 201,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 mb-8",
                    children: [
                        ...Array(4)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 bg-[#2a2a2a] rounded w-full"
                        }, i, false, {
                            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                            lineNumber: 204,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 202,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-14 bg-[#2a2a2a] rounded-2xl w-full"
                }, void 0, false, {
                    fileName: "[project]/components/ui/LoadingSkeleton.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/LoadingSkeleton.tsx",
            lineNumber: 198,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/LoadingSkeleton.tsx",
        lineNumber: 197,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TemperatureAnalyticsTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$CleanTemperatureChart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/webapp/temperature/components/CleanTemperatureChart.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/LoadingSkeleton.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function TemperatureAnalyticsTab({ allLogs, equipment }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [timeFilter, setTimeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('24h');
    const [dateOffset, setDateOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0); // 0 for today, 1 for yesterday, etc.
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedEquipmentId, setSelectedEquipmentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hasManuallyChangedFilter, setHasManuallyChangedFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Handle loading state to prevent FOUC - wait for data to be ready
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Show content immediately to prevent FOUC
        if (equipment.length > 0 && allLogs.length > 0) {
            setIsLoaded(true);
            // Smart equipment selection logic
            if (!selectedEquipmentId && equipment.length > 0) {
                // 1. First try to find equipment that is out of range
                const outOfRangeEquipment = findOutOfRangeEquipment();
                if (outOfRangeEquipment) {
                    setSelectedEquipmentId(outOfRangeEquipment.id);
                } else {
                    // 2. Fallback to first equipment
                    setSelectedEquipmentId(equipment[0].id);
                }
            }
            // Smart time filter selection - find the best filter with data (only if not manually changed)
            if (!hasManuallyChangedFilter) {
                const bestTimeFilter = findBestTimeFilter();
                if (bestTimeFilter !== timeFilter) {
                    setTimeFilter(bestTimeFilter);
                }
            }
        }
    }, [
        equipment.length,
        allLogs.length,
        dateOffset,
        selectedEquipmentId,
        hasManuallyChangedFilter
    ]);
    const getFilteredLogs = (equipment)=>{
        // Filter logs by equipment name (location field in logs matches equipment name)
        let filtered = allLogs.filter((log)=>log.location === equipment.name);
        const today = new Date();
        today.setDate(today.getDate() - dateOffset);
        const selectedDateString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(today, 'yyyy-MM-dd');
        if (timeFilter === '24h') {
            // For 24h, look at the last 24 hours from now
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            filtered = filtered.filter((log)=>{
                const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
                return logDateTime >= twentyFourHoursAgo && logDateTime <= now;
            });
        } else if (timeFilter === '7d') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            filtered = filtered.filter((log)=>new Date(log.log_date) >= sevenDaysAgo);
        } else if (timeFilter === '30d') {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            filtered = filtered.filter((log)=>new Date(log.log_date) >= thirtyDaysAgo);
        }
        // 'all' filter doesn't need further date filtering
        return filtered;
    };
    const getSelectedEquipment = ()=>{
        return equipment.find((eq)=>eq.id === selectedEquipmentId) || null;
    };
    // Check if there's data for a specific time filter
    const hasDataForTimeFilter = (timeFilter)=>{
        const today = new Date();
        today.setDate(today.getDate() - dateOffset);
        const selectedDateString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(today, 'yyyy-MM-dd');
        let filteredLogs = allLogs;
        if (timeFilter === '24h') {
            // For 24h, look at the last 24 hours from now
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            filteredLogs = allLogs.filter((log)=>{
                const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
                return logDateTime >= twentyFourHoursAgo && logDateTime <= now;
            });
        } else if (timeFilter === '7d') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            filteredLogs = allLogs.filter((log)=>new Date(log.log_date) >= sevenDaysAgo);
        } else if (timeFilter === '30d') {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            filteredLogs = allLogs.filter((log)=>new Date(log.log_date) >= thirtyDaysAgo);
        }
        return filteredLogs.length > 0;
    };
    // Find the best time filter with data
    const findBestTimeFilter = ()=>{
        const timeFilters = [
            '24h',
            '7d',
            '30d',
            'all'
        ];
        for (const filter of timeFilters){
            if (hasDataForTimeFilter(filter)) {
                return filter;
            }
        }
        return '24h'; // fallback
    };
    // Find equipment that is out of range
    const findOutOfRangeEquipment = ()=>{
        return equipment.find((item)=>{
            const status = getEquipmentStatus(item);
            return status.status === 'out-of-range';
        });
    };
    const getEquipmentStatus = (equipment)=>{
        const logs = getFilteredLogs(equipment);
        if (logs.length === 0) return {
            status: 'no-data',
            color: 'text-gray-400'
        };
        const latestLog = logs[logs.length - 1];
        const latestTemp = latestLog.temperature_celsius;
        if (equipment.min_temp_celsius === null || equipment.max_temp_celsius === null) {
            return {
                status: 'no-thresholds',
                color: 'text-blue-400'
            };
        }
        const inRange = latestTemp >= equipment.min_temp_celsius && latestTemp <= equipment.max_temp_celsius;
        return {
            status: inRange ? 'in-range' : 'out-of-range',
            color: inRange ? 'text-green-400' : 'text-red-400',
            temperature: latestTemp
        };
    };
    // Show loading skeleton if data isn't ready
    if (!isLoaded) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] flex flex-wrap gap-2",
                    children: [
                        '24h',
                        '7d',
                        '30d',
                        'all'
                    ].map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-2 rounded-xl bg-gray-700 w-20 h-8"
                        }, filter, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingSkeleton"], {
                        variant: "card",
                        count: 6,
                        height: "80px"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingSkeleton"], {
                        variant: "chart",
                        count: 3,
                        height: "320px"
                    }, void 0, false, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                    lineNumber: 173,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
            lineNumber: 159,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] flex flex-wrap gap-2",
                children: isLoaded ? [
                    '24h',
                    '7d',
                    '30d',
                    'all'
                ].map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setTimeFilter(filter);
                            setHasManuallyChangedFilter(true);
                        },
                        className: `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${timeFilter === filter ? 'bg-[#29E7CD] text-black' : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#2a2a2a]'}`,
                        children: t(`timeFilter.${filter}`, filter === '24h' ? 'Last 24h' : filter === '7d' ? 'Last 7 Days' : filter === '30d' ? 'Last 30 Days' : 'All Time')
                    }, filter, false, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                        lineNumber: 186,
                        columnNumber: 13
                    }, this)) : // Loading skeleton for time filter buttons
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingSkeleton"], {
                    variant: "button",
                    count: 4
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                    lineNumber: 201,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `grid gap-3 ${equipment.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : equipment.length <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : equipment.length <= 6 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : equipment.length <= 12 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}`,
                children: isLoaded ? equipment.map((item)=>{
                    const status = getEquipmentStatus(item);
                    const logs = getFilteredLogs(item);
                    const isOutOfRange = status.status === 'out-of-range';
                    const needsSetup = status.status === 'no-thresholds';
                    const isSelected = selectedEquipmentId === item.id;
                    const isCompact = equipment.length > 6;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSelectedEquipmentId(item.id),
                        className: `group bg-[#1f1f1f] rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 text-left w-full ${isCompact ? 'p-3' : 'p-4'} ${isSelected ? 'border-[#29E7CD] ring-2 ring-[#29E7CD]/20 bg-[#29E7CD]/5' : isOutOfRange ? 'border-red-500/50 hover:border-red-500' : needsSetup ? 'border-yellow-500/50 hover:border-yellow-500' : 'border-[#2a2a2a] hover:border-[#29E7CD]/50'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-center justify-between ${isCompact ? 'mb-2' : 'mb-3'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: `font-semibold text-white truncate group-hover:text-[#29E7CD] transition-colors ${isCompact ? 'text-xs' : 'text-sm'}`,
                                            children: item.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                            lineNumber: 240,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-1.5 mt-0.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `rounded-full ${isCompact ? 'w-1 h-1' : 'w-1.5 h-1.5'} ${isOutOfRange ? 'bg-red-500' : needsSetup ? 'bg-yellow-500' : 'bg-green-500'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `font-medium ${isCompact ? 'text-xs' : 'text-xs'} ${isOutOfRange ? 'text-red-400' : needsSetup ? 'text-yellow-400' : 'text-green-400'}`,
                                                    children: status.status === 'no-data' ? 'No Data' : status.status === 'no-thresholds' ? 'Setup Required' : status.status === 'in-range' ? 'In Range' : 'Out of Range'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                            lineNumber: 245,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                    lineNumber: 239,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                lineNumber: 238,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: isCompact ? 'mb-2' : 'mb-3',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `font-bold text-white ${isCompact ? 'text-lg mb-1' : 'text-2xl mb-1'}`,
                                        children: status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                        lineNumber: 270,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: [
                                            logs.length,
                                            " readings ",
                                            isCompact ? '' : `• ${timeFilter.toUpperCase()}`
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                        lineNumber: 273,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                lineNumber: 269,
                                columnNumber: 15
                            }, this),
                            !isCompact && (isOutOfRange || needsSetup) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-3 border-t border-[#2a2a2a]",
                                children: [
                                    isOutOfRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1.5 text-red-400 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "⚠️"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                                lineNumber: 283,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Attention required"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                                lineNumber: 284,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                        lineNumber: 282,
                                        columnNumber: 21
                                    }, this),
                                    needsSetup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1.5 text-yellow-400 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "⚙️"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                                lineNumber: 289,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Configure thresholds"
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                                lineNumber: 290,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                        lineNumber: 288,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                lineNumber: 280,
                                columnNumber: 17
                            }, this),
                            isCompact && isOutOfRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center text-red-400 text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "⚠️"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                    lineNumber: 299,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                                lineNumber: 298,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                        lineNumber: 222,
                        columnNumber: 13
                    }, this);
                }) : // Loading skeleton for equipment cards
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingSkeleton"], {
                    variant: "card",
                    count: 6,
                    height: "80px"
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                    lineNumber: 306,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            !isLoaded ? // Loading skeleton for chart
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$LoadingSkeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingSkeleton"], {
                variant: "chart",
                height: "320px"
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                lineNumber: 313,
                columnNumber: 9
            }, this) : equipment.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] w-full h-64 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400",
                    children: "No equipment found to display analytics."
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                    lineNumber: 316,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                lineNumber: 315,
                columnNumber: 9
            }, this) : selectedEquipmentId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chart-container",
                children: (()=>{
                    const selectedEquipment = getSelectedEquipment();
                    if (!selectedEquipment) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$CleanTemperatureChart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        logs: getFilteredLogs(selectedEquipment),
                        equipment: selectedEquipment,
                        timeFilter: timeFilter
                    }, selectedEquipment.id, false, {
                        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                        lineNumber: 325,
                        columnNumber: 15
                    }, this);
                })()
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                lineNumber: 319,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] w-full h-64 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-4xl mb-4",
                            children: "📊"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                            lineNumber: 337,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 mb-2",
                            children: "Select an equipment to view its temperature chart"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                            lineNumber: 338,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500",
                            children: "Click on any equipment card above to see detailed analytics"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                            lineNumber: 339,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                    lineNumber: 336,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
                lineNumber: 335,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
}),
"[project]/hooks/useTemperatureWarnings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTemperatureWarnings",
    ()=>useTemperatureWarnings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$GlobalWarningContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/GlobalWarningContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const useTemperatureWarnings = ({ allLogs, equipment })=>{
    const { addWarning } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$GlobalWarningContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGlobalWarning"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check for "no food items temped today" warning
        const checkFoodTemperatureWarning = ()=>{
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            // Filter logs for today
            const todayLogs = allLogs.filter((log)=>log.log_date === todayString);
            // Check if there are any food temperature logs for today
            const foodLogsToday = todayLogs.filter((log)=>log.temperature_type === 'food' || log.temperature_type === 'Food');
            // If no food items were temped today, show warning
            if (foodLogsToday.length === 0 && allLogs.length > 0) {
                addWarning({
                    type: 'warning',
                    title: 'Temperature Monitoring Alert',
                    message: 'No food items have been temperature checked today. Ensure all food items are properly monitored for safety compliance.',
                    action: {
                        label: 'Go to Temperature Logs',
                        onClick: ()=>{
                            window.location.href = '/webapp/temperature';
                        }
                    },
                    dismissible: true,
                    autoHide: false
                });
            }
        };
        // Check for equipment that hasn't been temperature checked in the last 8 hours
        const checkEquipmentTemperatureWarning = ()=>{
            const now = new Date();
            const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000); // 8 hours ago
            // Filter logs from the last 8 hours
            const recentLogs = allLogs.filter((log)=>{
                const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
                return logDateTime >= eightHoursAgo && logDateTime <= now;
            });
            // Get active equipment that should be monitored
            const activeEquipment = equipment.filter((eq)=>eq.is_active && eq.location);
            if (activeEquipment.length === 0) {
                return;
            }
            // Check which equipment has been temperature checked in the last 8 hours
            const checkedEquipment = new Set();
            recentLogs.forEach((log)=>{
                if (log.location) {
                    checkedEquipment.add(log.location);
                }
            });
            // Find equipment that hasn't been checked in the last 8 hours
            const uncheckedEquipment = activeEquipment.filter((eq)=>eq.location && !checkedEquipment.has(eq.location));
            if (uncheckedEquipment.length > 0) {
                const equipmentNames = uncheckedEquipment.map((eq)=>eq.name).join(', ');
                const isMultiple = uncheckedEquipment.length > 1;
                addWarning({
                    type: 'warning',
                    title: 'Equipment Temperature Check Required',
                    message: `${isMultiple ? 'Equipment' : 'Equipment'} ${equipmentNames} ${isMultiple ? 'have' : 'has'} not been temperature checked in the last 8 hours. Ensure all active equipment is monitored for safety compliance.`,
                    action: {
                        label: 'Go to Temperature Logs',
                        onClick: ()=>{
                            window.location.href = '/webapp/temperature';
                        }
                    },
                    dismissible: true,
                    autoHide: false
                });
            }
        };
        // Check for equipment out of range warnings
        const checkEquipmentWarnings = ()=>{
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            const todayLogs = allLogs.filter((log)=>log.log_date === todayString);
            equipment.forEach((eq)=>{
                if (!eq.location || !eq.min_temp_celsius || !eq.max_temp_celsius) return;
                const equipmentLogs = todayLogs.filter((log)=>log.location === eq.location);
                if (equipmentLogs.length > 0) {
                    const outOfRangeLogs = equipmentLogs.filter((log)=>log.temperature_celsius < eq.min_temp_celsius || log.temperature_celsius > eq.max_temp_celsius);
                    if (outOfRangeLogs.length > 0) {
                        addWarning({
                            type: 'error',
                            title: 'Temperature Out of Range',
                            message: `${eq.name} has recorded ${outOfRangeLogs.length} temperature reading(s) outside the safe range (${eq.min_temp_celsius}°C - ${eq.max_temp_celsius}°C).`,
                            action: {
                                label: 'View Details',
                                onClick: ()=>{
                                    window.location.href = '/webapp/temperature';
                                }
                            },
                            dismissible: true,
                            autoHide: false
                        });
                    }
                }
            });
        };
        // Only run checks if we have data
        if (allLogs.length > 0 && equipment.length > 0) {
            checkFoodTemperatureWarning();
            checkEquipmentTemperatureWarning();
            checkEquipmentWarnings();
        }
    }, [
        allLogs,
        equipment,
        addWarning
    ]);
};
}),
"[project]/app/webapp/temperature/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCountryFormatting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useCountryFormatting.ts [app-ssr] (ecmascript)");
// Direct imports to eliminate skeleton flashes
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$TemperatureLogsTab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/webapp/temperature/components/TemperatureLogsTab.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$TemperatureEquipmentTab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/webapp/temperature/components/TemperatureEquipmentTab.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$TemperatureAnalyticsTab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/webapp/temperature/components/TemperatureAnalyticsTab.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemperatureWarnings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useTemperatureWarnings.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function TemperatureLogsPageContent() {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const { formatDate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCountryFormatting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCountryFormatting"])();
    // Helper function to format time strings
    const formatTime = (timeString)=>{
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };
    // Helper function to format date strings
    const formatDateString = (dateString)=>{
        if (!dateString) return '';
        const date = new Date(dateString);
        return formatDate(date);
    };
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allLogs, setAllLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [equipment, setEquipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // Start with false to prevent skeleton showing
    const [isInitialLoad, setIsInitialLoad] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // Start with false to prevent skeleton flash
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('analytics');
    const [quickTempLoading, setQuickTempLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [newLog, setNewLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        log_date: '',
        log_time: '',
        temperature_type: 'fridge',
        temperature_celsius: '',
        location: '',
        notes: '',
        logged_by: ''
    });
    const [showAddLog, setShowAddLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Initialize temperature warnings
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemperatureWarnings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTemperatureWarnings"])({
        allLogs,
        equipment
    });
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
    const fetchLogs = async ()=>{
        try {
            let url = '/api/temperature-logs';
            const params = new URLSearchParams();
            if (selectedDate) params.append('date', selectedDate);
            if (selectedType !== 'all') params.append('type', selectedType);
            if (params.toString()) url += `?${params.toString()}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                // If no data for selected date, automatically switch to most recent date with data
                if (data.data.length === 0 && allLogs.length > 0) {
                    const datesWithLogs = [
                        ...new Set(allLogs.map((log)=>log.log_date))
                    ].sort().reverse();
                    if (datesWithLogs.length > 0) {
                        const mostRecentDate = datesWithLogs[0];
                        console.log(`No data for ${selectedDate}, switching to ${mostRecentDate}`);
                        setSelectedDate(mostRecentDate);
                        // Fetch logs for the most recent date
                        const fallbackUrl = `/api/temperature-logs?date=${mostRecentDate}${selectedType !== 'all' ? `&type=${selectedType}` : ''}`;
                        const fallbackResponse = await fetch(fallbackUrl);
                        const fallbackData = await fallbackResponse.json();
                        if (fallbackData.success) {
                            setLogs(fallbackData.data);
                        }
                        return;
                    }
                }
                setLogs(data.data);
            }
        } catch (error) {
            console.error('fetchLogs - Error:', error);
        }
    };
    const fetchAllLogs = async ()=>{
        try {
            const response = await fetch('/api/temperature-logs');
            const data = await response.json();
            console.log('fetchAllLogs - API response:', data);
            if (data.success && data.data) {
                console.log('fetchAllLogs - Setting allLogs:', data.data.length, 'logs');
                setAllLogs(data.data);
            }
        } catch (error) {
            console.error('fetchAllLogs - Error:', error);
        }
    };
    const fetchEquipment = async ()=>{
        try {
            const response = await fetch('/api/temperature-equipment');
            const data = await response.json();
            console.log('fetchEquipment - API response:', data);
            if (data.success) {
                console.log('fetchEquipment - Setting equipment:', data.data.length, 'equipment');
                setEquipment(data.data);
            }
        } catch (error) {
            console.error('fetchEquipment - Error:', error);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Initialize date/time values on client side to prevent hydration mismatch
        const now = new Date();
        setSelectedDate(now.toISOString().split('T')[0]);
        setNewLog((prev)=>({
                ...prev,
                log_date: now.toISOString().split('T')[0],
                log_time: now.toTimeString().split(' ')[0].substring(0, 5)
            }));
    }, []);
    // Set default date to most recent date with data after initial load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (allLogs.length > 0 && !isInitialLoad) {
            // Find the most recent date with logs
            const datesWithLogs = [
                ...new Set(allLogs.map((log)=>log.log_date))
            ].sort().reverse();
            if (datesWithLogs.length > 0) {
                setSelectedDate(datesWithLogs[0]);
                setIsInitialLoad(true); // Mark as processed
            }
        }
    }, [
        allLogs,
        isInitialLoad
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadData = async ()=>{
            try {
                setLoading(true);
                // Load all data in parallel for better performance
                await Promise.all([
                    fetchLogs(),
                    fetchEquipment(),
                    fetchAllLogs()
                ]);
            // No artificial delay needed
            } catch (error) {
                console.error('Error loading temperature data:', error);
            } finally{
                setLoading(false);
            }
        };
        loadData();
    }, []);
    // Watch for changes in selectedDate or selectedType and refetch logs
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedDate) {
            fetchLogs();
        }
    }, [
        selectedDate,
        selectedType
    ]);
    const handleAddLog = async (e)=>{
        e.preventDefault();
        try {
            const response = await fetch('/api/temperature-logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newLog,
                    temperature_celsius: parseFloat(newLog.temperature_celsius)
                })
            });
            const data = await response.json();
            if (data.success) {
                setNewLog({
                    log_date: new Date().toISOString().split('T')[0],
                    log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
                    temperature_type: 'fridge',
                    temperature_celsius: '',
                    location: '',
                    notes: '',
                    logged_by: ''
                });
                setShowAddLog(false);
                fetchLogs();
                fetchAllLogs();
            }
        } catch (error) {
        // Handle add log error gracefully
        }
    };
    const handleDeleteLog = async (logId)=>{
        try {
            const response = await fetch(`/api/temperature-logs/${logId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchLogs();
                fetchAllLogs();
            }
        } catch (error) {
        // Handle delete error gracefully
        }
    };
    const handleQuickTempLog = async (equipmentId, equipmentName, equipmentType)=>{
        setQuickTempLoading((prev)=>({
                ...prev,
                [equipmentId]: true
            }));
        try {
            const response = await fetch('/api/temperature-logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    log_date: new Date().toISOString().split('T')[0],
                    log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
                    temperature_type: equipmentType,
                    temperature_celsius: 0,
                    location: equipmentName,
                    notes: 'Quick log',
                    logged_by: 'System'
                })
            });
            const data = await response.json();
            if (data.success) {
                fetchLogs();
                fetchAllLogs();
            }
        } catch (error) {
            // Handle logging error gracefully
            alert('Failed to log temperature. Please try again.');
        } finally{
            setQuickTempLoading((prev)=>({
                    ...prev,
                    [equipmentId]: false
                }));
        }
    };
    const handleUpdateEquipment = async (equipmentId, updates)=>{
        try {
            const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            const data = await response.json();
            if (data.success) {
                fetchEquipment();
            }
        } catch (error) {
        // Handle update error gracefully
        }
    };
    const handleCreateEquipment = async (name, equipmentType, location, minTemp, maxTemp)=>{
        try {
            const response = await fetch('/api/temperature-equipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    equipment_type: equipmentType,
                    location,
                    min_temp_celsius: minTemp,
                    max_temp_celsius: maxTemp,
                    is_active: true
                })
            });
            const data = await response.json();
            if (data.success) {
                fetchEquipment();
            }
        } catch (error) {
        // Handle create error gracefully
        }
    };
    const handleDeleteEquipment = async (equipmentId)=>{
        try {
            const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchEquipment();
            }
        } catch (error) {
        // Handle delete error gracefully
        }
    };
    const getTypeIcon = (type)=>{
        const typeInfo = temperatureTypes.find((t)=>t.value === type);
        return typeInfo?.icon || '🌡️';
    };
    const getTypeLabel = (type)=>{
        const typeInfo = temperatureTypes.find((t)=>t.value === type);
        return typeInfo?.label || type;
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
        const logDateTime = new Date(`${logDate}T${logTime}`);
        const now = new Date();
        const hoursInDangerZone = (now.getTime() - logDateTime.getTime()) / (1000 * 60 * 60);
        if (hoursInDangerZone < 2) {
            return {
                status: 'safe',
                message: `${(2 - hoursInDangerZone).toFixed(1)}h remaining - can refrigerate`,
                color: 'text-green-400',
                icon: '✅'
            };
        } else if (hoursInDangerZone < 4) {
            return {
                status: 'warning',
                message: `${(4 - hoursInDangerZone).toFixed(1)}h remaining - use immediately`,
                color: 'text-yellow-400',
                icon: '⚠️'
            };
        } else {
            return {
                status: 'danger',
                message: `${hoursInDangerZone.toFixed(1)}h in danger zone - DISCARD`,
                color: 'text-red-400',
                icon: '🚨'
            };
        }
    };
    // Only show content when data is ready
    if (equipment.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#0a0a0a] p-4 sm:p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto"
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/page.tsx",
                lineNumber: 379,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/webapp/temperature/page.tsx",
            lineNumber: 378,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#0a0a0a] p-4 sm:p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold text-white mb-2",
                            children: [
                                "🌡️ ",
                                t('temperature.title', 'Temperature Logs')
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 392,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: t('temperature.subtitle', 'Track fridge, freezer, and food temperatures for food safety compliance')
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 395,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 391,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-1 bg-[#1f1f1f] p-1 rounded-2xl border border-[#2a2a2a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('logs'),
                                className: `px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${activeTab === 'logs' ? 'bg-[#29E7CD] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`,
                                "aria-pressed": activeTab === 'logs',
                                "aria-label": "View temperature logs",
                                children: [
                                    "📝 ",
                                    t('temperature.logs', 'Logs')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 401,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('equipment'),
                                className: `px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${activeTab === 'equipment' ? 'bg-[#29E7CD] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`,
                                "aria-pressed": activeTab === 'equipment',
                                "aria-label": "View temperature equipment",
                                children: [
                                    "🏭 ",
                                    t('temperature.equipment', 'Equipment')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 413,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('analytics'),
                                className: `px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${activeTab === 'analytics' ? 'bg-[#29E7CD] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`,
                                "aria-pressed": activeTab === 'analytics',
                                "aria-label": "View temperature analytics",
                                children: [
                                    "📊 ",
                                    t('temperature.analytics', 'Analytics')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 425,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/page.tsx",
                        lineNumber: 400,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 399,
                    columnNumber: 9
                }, this),
                activeTab === 'logs' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$TemperatureLogsTab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    logs: logs,
                    equipment: equipment,
                    selectedDate: selectedDate,
                    setSelectedDate: setSelectedDate,
                    selectedType: selectedType,
                    setSelectedType: setSelectedType,
                    showAddLog: showAddLog,
                    setShowAddLog: setShowAddLog,
                    newLog: newLog,
                    setNewLog: setNewLog,
                    onAddLog: handleAddLog,
                    onRefreshLogs: fetchLogs
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 442,
                    columnNumber: 11
                }, this),
                activeTab === 'equipment' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$TemperatureEquipmentTab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    equipment: equipment,
                    quickTempLoading: quickTempLoading,
                    onUpdateEquipment: handleUpdateEquipment,
                    onCreateEquipment: handleCreateEquipment,
                    onDeleteEquipment: handleDeleteEquipment,
                    onQuickTempLog: handleQuickTempLog
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 459,
                    columnNumber: 11
                }, this),
                activeTab === 'analytics' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$webapp$2f$temperature$2f$components$2f$TemperatureAnalyticsTab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    allLogs: allLogs,
                    equipment: equipment
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 471,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/temperature/page.tsx",
            lineNumber: 388,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/webapp/temperature/page.tsx",
        lineNumber: 387,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_8d6a9bbf._.js.map