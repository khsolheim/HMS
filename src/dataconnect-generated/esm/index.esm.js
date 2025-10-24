import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'hms',
  location: 'europe-west1'
};

export const addNewSupplierRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewSupplier', inputVars);
}
addNewSupplierRef.operationName = 'AddNewSupplier';

export function addNewSupplier(dcOrVars, vars) {
  return executeMutation(addNewSupplierRef(dcOrVars, vars));
}

export const listProductsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProductsByCategory', inputVars);
}
listProductsByCategoryRef.operationName = 'ListProductsByCategory';

export function listProductsByCategory(dcOrVars, vars) {
  return executeQuery(listProductsByCategoryRef(dcOrVars, vars));
}

export const updateProductStockRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProductStock', inputVars);
}
updateProductStockRef.operationName = 'UpdateProductStock';

export function updateProductStock(dcOrVars, vars) {
  return executeMutation(updateProductStockRef(dcOrVars, vars));
}

export const getSalesByCustomerNameRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSalesByCustomerName', inputVars);
}
getSalesByCustomerNameRef.operationName = 'GetSalesByCustomerName';

export function getSalesByCustomerName(dcOrVars, vars) {
  return executeQuery(getSalesByCustomerNameRef(dcOrVars, vars));
}

