# Dev Blog Upgrade Status

개발 블로그 고도화 작업을 순차적으로 관리하는 문서입니다.

## 진행예정

- `pinned`를 Notion 속성 기반으로 전환
- `updatedAt` 속성 지원 및 수정일 노출
- 관련 글 추천 섹션 추가

## 진행중
- 다음 작업 선택 전
- 현재 배포 상태 확인
- 다음 후보: `updatedAt` 또는 관련 글 추천

## 진행완료

- 글 상세 TOC와 읽기 진행도
  - Notion 렌더링 후 헤딩 수집
  - 헤딩 anchor id 보정
  - 데스크톱 우측 TOC 추가
  - 현재 섹션 active 표시
  - 상단 읽기 진행도 바 추가
  - 로컬 `npm run build` 검증 완료
- `series` 지원
  - 타입에 `series` 추가
  - 피드 카드에 시리즈 메타 표시
  - 상세 페이지 상단에 현재 시리즈 표시
  - 상세 페이지 하단에 시리즈 네비게이션 추가
  - 검색 시 시리즈명도 포함되도록 반영
  - 로컬 `npm run build` 검증 완료
- Notion 응답 호환성 보강
- 빌드 시 컬렉션 파싱 안정화
- 상세 페이지 읽기 시간 추가
- 이전 글 / 다음 글 네비게이션 추가
- 상세에서 목록으로 돌아갈 때 스크롤 위치 복원
- 검색/태그/카테고리/정렬 상태 URL 유지
- 상세 페이지 공유 버튼 추가
- canonical URL / keywords / JSON-LD 메타 추가
- `CONTENT_MODEL.md` 작성
