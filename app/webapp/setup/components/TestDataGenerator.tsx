'use client';

import { useState } from 'react';

export default function TestDataGenerator() {
  const [isGeneratingTestData, setIsGeneratingTestData] = useState(false);

  const handleGenerateTestData = async () => {
    if (!confirm('This will generate 3 months of test temperature data. This may take a few minutes. Continue?')) {
      return;
    }

    setIsGeneratingTestData(true);
    try {
      const response = await fetch('/api/generate-test-temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Successfully generated ${data.data.totalLogs} temperature log entries for the last 3 months!`);
      } else {
        alert(`Error: ${data.error || 'Failed to generate test data'}`);
      }
    } catch (error) {
      alert('Network error occurred while generating test data');
    } finally {
      setIsGeneratingTestData(false);
    }
  };

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
      <div className="text-center">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-white mb-2">Test Data Generator</h3>
        <p className="text-gray-400 mb-6">
          Generate 3 months of realistic temperature log data for testing and demonstration
        </p>
        
        <div className="bg-[#2a2a2a]/50 p-4 rounded-2xl border border-[#2a2a2a] mb-6">
          <p className="text-gray-300 text-sm">
            <strong>Note:</strong> This will create thousands of temperature log entries across all your equipment for the past 3 months. 
            Perfect for testing the analytics and monitoring features.
          </p>
        </div>

        <button
          onClick={handleGenerateTestData}
          disabled={isGeneratingTestData}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
            isGeneratingTestData
              ? 'bg-[#2a2a2a] text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#D925C7] to-[#3B82F6] text-white hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 shadow-lg hover:shadow-xl'
          }`}
        >
          {isGeneratingTestData ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              <span>Generating Data...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>Generate Test Data</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
