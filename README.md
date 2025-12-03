<p align="center"><img src="icons/icon128.png" /></p>

# 토스 증권 비공식 확장 프로그램입니다.

개발 기간 : 2025.12.02 ~ 2025.12.03

## 프로젝트 소개
토스 WTS __비공식 확장__ 프로그램은 토스 증권의 웹 트레이딩 시스템(WTS)을 보다 편리하게 사용할 수 있도록 도와주는 브라우저 확장 프로그램입니다.

## 미리보기

### 실시간 가격 정보 패널
![가격 정보 패널 스크린샷](screenshots/price-panel.png)

### 패널 이동 기능
![패널 드래그 데모](screenshots/drag-panel.gif)

## 개발환경
* 운영체제 : Windows 11 x64 (24H2, 26100.2033)
* 사용 언어 : JavaScript, HTML, CSS

## 설치하기

### 수동 설치
1. [GitHub 저장소](https://github.com/mokminsu/Toss-Invest-Plus)에 접속합니다.
2. "Code" 버튼을 클릭하고 "Download ZIP"을 선택하여 저장소를 다운로드합니다.
3. 다운로드한 ZIP 파일을 압축 해제합니다.
4. Chrome 브라우저를 열고 주소창에 `chrome://extensions/`를 입력하여 확장 프로그램 페이지로 이동합니다.
5. 우측 상단의 "개발자 모드" 토글을 활성화합니다.
6. "압축해제된 확장 프로그램 로드" 버튼을 클릭하고, 앞서 압축 해제한 폴더를 선택합니다.
7. 확장 프로그램이 목록에 추가되면, 아이콘을 클릭하여 설정을 진행합니다.

### 크롬 웹 스토어 설치
현재 크롬 웹 스토어에서 확장을 제공하고 있지 않습니다. 추후 추가 될 예정입니다.

## 주요 기능

### 📊 실시간 가격 정보 패널
- **커서 위치 가격**: 차트에서 마우스 커서가 위치한 지점의 가격 표시
- **현재가**: 실시간 최신 가격 정보
- **가격차**: 커서 위치 가격 - 현재가
- **변동률**: 현재가 대비 커서 위치 가격의 변동률 (상승: 🔴 빨강, 하락: 🔵 파랑)

### ✨ 주요 특징
- 실시간 업데이트 (50ms 간격)
- 드래그 앤 드롭으로 패널 위치 자유롭게 이동 가능
- 위치 자동 저장 (다음 방문 시 저장된 위치에 표시)
- 깔끔한 반투명 디자인으로 차트 방해 최소화

## 사용 방법

### 1️⃣ 기본 사용
1. [토스 증권 WTS](https://www.tossinvest.com)에 접속합니다.
2. 차트 페이지로 이동하면 자동으로 가격 정보 패널이 표시됩니다.
3. 차트에 마우스를 올리면 실시간으로 가격 정보가 업데이트됩니다.

### 2️⃣ 패널 이동
- 패널을 **드래그**하여 원하는 위치로 이동할 수 있습니다.
- 이동한 위치는 자동으로 저장되어 다음 방문 시에도 같은 위치에 표시됩니다.

### 3️⃣ 기능 설정
1. 브라우저 우측 상단의 확장 프로그램 아이콘을 클릭합니다.
2. 원하는 기능을 체크박스로 켜거나 끌 수 있습니다.
3. 설정 변경 후 페이지를 새로고침하면 적용됩니다.

### 💡 팁
- 패널이 차트를 가리는 경우, 드래그하여 화면 구석으로 이동하세요.
- 여러 종목을 전환해도 패널은 계속 활성화됩니다.
- 기능이 작동하지 않는 경우, 페이지를 새로고침해보세요.
## 사용 스택

### 개발 환경
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)             

### 개발 언어
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white)

## 유의사항
이 프로젝트는 비바리퍼블리카 또는 토스 뱅크, 토스 증권 등 모든 토스 관련 회사와 무관한 "비공식" 프로젝트입니다.

__본 확장 프로그램은 실제 가격과 보여지는 가격이 다를 수 있으며, 투자와 확장 프로그램 사용에 대한 선택과 책임은 전적으로 사용자에게 있습니다.__

## 문의하기
프로젝트상의 문제 또는 비공개 요청시 <a href="mailto:contact@mokminsu.dev" target="_blank">contact@mokminsu.dev</a> 로 연락바랍니다.
또는, Github 이슈를 등록해주시면 빠른 시일내에 답변드리겠습니다.


## 라이센스
이 프로젝트는 [MIT License](LICENSE)로 배포됩니다.
