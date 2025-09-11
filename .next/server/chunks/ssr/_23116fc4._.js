module.exports = {

"[project]/hooks/useCountryFormatting.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "useCountryFormatting": ()=>useCountryFormatting
});
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
"[project]/app/webapp/temperature/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>TemperatureLogsPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useTranslation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCountryFormatting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useCountryFormatting.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
;
'use client';
;
;
;
;
;
// Lazy load the synchronized chart component for better performance
const SynchronizedChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/app/webapp/temperature/components/SynchronizedChart.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-64 bg-[#1f1f1f] rounded-3xl animate-pulse flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-400",
                children: "Loading chart..."
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/page.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/webapp/temperature/page.tsx",
            lineNumber: 11,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    ssr: false
});
function TemperatureLogsPage() {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useTranslation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const { formatDate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCountryFormatting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCountryFormatting"])();
    // Helper function to format time strings
    const formatTime = (timeString)=>{
        if (!timeString) return '';
        // Convert time string (HH:MM:SS) to a readable format
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
    const [allLogs, setAllLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]); // All logs for analytics
    const [thresholds, setThresholds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [equipment, setEquipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('logs');
    const [quickTempInputs, setQuickTempInputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [quickTempLoading, setQuickTempLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [quickTempConfirmations, setQuickTempConfirmations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [timeFilter, setTimeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all'); // '1week', '1month', '3months', 'all'
    const [dateOffset, setDateOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0); // For date scrolling
    const [showAddLog, setShowAddLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().split('T')[0]);
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [newLog, setNewLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        log_date: new Date().toISOString().split('T')[0],
        log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        temperature_type: 'fridge',
        temperature_celsius: '',
        location: '',
        notes: '',
        logged_by: ''
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchLogs();
        fetchThresholds();
        fetchEquipment();
        fetchAllLogs(); // Fetch all logs for analytics
    }, [
        selectedDate,
        selectedType
    ]);
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
                setLogs(data.data);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally{
            setLoading(false);
        }
    };
    const fetchAllLogs = async ()=>{
        try {
            const response = await fetch('/api/temperature-logs');
            const data = await response.json();
            if (data.success) {
                setAllLogs(data.data);
            }
        } catch (error) {
            console.error('Error fetching all logs:', error);
        }
    };
    const fetchThresholds = async ()=>{
        try {
            const response = await fetch('/api/temperature-thresholds');
            const data = await response.json();
            if (data.success) {
                setThresholds(data.data);
            }
        } catch (error) {
            console.error('Error fetching thresholds:', error);
        }
    };
    const fetchEquipment = async ()=>{
        try {
            const response = await fetch('/api/temperature-equipment');
            const data = await response.json();
            if (data.success) {
                setEquipment(data.data);
            }
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    };
    const checkCoolingOffPeriod = (equipmentName, coolingOffMinutes = 5)=>{
        const now = new Date();
        const cutoffTime = new Date(now.getTime() - coolingOffMinutes * 60 * 1000);
        // Check if there's a recent log for this equipment
        const recentLog = logs.find((log)=>log.location === equipmentName && new Date(`${log.log_date}T${log.log_time}`) > cutoffTime);
        return recentLog;
    };
    const handleQuickTempLog = async (equipmentId, equipmentName, equipmentType)=>{
        const tempValue = quickTempInputs[equipmentId];
        if (!tempValue || isNaN(parseFloat(tempValue))) {
            alert('Please enter a valid temperature');
            return;
        }
        // Check cooling off period (5 minutes default)
        const recentLog = checkCoolingOffPeriod(equipmentName, 5);
        if (recentLog) {
            const timeDiff = Math.ceil((new Date().getTime() - new Date(`${recentLog.log_date}T${recentLog.log_time}`).getTime()) / (1000 * 60));
            const remainingTime = 5 - timeDiff;
            alert(`Please wait ${remainingTime} more minute(s) before logging another temperature for this equipment. Last logged at ${recentLog.log_time}.`);
            return;
        }
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
                    temperature_celsius: parseFloat(tempValue),
                    location: equipmentName,
                    notes: 'Quick log',
                    logged_by: 'Staff'
                })
            });
            const data = await response.json();
            if (data.success) {
                // Clear the input
                setQuickTempInputs((prev)=>({
                        ...prev,
                        [equipmentId]: ''
                    }));
                // Show confirmation message
                setQuickTempConfirmations((prev)=>({
                        ...prev,
                        [equipmentId]: {
                            message: `${tempValue}°C logged successfully! Next entry allowed in 5 minutes.`,
                            timestamp: Date.now()
                        }
                    }));
                // Auto-hide confirmation after 3 seconds
                setTimeout(()=>{
                    setQuickTempConfirmations((prev)=>{
                        const newState = {
                            ...prev
                        };
                        delete newState[equipmentId];
                        return newState;
                    });
                }, 3000);
                // Refresh logs
                fetchLogs();
            } else {
                alert('Failed to log temperature: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error logging temperature:', error);
            alert('Failed to log temperature. Please try again.');
        } finally{
            setQuickTempLoading((prev)=>({
                    ...prev,
                    [equipmentId]: false
                }));
        }
    };
    const handleAddLog = async (e)=>{
        e.preventDefault();
        // Check cooling off period if location is specified
        if (newLog.location) {
            const recentLog = checkCoolingOffPeriod(newLog.location, 5);
            if (recentLog) {
                const timeDiff = Math.ceil((new Date().getTime() - new Date(`${recentLog.log_date}T${recentLog.log_time}`).getTime()) / (1000 * 60));
                const remainingTime = 5 - timeDiff;
                alert(`Please wait ${remainingTime} more minute(s) before logging another temperature for this equipment. Last logged at ${recentLog.log_time}.`);
                return;
            }
        }
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
                setLogs([
                    data.data,
                    ...logs
                ]);
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
            }
        } catch (error) {
            console.error('Error adding log:', error);
        }
    };
    const getTemperatureStatus = (temp, type)=>{
        const threshold = thresholds.find((t)=>t.temperature_type === type);
        if (!threshold || !threshold.alert_enabled) return 'normal';
        if (threshold.min_temp_celsius && temp < threshold.min_temp_celsius) return 'low';
        if (threshold.max_temp_celsius && temp > threshold.max_temp_celsius) return 'high';
        return 'normal';
    };
    const getFoodSafetyStatus = (temp, logTime, logDate, type)=>{
        // Only apply to food items in danger zone (5°C to 60°C)
        if (type !== 'food_cooking' && type !== 'food_hot_holding' && type !== 'food_cold_holding') {
            return null; // Not a food item
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
        // Sort periods by time of day
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
    const filterLogsByTimePeriod = (logs, timeFilter, offset = 0)=>{
        if (timeFilter === 'all') return logs;
        const now = new Date();
        const startDate = new Date();
        const endDate = new Date();
        switch(timeFilter){
            case '1week':
                startDate.setDate(now.getDate() - 7 + offset);
                endDate.setDate(now.getDate() + offset);
                break;
            case '1month':
                startDate.setMonth(now.getMonth() - 1 + offset);
                endDate.setMonth(now.getMonth() + offset);
                break;
            case '3months':
                startDate.setMonth(now.getMonth() - 3 + offset);
                endDate.setMonth(now.getMonth() + offset);
                break;
            default:
                return logs;
        }
        // Set time to start of day for accurate comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return logs.filter((log)=>{
            const logDate = new Date(log.log_date);
            logDate.setHours(0, 0, 0, 0);
            return logDate >= startDate && logDate <= endDate;
        });
    };
    const getDateRangeForFilter = (timeFilter, offset = 0)=>{
        const now = new Date();
        const startDate = new Date();
        switch(timeFilter){
            case '1week':
                startDate.setDate(now.getDate() - 7 + offset);
                break;
            case '1month':
                startDate.setMonth(now.getMonth() - 1 + offset);
                break;
            case '3months':
                startDate.setMonth(now.getMonth() - 3 + offset);
                break;
            default:
                return {
                    start: null,
                    end: null
                };
        }
        const endDate = new Date(now);
        endDate.setDate(now.getDate() + offset);
        return {
            start: startDate,
            end: endDate
        };
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#0a0a0a] p-4 sm:p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 bg-[#2a2a2a] rounded-3xl w-1/3 mb-8"
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 459,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                            children: [
                                ...Array(4)
                            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 bg-[#2a2a2a] rounded-xl w-3/4 mb-3"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 463,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-20 bg-[#2a2a2a] rounded-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 464,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 462,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 460,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 458,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/webapp/temperature/page.tsx",
                lineNumber: 457,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/webapp/temperature/page.tsx",
            lineNumber: 456,
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
                            lineNumber: 479,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: t('temperature.subtitle', 'Track fridge, freezer, and food temperatures for food safety compliance')
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 482,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 478,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-1 bg-[#1f1f1f] p-1 rounded-2xl border border-[#2a2a2a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('logs'),
                                className: `px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'logs' ? 'bg-[#29E7CD] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`,
                                children: [
                                    "📊 ",
                                    t('temperature.logs', 'Temperature Logs')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 488,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('equipment'),
                                className: `px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'equipment' ? 'bg-[#29E7CD] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`,
                                children: [
                                    "🧊 ",
                                    t('temperature.equipment', 'Equipment')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 498,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('analytics'),
                                className: `px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'analytics' ? 'bg-[#29E7CD] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`,
                                children: [
                                    "📊 ",
                                    t('temperature.analytics', 'Analytics')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 508,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('thresholds'),
                                className: `px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'thresholds' ? 'bg-[#29E7CD] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`,
                                children: [
                                    "⚙️ ",
                                    t('temperature.thresholds', 'Temperature Thresholds')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 518,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/webapp/temperature/page.tsx",
                        lineNumber: 487,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 486,
                    columnNumber: 9
                }, this),
                activeTab === 'logs' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 19
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
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 549,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 540,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: selectedDate,
                                                            onChange: (e)=>setSelectedDate(e.target.value),
                                                            className: "px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 551,
                                                            columnNumber: 21
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
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 566,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                setSelectedDate(new Date().toISOString().split('T')[0]);
                                                            },
                                                            className: "bg-[#29E7CD]/10 text-[#29E7CD] px-3 py-2 rounded-xl hover:bg-[#29E7CD]/20 transition-all duration-200 text-sm font-medium",
                                                            title: "Go to today",
                                                            children: "Today"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 568,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 539,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 537,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: t('temperature.filterEquipment', 'Filter by Equipment')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 19
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
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 586,
                                                            columnNumber: 21
                                                        }, this),
                                                        equipment.filter((eq)=>eq.is_active).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: item.equipment_type,
                                                                children: [
                                                                    getTypeIcon(item.equipment_type),
                                                                    " ",
                                                                    item.name
                                                                ]
                                                            }, item.id, true, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 590,
                                                                columnNumber: 23
                                                            }, this)),
                                                        temperatureTypes.filter((type)=>type.value === 'food_cooking' || type.value === 'food_hot_holding' || type.value === 'food_cold_holding').map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: type.value,
                                                                children: [
                                                                    type.icon,
                                                                    " ",
                                                                    type.label
                                                                ]
                                                            }, type.value, true, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 601,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 581,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 579,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 536,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAddLog(true),
                                    className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200",
                                    children: [
                                        "➕ ",
                                        t('temperature.addLog', 'Add Temperature Log')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 608,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 535,
                            columnNumber: 13
                        }, this),
                        showAddLog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-2",
                                    children: t('temperature.addNewLog', 'Add New Temperature Log')
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 619,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-400 mb-4",
                                    children: "💡 You can log multiple temperatures per day for the same equipment (e.g., morning and evening checks). There's a 5-minute cooling off period between entries for the same equipment."
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 620,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4 p-4 bg-blue-400/10 border border-blue-400/20 rounded-2xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-semibold text-blue-400 mb-2",
                                            children: "🍽️ Queensland 2-Hour/4-Hour Rule"
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 624,
                                            columnNumber: 19
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
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 626,
                                                            columnNumber: 26
                                                        }, this),
                                                        " in danger zone (5°C-60°C): Can refrigerate for later use"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 626,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        "• ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-yellow-400",
                                                            children: "2-4 hours"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 627,
                                                            columnNumber: 26
                                                        }, this),
                                                        " in danger zone: Must use immediately"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 627,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        "• ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-400",
                                                            children: "4+ hours"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 628,
                                                            columnNumber: 26
                                                        }, this),
                                                        " in danger zone: Must discard"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 628,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 625,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 623,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleAddLog,
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: t('temperature.date', 'Date')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 633,
                                                    columnNumber: 21
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
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 634,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 632,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: t('temperature.time', 'Time')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 643,
                                                    columnNumber: 21
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
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 644,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 642,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: t('temperature.equipment', 'Equipment')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 653,
                                                    columnNumber: 21
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
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 667,
                                                            columnNumber: 23
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
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 671,
                                                                columnNumber: 25
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
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 682,
                                                                columnNumber: 25
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 652,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: t('temperature.temperature', 'Temperature (°C)')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 689,
                                                    columnNumber: 21
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
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 690,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 688,
                                            columnNumber: 19
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
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 701,
                                                    columnNumber: 21
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
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 707,
                                                    columnNumber: 21
                                                }, this),
                                                [
                                                    'food_cooking',
                                                    'food_hot_holding',
                                                    'food_cold_holding'
                                                ].includes(newLog.temperature_type) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-400 mt-1",
                                                    children: "💡 Specify the exact food item for proper 2-hour/4-hour rule tracking"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 720,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 700,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: t('temperature.loggedBy', 'Logged By')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 726,
                                                    columnNumber: 21
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
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 727,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 725,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: t('temperature.notes', 'Notes')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 736,
                                                    columnNumber: 21
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
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 737,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 735,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-2 flex space-x-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    className: "bg-[#29E7CD] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200",
                                                    children: t('temperature.save', 'Save Log')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 746,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setShowAddLog(false),
                                                    className: "bg-[#2a2a2a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200",
                                                    children: t('temperature.cancel', 'Cancel')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 752,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 745,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 631,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 618,
                            columnNumber: 15
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
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 769,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                        lineNumber: 768,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-semibold text-white mb-2",
                                        children: t('temperature.noLogs', 'No Temperature Logs')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                        lineNumber: 771,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400",
                                        children: t('temperature.noLogsDesc', 'Start logging temperatures to ensure food safety compliance')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                        lineNumber: 772,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 767,
                                columnNumber: 17
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
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 780,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 779,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-lg font-semibold text-white",
                                                            children: timeGroup.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 783,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-400",
                                                            children: [
                                                                timeGroup.logs.length,
                                                                " temperature reading",
                                                                timeGroup.logs.length !== 1 ? 's' : ''
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 784,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 782,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 778,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: timeGroup.logs.map((log)=>{
                                                const status = getTemperatureStatus(log.temperature_celsius, log.temperature_type);
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
                                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                                lineNumber: 798,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                            lineNumber: 797,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                    className: "text-lg font-semibold text-white",
                                                                                    children: log.location || getTypeLabel(log.temperature_type)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                                    lineNumber: 801,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center space-x-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-sm text-gray-400",
                                                                                            children: log.log_time
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                                            lineNumber: 803,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs text-gray-500",
                                                                                            children: "•"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                                            lineNumber: 804,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs text-gray-500",
                                                                                            children: getTypeLabel(log.temperature_type)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                                            lineNumber: 805,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                                    lineNumber: 802,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                            lineNumber: 800,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                    lineNumber: 796,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center space-x-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`,
                                                                            children: status === 'high' ? '⚠️ High' : status === 'low' ? '⚠️ Low' : '✅ Normal'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                            lineNumber: 810,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xl font-bold text-[#29E7CD]",
                                                                            children: [
                                                                                log.temperature_celsius,
                                                                                "°C"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                            lineNumber: 813,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                    lineNumber: 809,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 795,
                                                            columnNumber: 29
                                                        }, this),
                                                        log.location && log.location !== getTypeLabel(log.temperature_type) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-300 text-sm mb-2",
                                                            children: [
                                                                "📍 ",
                                                                log.location
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 820,
                                                            columnNumber: 31
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
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 824,
                                                            columnNumber: 31
                                                        }, this),
                                                        log.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-300 text-sm mb-3",
                                                            children: log.notes
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 828,
                                                            columnNumber: 31
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
                                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                        lineNumber: 835,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: `text-sm font-medium ${foodSafety.color}`,
                                                                                children: "Queensland 2-Hour/4-Hour Rule"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                                lineNumber: 837,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: `text-xs ${foodSafety.color}`,
                                                                                children: foodSafety.message
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                                lineNumber: 840,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                        lineNumber: 836,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 834,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 833,
                                                            columnNumber: 31
                                                        }, this),
                                                        log.photo_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: log.photo_url,
                                                                alt: "Temperature reading",
                                                                className: "w-24 h-24 object-cover rounded-xl border border-[#2a2a2a]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 850,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 849,
                                                            columnNumber: 31
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
                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                    lineNumber: 859,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "bg-[#2a2a2a] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#3a3a3a] transition-all duration-200 text-sm",
                                                                    children: [
                                                                        "✏️ ",
                                                                        t('temperature.edit', 'Edit')
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                    lineNumber: 862,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 858,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, log.id, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 794,
                                                    columnNumber: 27
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 789,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, timeGroup.period, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 776,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 765,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 533,
                    columnNumber: 11
                }, this),
                activeTab === 'equipment' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 882,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-400 mt-1",
                                            children: t('temperature.equipmentDesc', 'Manage your temperature monitoring equipment')
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 883,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 881,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.open('/webapp/setup', '_blank'),
                                    className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200",
                                    children: [
                                        "➕ ",
                                        t('temperature.addEquipment', 'Add Equipment')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 885,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 880,
                            columnNumber: 13
                        }, this),
                        equipment.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-20 h-20 rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center mx-auto mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-4xl",
                                        children: "🧊"
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                        lineNumber: 896,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 895,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-2",
                                    children: t('temperature.noEquipment', 'No Temperature Equipment')
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 898,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400 mb-6",
                                    children: t('temperature.noEquipmentDesc', 'Add temperature monitoring equipment to start logging temperatures')
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 899,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.open('/webapp/setup', '_blank'),
                                    className: "bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200",
                                    children: [
                                        "➕ ",
                                        t('temperature.addFirstEquipment', 'Add Your First Equipment')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 900,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 894,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                            children: equipment.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200",
                                    children: [
                                        quickTempConfirmations[item.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 p-3 bg-green-400/10 border border-green-400/20 rounded-2xl animate-in slide-in-from-top-2 duration-300",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-green-400 text-lg",
                                                        children: "✅"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 915,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-green-400 font-medium text-sm",
                                                        children: quickTempConfirmations[item.id].message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 916,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                lineNumber: 914,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 913,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: getTypeIcon(item.equipment_type)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 926,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 925,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-semibold text-white",
                                                                    children: item.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                    lineNumber: 929,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-400",
                                                                    children: getTypeLabel(item.equipment_type)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                    lineNumber: 930,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 928,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 924,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `px-3 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'}`,
                                                    children: item.is_active ? t('temperature.active', 'Active') : t('temperature.inactive', 'Inactive')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 933,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 923,
                                            columnNumber: 21
                                        }, this),
                                        item.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-300 mb-3",
                                            children: [
                                                "📍 ",
                                                item.location
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 943,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-400 text-sm",
                                                        children: t('temperature.tempRange', 'Temperature Range')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 948,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-semibold",
                                                        children: item.min_temp_celsius && item.max_temp_celsius ? `${item.min_temp_celsius}°C - ${item.max_temp_celsius}°C` : t('temperature.notSet', 'Not Set')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 949,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                lineNumber: 947,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 946,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                                    children: [
                                                        "🌡️ ",
                                                        t('temperature.quickLog', 'Quick Log Temperature')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 960,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-400 mb-2",
                                                    children: "💡 You can log multiple temperatures per day for the same equipment. 5-minute cooling off period between entries."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 963,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            step: "0.1",
                                                            value: quickTempInputs[item.id] || '',
                                                            onChange: (e)=>setQuickTempInputs((prev)=>({
                                                                        ...prev,
                                                                        [item.id]: e.target.value
                                                                    })),
                                                            className: "flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent text-sm",
                                                            placeholder: "e.g., 3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 967,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleQuickTempLog(item.id, item.name, item.equipment_type),
                                                            disabled: quickTempLoading[item.id] || !quickTempInputs[item.id],
                                                            className: "bg-[#29E7CD] text-black px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm",
                                                            children: quickTempLoading[item.id] ? '⏳' : '✅'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 975,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 966,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 959,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex space-x-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setNewLog({
                                                            ...newLog,
                                                            temperature_type: item.equipment_type,
                                                            location: item.name
                                                        });
                                                        setActiveTab('logs');
                                                        setShowAddLog(true);
                                                    },
                                                    className: "flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200",
                                                    children: [
                                                        "📝 ",
                                                        t('temperature.detailedLog', 'Detailed Log')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 986,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>window.open('/webapp/setup', '_blank'),
                                                    className: "bg-[#2a2a2a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200",
                                                    children: [
                                                        "✏️ ",
                                                        t('temperature.edit', 'Edit')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1000,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 985,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 910,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 908,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 879,
                    columnNumber: 11
                }, this),
                activeTab === 'analytics' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-semibold text-white",
                                        children: t('temperature.analytics', 'Temperature Analytics')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                        lineNumber: 1019,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400 mt-1",
                                        children: t('temperature.analyticsDesc', 'Visualize temperature trends and patterns across all equipment')
                                    }, void 0, false, {
                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                        lineNumber: 1020,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 1018,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 1017,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-semibold text-white mb-2",
                                                        children: "📅 Time Period Filter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1029,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400 text-sm",
                                                        children: "Select the time range for temperature data visualization"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1030,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                lineNumber: 1028,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-2",
                                                children: [
                                                    {
                                                        value: '1week',
                                                        label: '1 Week',
                                                        icon: '📅'
                                                    },
                                                    {
                                                        value: '1month',
                                                        label: '1 Month',
                                                        icon: '📆'
                                                    },
                                                    {
                                                        value: '3months',
                                                        label: '3 Months',
                                                        icon: '🗓️'
                                                    },
                                                    {
                                                        value: 'all',
                                                        label: 'All Time',
                                                        icon: '⏰'
                                                    }
                                                ].map((period)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setTimeFilter(period.value);
                                                            setDateOffset(0); // Reset offset when changing filter
                                                        },
                                                        className: `px-4 py-2 rounded-xl font-medium transition-all duration-200 ${timeFilter === period.value ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black shadow-lg' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] hover:text-white'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "mr-2",
                                                                children: period.icon
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 1051,
                                                                columnNumber: 25
                                                            }, this),
                                                            period.label
                                                        ]
                                                    }, period.value, true, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1039,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                lineNumber: 1032,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                        lineNumber: 1027,
                                        columnNumber: 17
                                    }, this),
                                    timeFilter !== 'all' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center space-x-4 pt-4 border-t border-[#2a2a2a]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setDateOffset(dateOffset - 1),
                                                className: "bg-[#2a2a2a] text-white px-4 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "←"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1065,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Previous"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1066,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                lineNumber: 1061,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white font-medium",
                                                        children: (()=>{
                                                            const range = getDateRangeForFilter(timeFilter, dateOffset);
                                                            if (range.start && range.end) {
                                                                const startStr = formatDateString(range.start.toISOString().split('T')[0]);
                                                                const endStr = formatDateString(range.end.toISOString().split('T')[0]);
                                                                return `${startStr} - ${endStr}`;
                                                            }
                                                            return 'All Time';
                                                        })()
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1070,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-gray-400 text-sm",
                                                        children: dateOffset === 0 ? 'Current Period' : dateOffset > 0 ? `${dateOffset} period(s) ahead` : `${Math.abs(dateOffset)} period(s) ago`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1081,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                lineNumber: 1069,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setDateOffset(dateOffset + 1),
                                                className: "bg-[#2a2a2a] text-white px-4 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Next"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1092,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1093,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                lineNumber: 1088,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                        lineNumber: 1060,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 1026,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 1025,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-4",
                                    children: "📊 Data Summary"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 1103,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-6 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-[#2a2a2a]/30 p-4 rounded-xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-white mb-2",
                                                    children: "Time Period"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1106,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#29E7CD] text-lg font-semibold",
                                                    children: timeFilter === '1week' ? 'Last 7 days' : timeFilter === '1month' ? 'Last 30 days' : timeFilter === '3months' ? 'Last 90 days' : 'All time'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1107,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 1105,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-[#2a2a2a]/30 p-4 rounded-xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-white mb-2",
                                                    children: "Total Logs"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1114,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#29E7CD] text-lg font-semibold",
                                                    children: filterLogsByTimePeriod(allLogs, timeFilter, dateOffset).length
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1115,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 1113,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-[#2a2a2a]/30 p-4 rounded-xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-white mb-2",
                                                    children: "Active Equipment"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1120,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#29E7CD] text-lg font-semibold",
                                                    children: equipment.filter((eq)=>eq.is_active).length
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1121,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 1119,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 1104,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 1102,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-4",
                                    children: "🔍 Debug Information"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 1130,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-white mb-2",
                                                    children: "Filter Status:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1133,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300",
                                                    children: [
                                                        "Time Filter: ",
                                                        timeFilter
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1134,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300",
                                                    children: [
                                                        "Total Logs: ",
                                                        allLogs.length
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1135,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300",
                                                    children: [
                                                        "Filtered Logs: ",
                                                        filterLogsByTimePeriod(allLogs, timeFilter, dateOffset).length
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1136,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300",
                                                    children: [
                                                        "Active Equipment: ",
                                                        equipment.filter((eq)=>eq.is_active).length
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1137,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 1132,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-white mb-2",
                                                    children: "Sample Filtered Logs:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1140,
                                                    columnNumber: 19
                                                }, this),
                                                filterLogsByTimePeriod(allLogs, timeFilter, dateOffset).slice(0, 3).map((log, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-xs",
                                                        children: [
                                                            log.location,
                                                            " - ",
                                                            log.temperature_celsius,
                                                            "°C - ",
                                                            formatDateString(log.log_date),
                                                            " ",
                                                            formatTime(log.log_time)
                                                        ]
                                                    }, log.id, true, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1142,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 1139,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 1131,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 1129,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-8",
                            children: equipment.filter((eq)=>eq.is_active).map((item)=>{
                                const itemLogs = filterLogsByTimePeriod(allLogs.filter((log)=>{
                                    // Match by equipment name in location field
                                    return log.location === item.name;
                                }).sort((a, b)=>new Date(`${a.log_date}T${a.log_time}`).getTime() - new Date(`${b.log_date}T${b.log_time}`).getTime()), timeFilter, dateOffset); // Show all readings for the selected time period
                                // Debug logging
                                console.log(`Equipment: ${item.name}, Time Filter: ${timeFilter}, Logs Count: ${itemLogs.length}`);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SynchronizedChart, {
                                    logs: itemLogs,
                                    equipment: item,
                                    formatDateString: formatDateString,
                                    formatTime: formatTime,
                                    getTypeIcon: getTypeIcon
                                }, `${item.id}-${timeFilter}-${dateOffset}`, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 1167,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 1151,
                            columnNumber: 13
                        }, this),
                        logs.filter((log)=>[
                                'food_cooking',
                                'food_hot_holding',
                                'food_cold_holding'
                            ].includes(log.temperature_type)).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-4",
                                    children: "🍽️ Food Safety Alerts"
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 1182,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: logs.filter((log)=>[
                                            'food_cooking',
                                            'food_hot_holding',
                                            'food_cold_holding'
                                        ].includes(log.temperature_type)).slice(0, 5).map((log)=>{
                                        const foodSafety = getFoodSafetyStatus(log.temperature_celsius, log.log_time, log.log_date, log.temperature_type);
                                        if (!foodSafety) return null;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `p-4 rounded-2xl border ${foodSafety.status === 'danger' ? 'bg-red-400/10 border-red-400/20' : foodSafety.status === 'warning' ? 'bg-yellow-400/10 border-yellow-400/20' : 'bg-green-400/10 border-green-400/20'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: foodSafety.icon
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 1201,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "font-semibold text-white",
                                                                        children: log.location || getTypeLabel(log.temperature_type)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                        lineNumber: 1203,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: `text-sm ${foodSafety.color}`,
                                                                        children: foodSafety.message
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                        lineNumber: 1204,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 1202,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1200,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-lg font-bold text-white",
                                                                children: [
                                                                    log.temperature_celsius,
                                                                    "°C"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 1208,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-400",
                                                                children: log.log_time
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 1209,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/webapp/temperature/page.tsx",
                                                        lineNumber: 1207,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                lineNumber: 1199,
                                                columnNumber: 27
                                            }, this)
                                        }, log.id, false, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 1192,
                                            columnNumber: 25
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 1183,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 1181,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 1016,
                    columnNumber: 11
                }, this),
                activeTab === 'thresholds' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-semibold text-white",
                                children: t('temperature.manageThresholds', 'Manage Temperature Thresholds')
                            }, void 0, false, {
                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                lineNumber: 1225,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 1224,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                            children: thresholds.map((threshold)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: getTypeIcon(threshold.temperature_type)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                lineNumber: 1234,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 1233,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-xl font-semibold text-white",
                                                                    children: getTypeLabel(threshold.temperature_type)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                    lineNumber: 1237,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-400",
                                                                    children: t('temperature.thresholds', 'Temperature Thresholds')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                                    lineNumber: 1238,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 1236,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1232,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `px-3 py-1 rounded-full text-xs font-medium ${threshold.alert_enabled ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'}`,
                                                    children: threshold.alert_enabled ? t('temperature.alertsEnabled', 'Alerts Enabled') : t('temperature.alertsDisabled', 'Alerts Disabled')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1241,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 1231,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-400",
                                                            children: t('temperature.minTemp', 'Minimum Temperature')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 1250,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white font-semibold",
                                                            children: threshold.min_temp_celsius ? `${threshold.min_temp_celsius}°C` : t('temperature.notSet', 'Not Set')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 1251,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1249,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-400",
                                                            children: t('temperature.maxTemp', 'Maximum Temperature')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 1256,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white font-semibold",
                                                            children: threshold.max_temp_celsius ? `${threshold.max_temp_celsius}°C` : t('temperature.notSet', 'Not Set')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                                            lineNumber: 1257,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1255,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 1248,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 flex space-x-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "bg-[#29E7CD] text-black px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200",
                                                    children: [
                                                        "✏️ ",
                                                        t('temperature.edit', 'Edit')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1264,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: `px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${threshold.alert_enabled ? 'bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20' : 'bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20'}`,
                                                    children: threshold.alert_enabled ? t('temperature.disableAlerts', 'Disable Alerts') : t('temperature.enableAlerts', 'Enable Alerts')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                                    lineNumber: 1267,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/webapp/temperature/page.tsx",
                                            lineNumber: 1263,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, threshold.id, true, {
                                    fileName: "[project]/app/webapp/temperature/page.tsx",
                                    lineNumber: 1230,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/webapp/temperature/page.tsx",
                            lineNumber: 1228,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/webapp/temperature/page.tsx",
                    lineNumber: 1223,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/webapp/temperature/page.tsx",
            lineNumber: 476,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/webapp/temperature/page.tsx",
        lineNumber: 475,
        columnNumber: 5
    }, this);
}
}),

};

//# sourceMappingURL=_23116fc4._.js.map