export const apiBaseUrl = (() => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL as string | undefined;
  console.log(import.meta.env.MODE, import.meta.env.VITE_API_BASE_URL);
  return envUrl ?? 'http://localhost:8000';
})();

export const postJson = async <TReq, TRes>(path: string, body: TReq): Promise<TRes> => {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${msg}`);
  }
  return (await res.json()) as TRes;
};
