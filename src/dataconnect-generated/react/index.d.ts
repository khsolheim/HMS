import { AddNewSupplierData, AddNewSupplierVariables, ListProductsByCategoryData, ListProductsByCategoryVariables, UpdateProductStockData, UpdateProductStockVariables, GetSalesByCustomerNameData, GetSalesByCustomerNameVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddNewSupplier(options?: useDataConnectMutationOptions<AddNewSupplierData, FirebaseError, AddNewSupplierVariables>): UseDataConnectMutationResult<AddNewSupplierData, AddNewSupplierVariables>;
export function useAddNewSupplier(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewSupplierData, FirebaseError, AddNewSupplierVariables>): UseDataConnectMutationResult<AddNewSupplierData, AddNewSupplierVariables>;

export function useListProductsByCategory(vars: ListProductsByCategoryVariables, options?: useDataConnectQueryOptions<ListProductsByCategoryData>): UseDataConnectQueryResult<ListProductsByCategoryData, ListProductsByCategoryVariables>;
export function useListProductsByCategory(dc: DataConnect, vars: ListProductsByCategoryVariables, options?: useDataConnectQueryOptions<ListProductsByCategoryData>): UseDataConnectQueryResult<ListProductsByCategoryData, ListProductsByCategoryVariables>;

export function useUpdateProductStock(options?: useDataConnectMutationOptions<UpdateProductStockData, FirebaseError, UpdateProductStockVariables>): UseDataConnectMutationResult<UpdateProductStockData, UpdateProductStockVariables>;
export function useUpdateProductStock(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProductStockData, FirebaseError, UpdateProductStockVariables>): UseDataConnectMutationResult<UpdateProductStockData, UpdateProductStockVariables>;

export function useGetSalesByCustomerName(vars: GetSalesByCustomerNameVariables, options?: useDataConnectQueryOptions<GetSalesByCustomerNameData>): UseDataConnectQueryResult<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;
export function useGetSalesByCustomerName(dc: DataConnect, vars: GetSalesByCustomerNameVariables, options?: useDataConnectQueryOptions<GetSalesByCustomerNameData>): UseDataConnectQueryResult<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;
