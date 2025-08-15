# Google Analytics 이벤트 추적 가이드

## 📊 설정 완료 사항

### 1. Google Analytics 태그 설정
- `index.html`에 Google Analytics 태그가 추가되었습니다
- 측정 ID: `G-GP1QPHGTTD`

### 2. 추적되는 이벤트들

#### 🔍 검색 버튼 클릭 이벤트
- **이벤트명**: `search_button_click`
- **카테고리**: `user_interaction`
- **추적 데이터**:
  - 선택된 날짜
  - 시간대 정보
  - 인원수
- **위치**: `HeroArea.tsx`의 검색 버튼 클릭 시

#### ⚡ API 응답 시간 추적
- **이벤트명**: `api_response_time`
- **카테고리**: `api_performance`
- **추적 데이터**:
  - 실제 API 응답 시간 (밀리초)
  - 성공/실패 여부
  - 응답받은 룸 개수
- **위치**: `HomePage.tsx`의 `handleSearch` 함수 내

#### 📈 검색 결과 추적
- **이벤트명**: `search_results`
- **카테고리**: `search_performance`
- **추적 데이터**:
  - 전체 룸 개수
  - 예약 가능한 룸 개수
  - 전체 검색 소요 시간
- **위치**: `HomePage.tsx`의 `handleSearch` 함수 내

#### ❌ 에러 추적
- **이벤트명**: `error_occurred`
- **카테고리**: `error`
- **추적 데이터**:
  - 에러 타입
  - 에러 메시지
- **위치**: API 호출 실패 시

## 🧪 테스트 방법

### 1. 브라우저 개발자 도구로 확인
1. 웹사이트를 열고 개발자 도구(F12)를 엽니다
2. **Network** 탭을 선택합니다
3. 검색 버튼을 클릭합니다
4. `google-analytics.com` 또는 `googletagmanager.com`으로 전송되는 요청을 확인합니다

### 2. Google Analytics Real-time 보고서
1. Google Analytics 대시보드에 접속합니다
2. **실시간 > 이벤트** 메뉴를 선택합니다
3. 웹사이트에서 검색을 실행합니다
4. 실시간으로 다음 이벤트들이 기록되는지 확인합니다:
   - `search_button_click`
   - `api_response_time`
   - `search_results`

### 3. 콘솔에서 확인
브라우저 콘솔에서 다음 명령어로 gtag 함수가 로드되었는지 확인:
```javascript
console.log(typeof window.gtag); // 'function'이 출력되어야 함
```

## 📋 맞춤 이벤트 매개변수

Google Analytics에서 다음 맞춤 매개변수들을 볼 수 있습니다:

### API 성능 관련
- `response_time_ms`: API 응답 시간 (밀리초)
- `room_count`: 응답받은 룸 개수
- `is_success`: 성공 여부

### 검색 결과 관련
- `total_rooms`: 전체 룸 개수
- `available_rooms`: 예약 가능한 룸 개수
- `search_duration_ms`: 검색 소요 시간 (밀리초)

### 에러 관련
- `error_message`: 에러 메시지

## 🔧 추가 설정

필요에 따라 `src/utils/analytics.ts` 파일을 수정하여 더 많은 이벤트를 추적할 수 있습니다.

예시:
```typescript
// 예약 완료 이벤트 추가
export const trackReservationComplete = (roomName: string, duration: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'reservation_complete', {
      event_category: 'conversion',
      event_label: roomName,
      value: duration,
    });
  }
};
```
