const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'hms',
  location: 'europe-west1'
};
exports.connectorConfig = connectorConfig;

const addNewSupplierRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewSupplier', inputVars);
}
addNewSupplierRef.operationName = 'AddNewSupplier';
exports.addNewSupplierRef = addNewSupplierRef;

exports.addNewSupplier = function addNewSupplier(dcOrVars, vars) {
  return executeMutation(addNewSupplierRef(dcOrVars, vars));
};

const listProductsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProductsByCategory', inputVars);
}
listProductsByCategoryRef.operationName = 'ListProductsByCategory';
exports.listProductsByCategoryRef = listProductsByCategoryRef;

exports.listProductsByCategory = function listProductsByCategory(dcOrVars, vars) {
  return executeQuery(listProductsByCategoryRef(dcOrVars, vars));
};

const updateProductStockRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProductStock', inputVars);
}
updateProductStockRef.operationName = 'UpdateProductStock';
exports.updateProductStockRef = updateProductStockRef;

exports.updateProductStock = function updateProductStock(dcOrVars, vars) {
  return executeMutation(updateProductStockRef(dcOrVars, vars));
};

const getSalesByCustomerNameRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSalesByCustomerName', inputVars);
}
getSalesByCustomerNameRef.operationName = 'GetSalesByCustomerName';
exports.getSalesByCustomerNameRef = getSalesByCustomerNameRef;

exports.getSalesByCustomerName = function getSalesByCustomerName(dcOrVars, vars) {
  return executeQuery(getSalesByCustomerNameRef(dcOrVars, vars));
};
