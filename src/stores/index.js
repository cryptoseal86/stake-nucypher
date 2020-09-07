import React from 'react';
import AppStore from './AppStore';

const appStore = new AppStore();
const storeContext = React.createContext(appStore);

export const StoreProvider = ({ children }) => {
  return <storeContext.Provider value={appStore}>{children}</storeContext.Provider>
}

/* eslint-disable react-hooks/rules-of-hooks */
export const inject = (selector, BaseComponent) => {
  const component = ownProps => {
    const store = React.useContext(storeContext);
    return <BaseComponent {...selector({ store, ownProps })}></BaseComponent>;
  };
  component.displayName = BaseComponent.name;
  return component;
};
/* eslint-enable react-hooks/rules-of-hooks */

export const useStore = () => {
  const store = React.useContext(storeContext);
  return store;
}
