import { useContext } from 'react';
import { EcommerceContext } from './EcommerceContextDef';

export function useEcommerce() {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
}
