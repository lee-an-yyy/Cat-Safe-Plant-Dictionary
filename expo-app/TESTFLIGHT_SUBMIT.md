# TestFlight 제출 가이드

## 사전 준비

1. **App Store Connect에서 앱 등록**
   - [App Store Connect](https://appstoreconnect.apple.com) 접속
   - **나의 앱** → **앱 추가** → 새 앱 생성
   - Bundle ID: `com.catsafeplant.dictionary` (app.json과 동일하게)

2. **ascAppId 확인**
   - 앱 선택 → **일반** → **앱 정보** → **Apple ID** (숫자 10자리)

## eas.json 설정

`eas.json`의 submit.production.ios에 ascAppId 추가:

```json
"submit": {
  "production": {
    "ios": {
      "ascAppId": "여기에_Apple_ID_숫자_입력"
    }
  }
}
```

## 제출 명령어

터미널에서 다음 명령 실행 (Apple ID 로그인 프롬프트 표시됨):

```bash
cd expo-app
npm run submit:ios
```

또는:

```bash
npx eas-cli submit --platform ios --profile production --latest
```

## 참고

- 최초 실행 시 Apple ID와 App-Specific Password 입력 필요
- App-Specific Password: [appleid.apple.com](https://appleid.apple.com) → 로그인 및 보안 → 앱 전용 비밀번호 생성
