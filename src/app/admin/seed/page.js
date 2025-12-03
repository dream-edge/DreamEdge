"use client";

import { useState } from "react";
import Link from 'next/link';
import { seedDatabaseAction } from "./actions";

// This page uses an admin client with service role access for seeding the database
// It bypasses Row Level Security policies and should only be accessible to administrators

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const seedResult = await seedDatabaseAction();
      setResult(seedResult);
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Database Seed Tool</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="mb-4 text-gray-700">
          This tool will seed your Supabase database with initial data for testing.
          It will only add data if the tables are empty.
        </p>
        
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This action should only be used in development or when initially setting up the database.
                Running this in production with existing data will not modify or delete existing records.
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSeed}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Seeding Database...
            </span>
          ) : (
            "Seed Database"
          )}
        </button>
      </div>
      
      {result && (
        <div
          className={`rounded-lg p-6 ${
            result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          <h3 className={`text-lg font-semibold mb-2 ${
            result.success ? "text-green-800" : "text-red-800"
          }`}>
            {result.success ? "Success!" : "Error"}
          </h3>
          <p className={result.success ? "text-green-700" : "text-red-700"}>
            {result.message}
          </p>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
} 