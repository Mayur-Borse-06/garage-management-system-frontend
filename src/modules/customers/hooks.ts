import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "react-toastify"
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer, type CustomerListParams } from "./api"
import type { Customer } from "./types"
import type { CustomerPayload } from "./schemas"

const customersQueryKey = ["customers"]

const useCustomersData = (params: CustomerListParams = { page: 1, limit: 100 }) => useQuery({
    queryKey: [...customersQueryKey, params],
    queryFn: () => getCustomers(params),
})

const useCustomerData = (customerId: string) => {
    return useQuery<Customer>({
        queryKey: [...customersQueryKey, customerId],
        queryFn: () => getCustomer(customerId),
        enabled: Boolean(customerId),
    })
}

const useCreateCustomer = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (customerPayload: CustomerPayload) => createCustomer(customerPayload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customersQueryKey });
            toast.success("Customer created successfully!");
        },
        onError: (error) => {
            const message = axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
                ? error.response.data.message
                : "Unable to create customer. Please try again."

            toast.error(message)
        },
    })
}

const useUpdateCustomer = (customerId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (customerPayload: CustomerPayload) => updateCustomer(customerId, customerPayload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customersQueryKey })
            toast.success("Customer updated successfully!")
        },
        onError: (error) => {
            const message = axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
                ? error.response.data.message
                : "Unable to update customer. Please try again."

            toast.error(message)
        },
    })
}

const useDeleteCustomer = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (customerId: string) => deleteCustomer(customerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customersQueryKey })
            toast.success("Customer deactivated successfully!")
        },
        onError: (error) => {
            const message = axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
                ? error.response.data.message
                : "Unable to deactivate customer. Please try again."

            toast.error(message)
        },
    })
}

export { useCreateCustomer, useCustomerData, useCustomersData, useDeleteCustomer, useUpdateCustomer }