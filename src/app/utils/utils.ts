

import axios from 'axios';
import { User } from '../api/auth/signin/types';
import { DepartmentType } from '../types/constant';
import { GenerateRequest } from '../types/types';

type SignupRequest = {
    adminInfo: {
        adminFirstName: string;
        adminLastName: string;
        adminEmail: string;
        adminPassword: string;
    };
    companyInfo: {
        companyName: string;
        companyEmployeeNumber: number;
        companyLocation: string;
        companyEmail: string;
        companyPhoneNumber: string;
    };
};


interface Manager {
    managerId?: string;
    managerFirstName: string;
    managerLastName: string;
    managerEmail: string;
    managerPassword: string;
}

interface Department {
    departmentId?: string;
    departmentName: string;
    departmentType: DepartmentType;
    departmentManagers: string[]; // Store selected manager IDs
}

interface Task {
    taskId?: string;
    taskTitle: string;
    taskDescription: string;
    taskCreatedAt: Date;
    taskDueDate: Date;
    taskStatus: string;
    taskManager: string;
}



interface GeminiResponse {
    text: string;
    conversation: string[];
}


const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ||'http://localhost:3000/api';

export const signup = async (signupData: SignupRequest): Promise<string> => {
    const fullInfos = { ...signupData.adminInfo, ...signupData.companyInfo, planName: "Free", companyEmployeeNumber: Number(signupData.companyInfo.companyEmployeeNumber) };
    console.log(fullInfos);
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, fullInfos);
    return response.data.message;
};

export const login = async (loginData: User): Promise<string> => {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
    return response.data.message;
};

export const addManager = async (manager: Omit<Manager, 'managerId'>): Promise<string> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/main/managers`, manager);
        return response.data.message || 'Manager added successfully!';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to add manager');
        }
        throw new Error('An unexpected error occurred');
    }
};

// Update an existing manager
export const updateManager = async (manager: Manager): Promise<string> => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/main/managers/${manager.managerId}`, manager);
        return response.data.message || 'Manager updated successfully!';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to update manager');
        }
        throw new Error('An unexpected error occurred');
    }
};

export const deleteManager = async (managerId: string): Promise<string> => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/main/managers/${managerId}`);
        return response.data.message || 'Manager deleted successfully!';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to delete manager');
        }
        throw new Error('An unexpected error occurred');
    }
};



export const getManagers = async (): Promise<{ Managers: Array<Manager> }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/main/managers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch managers: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform managerAccess into an array of strings (managerIds)
        if (data.managerAccess && Array.isArray(data.managerAccess)) {
            const managerIds = data.managerAccess.map((manager: { managerId: string }) => manager.managerId);
            console.log(managerIds); // Log the transformed array of managerIds
        }

        console.log(data);
        return data; // Assuming the API returns { Managers: Array<Manager> }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
};


export const addDepartment = async (department: Omit<Department, 'departmentId'>): Promise<string> => {
    try {
        // Destructure departmentManagers and exclude it from the rest of the object
        const { departmentManagers, ...rest } = department;

        // Transform departmentManagers into managerAccess
        const managerAccess = departmentManagers.map((managerId) => ({
            managerId: managerId,
        }));

        const payload = {
            ...rest,
            managerAccess: managerAccess,
        };

        const response = await axios.post(`${API_BASE_URL}/main/departments`, payload);
        return response.data.message || 'Department added successfully!';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to add department');
        }
        throw new Error('An unexpected error occurred');
    };
};

export const updateDepartment = async (department: Department): Promise<string> => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/main/departments/${department.departmentId}`, department);
        return response.data.message || 'Department updated successfully!';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to update department');
        }
        throw new Error('An unexpected error occurred');
    };
};

export const deleteDepartment = async (departmentId: string): Promise<string> => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/main/departments/${departmentId}`);
        return response.data.message || 'Department deleted successfully!';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to delete department');
        }
        throw new Error('An unexpected error occurred');
    };
};

export const getDepartments = async (): Promise<{ Departments: Array<Department> }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/main/departments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data; // Assuming the API returns { departments: Array<Department> }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    };
};


export const addTask = async (task: Omit<Task, 'taskId'>): Promise<string> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/main/tasks`, task);
        return response.data.message || 'Task added successfully!';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to add task');
        }
        throw new Error('An unexpected error occurred');
    };
};

export const updateTask = async (task: Task): Promise<string> => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/main/tasks/${task.taskId}`, task);
        return response.data.message || 'Task updated successfully!';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to update task');
        }
        throw new Error('An unexpected error occurred');
    };
};

export const deleteTask = async (taskId: string): Promise<string> => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/main/tasks/${taskId}`);
        return response.data.message || 'Task deleted successfully!';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to delete task');
        }
        throw new Error('An unexpected error occurred');
    };
};

export const getTasks = async (): Promise<{ Tasks: Array<Task> }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/main/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Assuming the API returns { Tasks: Array<Task> }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    };
};




export const generateDepartmentStrategy = async (params: GenerateRequest): Promise<GeminiResponse> => {
    try {
        const response = await axios.post<GeminiResponse>(`${API_BASE_URL}/main/ai`, params);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || 'Failed to generate strategy');
        }
        throw new Error('An unexpected error occurred while generating strategy');
    };
};