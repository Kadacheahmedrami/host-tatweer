

"use client";

import { useEffect, useState } from "react";
import { BsLightningCharge } from "react-icons/bs";
import StrategyCard from "./componenets/strategy-card";

interface Department {
  departmentId: string;
  departmentName: string;
  departmentType: string;
}

interface StrategyResponse {
  message: string;
  conversation: string[];
}

export default function StrategiesPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  // Map each departmentId to its generated strategy
  const [strategies, setStrategies] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        console.log("Fetching departments...");
        const response = await fetch("/api/main/departments"); // Relative URL for departments
        if (!response.ok) {
          throw new Error(`Failed to fetch departments. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        if (data.Departments) {
          setDepartments(data.Departments);
        } else {
          console.warn("No Departments found in response");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Function to generate a strategy for a given department
  const generateStrategyForDepartment = async (department: Department) => {
    try {
      const payload = {
        department: department.departmentName, // Use the department's name
        companySize: 'medium',
        industry: 'general',
        currentChallenges: '',
        budget: 'moderate',
        timeframe: '12 months',
        conversation: [] // initial conversation array
      };

      const response = await fetch("/api/main/ai", { // Your strategy API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Strategy generation failed. Status: ${response.status}`);
      }

      const data: StrategyResponse = await response.json();
      // Save the generated strategy for this department
      setStrategies(prev => ({
        ...prev,
        [department.departmentId]: data.message
      }));
    } catch (error) {
      console.error(`Error generating strategy for department ${department.departmentName}:`, error);
      setStrategies(prev => ({
        ...prev,
        [department.departmentId]: "Failed to generate strategy."
      }));
    }
  };

  // When departments are loaded, trigger the strategy generation for each one.
  useEffect(() => {
    departments.forEach(dept => {
      // Only call the API if we have not already generated a strategy for this department.
      if (!strategies[dept.departmentId]) {
        generateStrategyForDepartment(dept);
      }
    });
    // We intentionally do not include "strategies" in the dependency array to avoid duplicate calls.
  }, [departments]);

  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Strategies</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.length > 0 ? (
            departments.map((dept, index) => (
              <StrategyCard
                key={dept.departmentId || index}
                title={dept.departmentName}
                date={"N/A"} // No date available
                description={`Department Type: ${dept.departmentType}`}
                strategy={strategies[dept.departmentId]} // Pass the generated strategy (or undefined while loading)
                icon={BsLightningCharge}
                iconColor="#FFB800"
                backgroundColor="#FFFBF2"
              />
            ))
          ) : (
            <StrategyCard
              key={0}
              title="You have no departments"
              date=""
              description="No strategy available"
              strategy=""
              icon={BsLightningCharge}
              iconColor="#FFB800"
              backgroundColor="#FFFBF2"
            />
          )}
        </div>
      </div>
    </main>
  );
}
