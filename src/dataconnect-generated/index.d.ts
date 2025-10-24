import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddNewSupplierData {
  supplier_insert: Supplier_Key;
}

export interface AddNewSupplierVariables {
  name: string;
  contactPerson: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface GetSalesByCustomerNameData {
  sales: ({
    id: UUIDString;
    saleDate: TimestampString;
    totalAmount: number;
  } & Sale_Key)[];
}

export interface GetSalesByCustomerNameVariables {
  customerName: string;
}

export interface InventoryMovement_Key {
  id: UUIDString;
  __typename?: 'InventoryMovement_Key';
}

export interface ListProductsByCategoryData {
  products: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
  } & Product_Key)[];
}

export interface ListProductsByCategoryVariables {
  category: string;
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface SaleItem_Key {
  saleId: UUIDString;
  productId: UUIDString;
  __typename?: 'SaleItem_Key';
}

export interface Sale_Key {
  id: UUIDString;
  __typename?: 'Sale_Key';
}

export interface Supplier_Key {
  id: UUIDString;
  __typename?: 'Supplier_Key';
}

export interface UpdateProductStockData {
  product_update?: Product_Key | null;
}

export interface UpdateProductStockVariables {
  id: UUIDString;
  currentStock: number;
}

interface AddNewSupplierRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewSupplierVariables): MutationRef<AddNewSupplierData, AddNewSupplierVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNewSupplierVariables): MutationRef<AddNewSupplierData, AddNewSupplierVariables>;
  operationName: string;
}
export const addNewSupplierRef: AddNewSupplierRef;

export function addNewSupplier(vars: AddNewSupplierVariables): MutationPromise<AddNewSupplierData, AddNewSupplierVariables>;
export function addNewSupplier(dc: DataConnect, vars: AddNewSupplierVariables): MutationPromise<AddNewSupplierData, AddNewSupplierVariables>;

interface ListProductsByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsByCategoryVariables): QueryRef<ListProductsByCategoryData, ListProductsByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProductsByCategoryVariables): QueryRef<ListProductsByCategoryData, ListProductsByCategoryVariables>;
  operationName: string;
}
export const listProductsByCategoryRef: ListProductsByCategoryRef;

export function listProductsByCategory(vars: ListProductsByCategoryVariables): QueryPromise<ListProductsByCategoryData, ListProductsByCategoryVariables>;
export function listProductsByCategory(dc: DataConnect, vars: ListProductsByCategoryVariables): QueryPromise<ListProductsByCategoryData, ListProductsByCategoryVariables>;

interface UpdateProductStockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
  operationName: string;
}
export const updateProductStockRef: UpdateProductStockRef;

export function updateProductStock(vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;
export function updateProductStock(dc: DataConnect, vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface GetSalesByCustomerNameRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSalesByCustomerNameVariables): QueryRef<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSalesByCustomerNameVariables): QueryRef<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;
  operationName: string;
}
export const getSalesByCustomerNameRef: GetSalesByCustomerNameRef;

export function getSalesByCustomerName(vars: GetSalesByCustomerNameVariables): QueryPromise<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;
export function getSalesByCustomerName(dc: DataConnect, vars: GetSalesByCustomerNameVariables): QueryPromise<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;

