import apiClient from "../../lib/apiClient";
import type { CustomerPayload } from "./schemas";
import type { Customer, CustomerListResponse } from "./types";

interface CustomerListParams {
    page: number;
    limit: number;
}

const getCustomers = async (params: CustomerListParams): Promise<CustomerListResponse> => {
    const response = await apiClient.get("/api/customers", { params });
    return response.data.data;
};

const getCustomer = async (customerId: string): Promise<Customer> => {
    const response = await apiClient.get(`/api/customers/${customerId}`);
    return response.data.data;
};

const createCustomer = async (customerPayload: CustomerPayload) => {
    const response = await apiClient.post("/api/customers", customerPayload);
    return response.data;
};

const updateCustomer = async (customerId: string, customerPayload: CustomerPayload) => {
    const response = await apiClient.patch(`/api/customers/${customerId}`, customerPayload);
    return response.data.data;
};

const deleteCustomer = async (customerId: string) => {
    const response = await apiClient.delete(`/api/customers/${customerId}`);
    return response.data;
};

export { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer };
export type { CustomerListParams };