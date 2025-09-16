export const apiBaseUrl = (() => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL as string | undefined;
  console.log(import.meta.env.MODE, import.meta.env.VITE_API_BASE_URL);
  return envUrl ?? 'http://localhost:8000';
})();

let apiCallCountInSession = 0;

export const postJson = async <TReq, TRes>(path: string, body: TReq): Promise<TRes> => {
  const scenario = ((): string | null => {
    try {
      return localStorage.getItem('mswScenario');
    } catch {
      return null;
    }
  })();
  apiCallCountInSession += 1;
  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(scenario ? { 'x-msw-scenario': scenario } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${msg}`);
  }
  return (await res.json()) as TRes;
};

export const getApiCallCountInSession = () => apiCallCountInSession;
