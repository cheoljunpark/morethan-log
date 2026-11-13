# cheoljun.dev

Notion을 CMS로 쓰는 개인 개발 블로그입니다. 구현 과정과 트러블슈팅, 배운 것들을 기록합니다.

- 사이트: https://dev.cheoljunpark.site
- 글 작성: Notion 데이터베이스에 글을 쓰면 사이트에 반영됩니다 (배포 불필요).

## 구조

| 경로 | 내용 |
|---|---|
| `/` | 최신 글 목록. `?menu=`(카테고리), `?tag=`, `?q=`(검색), `?order=asc`, `?page=` 로 필터 |
| `/[slug]` | 글 상세. 작성자 박스 → 댓글(Utterances) → 이전/다음 글 |
| `/about` | 블로그 소개 |
| `/sitemap.xml` | 공개 글만 포함한 사이트맵 |
| `/api/revalidate` | 캐시 즉시 갱신 (아래 참고) |

예전 주소 `/archive`, `/tags` 는 홈으로 리다이렉트됩니다 (`next.config.js`).

## 기술 스택

- Next.js 15 (pages router), React 18, TypeScript
- Emotion (스타일), TanStack Query (데이터 캐시)
- `notion-client` / `react-notion-x` 8.x (Notion 데이터 조회·렌더링)
- Vercel 배포, ISR(1시간 주기 재생성)

## 로컬 실행

Node.js 26 기준입니다 (`package.json`의 `engines`). 다른 버전에서는 `--ignore-engines`가 필요할 수 있습니다.

```bash
yarn install
yarn dev
```

`.env.local` 에 환경변수를 넣습니다.

| 변수 | 필수 | 설명 |
|---|---|---|
| `NOTION_PAGE_ID` | ✅ | 글 데이터베이스가 있는 Notion 페이지 ID |
| `TOKEN_FOR_REVALIDATE` | 권장 | `/api/revalidate` 비밀 키. 없으면 이 API는 비활성화됩니다 |
| `NEXT_PUBLIC_UTTERANCES_REPO` | | 댓글용 GitHub 저장소 (`owner/repo`) |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | | Google Analytics |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | | Google Search Console 인증 |
| `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` | | 네이버 서치어드바이저 인증 |

프로필, 프로젝트 링크, 블로그 제목·설명 등은 `site.config.js` 에서 바꿉니다.

## 글 반영 시점

페이지는 최대 1시간마다 다시 생성됩니다. 바로 반영하려면:

```
https://dev.cheoljunpark.site/api/revalidate?secret=<TOKEN_FOR_REVALIDATE>
https://dev.cheoljunpark.site/api/revalidate?secret=<TOKEN_FOR_REVALIDATE>&path=/글-slug
```

첫 번째는 홈, 소개, 모든 공개 글을, 두 번째는 해당 페이지 하나만 갱신합니다.

## 배포 메모

- Vercel은 Node.js 20.x 지원을 종료했습니다. `engines.node`(26.x)가 프로젝트 설정보다 우선합니다.
- `notion-client` 6.x는 Notion이 403으로 차단합니다. 8.x 이상을 유지하세요.

## 라이선스

MIT. [morethan-log](https://github.com/morethanmin/morethan-log) 템플릿에서 시작했습니다.
