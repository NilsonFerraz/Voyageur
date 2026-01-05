
import { CurrencyCode } from '../types';

// Usaremos uma API pública de câmbio para garantir dados reais e rápidos.
const BASE_URL = 'https://open.er-api.com/v6/latest/BRL';

export const getExchangeRates = async (): Promise<Record<CurrencyCode, number>> => {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    if (data.result === 'success') {
      return data.rates;
    }
    throw new Error('Falha ao buscar taxas');
  } catch (error) {
    console.error('Erro no câmbio:', error);
    // Fallback básico caso a API falhe (Valores aproximados)
    return {
      BRL: 1,
      USD: 0.20,
      EUR: 0.18,
      GBP: 0.16,
      JPY: 30.0,
      ARS: 165.0,
    };
  }
};

export const formatCurrency = (amount: number, code: CurrencyCode, symbol: string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: code,
    currencyDisplay: 'narrowSymbol'
  }).format(amount).replace(code, symbol);
};
