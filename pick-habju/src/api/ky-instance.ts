import ky from 'ky';
import { ApiError, type ApiErrorBody } from '../errors';

const apiBaseUrl = (() => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL as string | undefined;
  return envUrl ?? 'http://localhost:8000';
})();

const kyInstance = ky.create({
  prefixUrl: apiBaseUrl,
  headers: {
    accept: 'application/json',
  },
  hooks: {
    afterResponse: [
      async (request, _options, response) => {
        const parseErrorBody = async (): Promise<{ body?: ApiErrorBody; rawText?: string }> => {
          try {
            const parsed = (await response.clone().json()) as ApiErrorBody;
            return { body: parsed };
          } catch {
            try {
              return { rawText: await response.clone().text() };
            } catch {
              return {};
            }
          }
        };

        // 한 번만 파싱
        const { body, rawText } = await parseErrorBody();

        // HTTP 상태 코드 에러 체크
        if (!response.ok) {
          throw new ApiError({
            status: response.status,
            message: body?.message ?? response.statusText,
            code: body?.code,
            body,
            rawText,
            url: response.url,
            method: request.method,
          });
        }

        // 백엔드 isSuccess 필드 체크
        if (body && body.isSuccess === false) {
          throw new ApiError({
            status: response.status,
            message: body.message,
            code: body.code,
            body,
            url: response.url,
            method: request.method,
          });
        }

        return response;
      },
    ],
  },
});

export default kyInstance;
