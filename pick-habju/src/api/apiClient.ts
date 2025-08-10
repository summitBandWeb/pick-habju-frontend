export const apiBaseUrl = (() => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL as string | undefined;
  // 프론트에서 /api 프록시 사용 시 baseUrl을 빈 문자열로 두고 상대경로 사용
  return envUrl ?? '';
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
