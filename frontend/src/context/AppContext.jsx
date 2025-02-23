import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [contracts, setContracts] = useState([]);

  const addClient = (client) => {
    setClients(prev => [...prev, { ...client, id: Date.now() }]);
  };

  const addContract = (contract) => {
    setContracts(prev => [...prev, { ...contract, id: Date.now() }]);
  };

  const updateContract = (contractId, updatedContract) => {
    setContracts(prev => prev.map(contract => 
      contract.id === contractId ? { ...updatedContract, id: contractId } : contract
    ));
  };

  const deleteContract = (contractId) => {
    setContracts(prev => prev.filter(contract => contract.id !== contractId));
  };

  return (
    <AppContext.Provider value={{
      clients,
      contracts,
      addClient,
      addContract,
      updateContract,
      deleteContract
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
