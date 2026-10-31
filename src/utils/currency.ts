import { useState, useEffect, useCallback } from 'react';

export const BASE_USD_PRICE = 0.5;
export const FALLBACK_EXCHANGE_RATE = 16500; // Standar fallback jika offline

export interface ExchangeRateData {
  rate: number;
  usdAmount: number;
  idrAmount: number;
  isLoading: boolean;
  isLive: boolean;
  lastUpdated: string;
  source: string;
}

export const formatIDR = (amount: number): string => {
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
};

export const formatUSD = (amount: number): string => {
  return `$ ${amount.toString().replace('.', ',')}`;
};

/**
 * Mengambil kurs USD ke IDR terkini secara langsung saat aplikasi dibuka.
 * Menggunakan open.er-api.com dengan fallback ke exchangerate-api.com.
 */
export async function getLiveUsdToIdrRate(): Promise<{ rate: number; isLive: boolean; source: string }> {
  // Coba API 1: open.er-api.com (tanpa API key, CORS enabled)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      cache: 'no-cache',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      const idr = data?.rates?.IDR;
      if (typeof idr === 'number' && idr > 10000 && idr < 30000) {
        localStorage.setItem('interviewai_cached_usd_idr', idr.toString());
        localStorage.setItem('interviewai_cached_usd_idr_time', new Date().toISOString());
        return { rate: idr, isLive: true, source: 'open.er-api.com' };
      }
    }
  } catch (err) {
    console.warn('Primary exchange rate fetch failed, trying fallback...', err);
  }

  // Coba API 2: api.exchangerate-api.com
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      cache: 'no-cache',
    });
    if (res.ok) {
      const data = await res.json();
      const idr = data?.rates?.IDR;
      if (typeof idr === 'number' && idr > 10000 && idr < 30000) {
        localStorage.setItem('interviewai_cached_usd_idr', idr.toString());
        localStorage.setItem('interviewai_cached_usd_idr_time', new Date().toISOString());
        return { rate: idr, isLive: true, source: 'exchangerate-api.com' };
      }
    }
  } catch (err) {
    console.warn('Secondary exchange rate fetch failed, checking cache...', err);
  }

  // Coba API 3: jsdelivr currency-api
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json', {
      cache: 'no-cache',
    });
    if (res.ok) {
      const data = await res.json();
      const idr = data?.usd?.idr;
      if (typeof idr === 'number' && idr > 10000 && idr < 30000) {
        localStorage.setItem('interviewai_cached_usd_idr', idr.toString());
        localStorage.setItem('interviewai_cached_usd_idr_time', new Date().toISOString());
        return { rate: idr, isLive: true, source: 'currency-api' };
      }
    }
  } catch (err) {
    console.warn('Tertiary exchange rate fetch failed...', err);
  }

  // Gunakan cache lokal jika ada
  const cached = localStorage.getItem('interviewai_cached_usd_idr');
  if (cached) {
    const parsed = parseFloat(cached);
    if (!isNaN(parsed) && parsed > 10000) {
      return { rate: parsed, isLive: false, source: 'Cache Lokal Tersimpan' };
    }
  }

  return { rate: FALLBACK_EXCHANGE_RATE, isLive: false, source: 'Kurs Acuan Bawaan' };
}

/**
 * Hook React untuk memuat kurs USD ke Rupiah saat aplikasi dibuka
 */
export function useLiveExchangeRate(baseUsd: number = BASE_USD_PRICE) {
  const [rateData, setRateData] = useState<ExchangeRateData>(() => {
    // Inisialisasi awal dari cache jika ada
    let initialRate = FALLBACK_EXCHANGE_RATE;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('interviewai_cached_usd_idr');
      if (cached) {
        const val = parseFloat(cached);
        if (!isNaN(val) && val > 10000) initialRate = val;
      }
    }
    return {
      rate: initialRate,
      usdAmount: baseUsd,
      idrAmount: Math.round(baseUsd * initialRate),
      isLoading: true,
      isLive: false,
      lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      source: 'Memuat kurs...',
    };
  });

  const refreshRate = useCallback(async () => {
    setRateData(prev => ({ ...prev, isLoading: true }));
    const result = await getLiveUsdToIdrRate();
    const idr = Math.round(baseUsd * result.rate);
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setRateData({
      rate: result.rate,
      usdAmount: baseUsd,
      idrAmount: idr,
      isLoading: false,
      isLive: result.isLive,
      lastUpdated: nowTime,
      source: result.source,
    });
  }, [baseUsd]);

  useEffect(() => {
    refreshRate();
  }, [refreshRate]);

  return {
    ...rateData,
    refreshRate,
    formattedRate: `Rp ${Math.round(rateData.rate).toLocaleString('id-ID')}`,
    formattedIdr: formatIDR(rateData.idrAmount),
    formattedUsd: formatUSD(rateData.usdAmount),
  };
}
