# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListProductsByCategory*](#listproductsbycategory)
  - [*GetSalesByCustomerName*](#getsalesbycustomername)
- [**Mutations**](#mutations)
  - [*AddNewSupplier*](#addnewsupplier)
  - [*UpdateProductStock*](#updateproductstock)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListProductsByCategory
You can execute the `ListProductsByCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProductsByCategory(vars: ListProductsByCategoryVariables): QueryPromise<ListProductsByCategoryData, ListProductsByCategoryVariables>;

interface ListProductsByCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsByCategoryVariables): QueryRef<ListProductsByCategoryData, ListProductsByCategoryVariables>;
}
export const listProductsByCategoryRef: ListProductsByCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProductsByCategory(dc: DataConnect, vars: ListProductsByCategoryVariables): QueryPromise<ListProductsByCategoryData, ListProductsByCategoryVariables>;

interface ListProductsByCategoryRef {
  ...
  (dc: DataConnect, vars: ListProductsByCategoryVariables): QueryRef<ListProductsByCategoryData, ListProductsByCategoryVariables>;
}
export const listProductsByCategoryRef: ListProductsByCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductsByCategoryRef:
```typescript
const name = listProductsByCategoryRef.operationName;
console.log(name);
```

### Variables
The `ListProductsByCategory` query requires an argument of type `ListProductsByCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListProductsByCategoryVariables {
  category: string;
}
```
### Return Type
Recall that executing the `ListProductsByCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductsByCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductsByCategoryData {
  products: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
  } & Product_Key)[];
}
```
### Using `ListProductsByCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProductsByCategory, ListProductsByCategoryVariables } from '@dataconnect/generated';

// The `ListProductsByCategory` query requires an argument of type `ListProductsByCategoryVariables`:
const listProductsByCategoryVars: ListProductsByCategoryVariables = {
  category: ..., 
};

// Call the `listProductsByCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProductsByCategory(listProductsByCategoryVars);
// Variables can be defined inline as well.
const { data } = await listProductsByCategory({ category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProductsByCategory(dataConnect, listProductsByCategoryVars);

console.log(data.products);

// Or, you can use the `Promise` API.
listProductsByCategory(listProductsByCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListProductsByCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductsByCategoryRef, ListProductsByCategoryVariables } from '@dataconnect/generated';

// The `ListProductsByCategory` query requires an argument of type `ListProductsByCategoryVariables`:
const listProductsByCategoryVars: ListProductsByCategoryVariables = {
  category: ..., 
};

// Call the `listProductsByCategoryRef()` function to get a reference to the query.
const ref = listProductsByCategoryRef(listProductsByCategoryVars);
// Variables can be defined inline as well.
const ref = listProductsByCategoryRef({ category: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductsByCategoryRef(dataConnect, listProductsByCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## GetSalesByCustomerName
You can execute the `GetSalesByCustomerName` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSalesByCustomerName(vars: GetSalesByCustomerNameVariables): QueryPromise<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;

interface GetSalesByCustomerNameRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSalesByCustomerNameVariables): QueryRef<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;
}
export const getSalesByCustomerNameRef: GetSalesByCustomerNameRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSalesByCustomerName(dc: DataConnect, vars: GetSalesByCustomerNameVariables): QueryPromise<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;

interface GetSalesByCustomerNameRef {
  ...
  (dc: DataConnect, vars: GetSalesByCustomerNameVariables): QueryRef<GetSalesByCustomerNameData, GetSalesByCustomerNameVariables>;
}
export const getSalesByCustomerNameRef: GetSalesByCustomerNameRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSalesByCustomerNameRef:
```typescript
const name = getSalesByCustomerNameRef.operationName;
console.log(name);
```

### Variables
The `GetSalesByCustomerName` query requires an argument of type `GetSalesByCustomerNameVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSalesByCustomerNameVariables {
  customerName: string;
}
```
### Return Type
Recall that executing the `GetSalesByCustomerName` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSalesByCustomerNameData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSalesByCustomerNameData {
  sales: ({
    id: UUIDString;
    saleDate: TimestampString;
    totalAmount: number;
  } & Sale_Key)[];
}
```
### Using `GetSalesByCustomerName`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSalesByCustomerName, GetSalesByCustomerNameVariables } from '@dataconnect/generated';

// The `GetSalesByCustomerName` query requires an argument of type `GetSalesByCustomerNameVariables`:
const getSalesByCustomerNameVars: GetSalesByCustomerNameVariables = {
  customerName: ..., 
};

// Call the `getSalesByCustomerName()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSalesByCustomerName(getSalesByCustomerNameVars);
// Variables can be defined inline as well.
const { data } = await getSalesByCustomerName({ customerName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSalesByCustomerName(dataConnect, getSalesByCustomerNameVars);

console.log(data.sales);

// Or, you can use the `Promise` API.
getSalesByCustomerName(getSalesByCustomerNameVars).then((response) => {
  const data = response.data;
  console.log(data.sales);
});
```

### Using `GetSalesByCustomerName`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSalesByCustomerNameRef, GetSalesByCustomerNameVariables } from '@dataconnect/generated';

// The `GetSalesByCustomerName` query requires an argument of type `GetSalesByCustomerNameVariables`:
const getSalesByCustomerNameVars: GetSalesByCustomerNameVariables = {
  customerName: ..., 
};

// Call the `getSalesByCustomerNameRef()` function to get a reference to the query.
const ref = getSalesByCustomerNameRef(getSalesByCustomerNameVars);
// Variables can be defined inline as well.
const ref = getSalesByCustomerNameRef({ customerName: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSalesByCustomerNameRef(dataConnect, getSalesByCustomerNameVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sales);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sales);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## AddNewSupplier
You can execute the `AddNewSupplier` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addNewSupplier(vars: AddNewSupplierVariables): MutationPromise<AddNewSupplierData, AddNewSupplierVariables>;

interface AddNewSupplierRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewSupplierVariables): MutationRef<AddNewSupplierData, AddNewSupplierVariables>;
}
export const addNewSupplierRef: AddNewSupplierRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addNewSupplier(dc: DataConnect, vars: AddNewSupplierVariables): MutationPromise<AddNewSupplierData, AddNewSupplierVariables>;

interface AddNewSupplierRef {
  ...
  (dc: DataConnect, vars: AddNewSupplierVariables): MutationRef<AddNewSupplierData, AddNewSupplierVariables>;
}
export const addNewSupplierRef: AddNewSupplierRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addNewSupplierRef:
```typescript
const name = addNewSupplierRef.operationName;
console.log(name);
```

### Variables
The `AddNewSupplier` mutation requires an argument of type `AddNewSupplierVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddNewSupplierVariables {
  name: string;
  contactPerson: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}
```
### Return Type
Recall that executing the `AddNewSupplier` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddNewSupplierData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddNewSupplierData {
  supplier_insert: Supplier_Key;
}
```
### Using `AddNewSupplier`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addNewSupplier, AddNewSupplierVariables } from '@dataconnect/generated';

// The `AddNewSupplier` mutation requires an argument of type `AddNewSupplierVariables`:
const addNewSupplierVars: AddNewSupplierVariables = {
  name: ..., 
  contactPerson: ..., 
  email: ..., // optional
  phone: ..., // optional
  address: ..., // optional
};

// Call the `addNewSupplier()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addNewSupplier(addNewSupplierVars);
// Variables can be defined inline as well.
const { data } = await addNewSupplier({ name: ..., contactPerson: ..., email: ..., phone: ..., address: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addNewSupplier(dataConnect, addNewSupplierVars);

console.log(data.supplier_insert);

// Or, you can use the `Promise` API.
addNewSupplier(addNewSupplierVars).then((response) => {
  const data = response.data;
  console.log(data.supplier_insert);
});
```

### Using `AddNewSupplier`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addNewSupplierRef, AddNewSupplierVariables } from '@dataconnect/generated';

// The `AddNewSupplier` mutation requires an argument of type `AddNewSupplierVariables`:
const addNewSupplierVars: AddNewSupplierVariables = {
  name: ..., 
  contactPerson: ..., 
  email: ..., // optional
  phone: ..., // optional
  address: ..., // optional
};

// Call the `addNewSupplierRef()` function to get a reference to the mutation.
const ref = addNewSupplierRef(addNewSupplierVars);
// Variables can be defined inline as well.
const ref = addNewSupplierRef({ name: ..., contactPerson: ..., email: ..., phone: ..., address: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addNewSupplierRef(dataConnect, addNewSupplierVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.supplier_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.supplier_insert);
});
```

## UpdateProductStock
You can execute the `UpdateProductStock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProductStock(vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface UpdateProductStockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
}
export const updateProductStockRef: UpdateProductStockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProductStock(dc: DataConnect, vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface UpdateProductStockRef {
  ...
  (dc: DataConnect, vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
}
export const updateProductStockRef: UpdateProductStockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProductStockRef:
```typescript
const name = updateProductStockRef.operationName;
console.log(name);
```

### Variables
The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProductStockVariables {
  id: UUIDString;
  currentStock: number;
}
```
### Return Type
Recall that executing the `UpdateProductStock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProductStockData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProductStockData {
  product_update?: Product_Key | null;
}
```
### Using `UpdateProductStock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProductStock, UpdateProductStockVariables } from '@dataconnect/generated';

// The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`:
const updateProductStockVars: UpdateProductStockVariables = {
  id: ..., 
  currentStock: ..., 
};

// Call the `updateProductStock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProductStock(updateProductStockVars);
// Variables can be defined inline as well.
const { data } = await updateProductStock({ id: ..., currentStock: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProductStock(dataConnect, updateProductStockVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
updateProductStock(updateProductStockVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `UpdateProductStock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProductStockRef, UpdateProductStockVariables } from '@dataconnect/generated';

// The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`:
const updateProductStockVars: UpdateProductStockVariables = {
  id: ..., 
  currentStock: ..., 
};

// Call the `updateProductStockRef()` function to get a reference to the mutation.
const ref = updateProductStockRef(updateProductStockVars);
// Variables can be defined inline as well.
const ref = updateProductStockRef({ id: ..., currentStock: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProductStockRef(dataConnect, updateProductStockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

