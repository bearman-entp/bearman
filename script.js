document.addEventListener('DOMContentLoaded', () => {
    // 1. 홈 화면 이미지 로딩 애니메이션
    const heroImage = document.getElementById('heroImage');
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroImage && heroButtons) {
        // 이미지는 CSS 애니메이션으로 처리 (animate-on-load 클래스)
        // 버튼은 CSS 애니메이션으로 처리 (animate-fade-in delay-2s 클래스)
    }

    // 2. BGM 자동 재생 및 컨트롤
    const bgm = document.getElementById('bgm');
    const bgmToggle = document.getElementById('bgmToggle');
    let isPlaying = false; // BGM 재생 상태

    const toggleBgm = () => {
        if (bgm.paused) {
            bgm.play().then(() => {
                isPlaying = true;
                bgmToggle.classList.replace('fa-volume-mute', 'fa-volume-up');
                bgm.volume = 0.3; // 기본 볼륨
                console.log("BGM 재생 시작!");
            }).catch(error => {
                console.warn("BGM 자동 재생 실패 (사용자 상호작용 필요):", error);
                // 자동 재생이 안될 경우, 사용자에게 버튼 클릭 유도
            });
        } else {
            bgm.pause();
            isPlaying = false;
            bgmToggle.classList.replace('fa-volume-up', 'fa-volume-mute');
            console.log("BGM 재생 중지!");
        }
    };

    // 페이지 로드 시 BGM 재생 시도 (브라우저 정책에 따라 실패할 수 있음)
    // 사용자 첫 클릭 등의 상호작용 후 재생 권장
    document.body.addEventListener('click', function attemptPlay() {
        if (!isPlaying && bgm.paused) { // 한 번만 시도하고, 실제로 paused 상태일 때만
            toggleBgm();
        }
        document.body.removeEventListener('click', attemptPlay);
    }, { once: true });


    // BGM 토글 버튼 클릭 이벤트
    if (bgmToggle) {
        bgmToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // 문서 클릭 이벤트로 인한 중복 호출 방지
            toggleBgm();
        });
    }

    // 3. 네비게이션 바 브랜드 타이핑 효과
    const navbarBrand = document.querySelector('.navbar-brand.animate-char-by-char');
    if (navbarBrand) {
        const text = navbarBrand.textContent;
        navbarBrand.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${0.2 + index * 0.05}s`; // 글자마다 딜레이
            navbarBrand.appendChild(span);
        });
    }

    // 4. 섹션 스크롤 애니메이션
    const sections = document.querySelectorAll('.content-section .fade-in-scroll, .content-section .slide-in-left-scroll, .content-section .slide-in-right-scroll, .content-section .scale-up-scroll, .content-section .slide-in-scroll');

    const checkVisibility = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // 화면의 80% 정도 들어왔을 때 show 클래스 추가
            if (rect.top < window.innerHeight * 0.8) {
                section.classList.add('show');
            } else {
                // 선택적으로 다시 스크롤 올리면 사라지게 하려면 아래 주석 해제
                // section.classList.remove('show');
            }
        });
    };

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // 초기 로드 시 한 번 실행

    // 5. 설문조사 별점 시스템
    const starRatingContainer = document.getElementById('starRating');
    const tasteRateInput = document.getElementById('tasteRate');
    const ratingMessage = document.getElementById('ratingMessage');
    const starMessages = [
        "흑... 곰돌맨 좌절금지 ㅠㅠ",
        "음... 아직 부족한가 봅니다...",
        "괜찮아요! 개선의 여지가 충분합니다!",
        "오! 아주 만족스러운 결과입니다! 🥳",
        "별 5개가 곧 채널 구독 각! ⭐️"
    ];

    if (starRatingContainer && tasteRateInput && ratingMessage) {
        const stars = starRatingContainer.querySelectorAll('.fa-star');

        const updateStars = (rating) => {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
            tasteRateInput.value = rating;
            ratingMessage.textContent = starMessages[rating - 1] || "별점을 선택해주세요!";
        };

        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.value);
                updateStars(rating);
                starRatingContainer.classList.remove('is-invalid-stars'); // 별점 선택 시 유효성 경고 제거
            });
        });

        // 초기화 시 별점 메시지 설정
        updateStars(parseInt(tasteRateInput.value) || 0);
    }


    // 6. 설문조사 제출 (Google Apps Script 연동)
    const surveyForm = document.getElementById('bearmanSurveyForm');
    const submitBtn = surveyForm ? surveyForm.querySelector('.survey-submit-btn') : null;
    const spinner = submitBtn ? submitBtn.querySelector('.spinner-border') : null;
    const buttonTextSpan = submitBtn ? submitBtn.querySelector('.button-text') : null;

    if (surveyForm) {
        surveyForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // 기본 폼 제출 방지

            // 필수로 표시된 필드들을 검사합니다.
            const requiredFields = surveyForm.querySelectorAll('[required]');
            let allFieldsFilled = true;
            requiredFields.forEach(field => {
                if (field.type === 'radio') {
                    const radioGroup = surveyForm.querySelector(`input[name="${field.name}"]:checked`);
                    if (!radioGroup) {
                        field.closest('div.mb-3').classList.add('has-validation-error'); // 부모 요소에 에러 표시
                        allFieldsFilled = false;
                    } else {
                        field.closest('div.mb-3').classList.remove('has-validation-error');
                    }
                } else if (!field.value.trim()) {
                    field.classList.add('is-invalid'); // Bootstrap 유효성 검사 클래스 추가
                    allFieldsFilled = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            // 별점 필드도 검사
            if (!tasteRateInput.value || tasteRateInput.value === "0") {
                starRatingContainer.classList.add('is-invalid-stars'); // 커스텀 클래스 추가
                allFieldsFilled = false;
            } else {
                starRatingContainer.classList.remove('is-invalid-stars');
            }

            if (!allFieldsFilled) {
                alert('필수 입력 항목을 모두 작성해주세요!');
                return;
            }

            // 버튼 상태 변경: 로딩 중...
            if (submitBtn) {
                submitBtn.disabled = true;
                if (spinner) spinner.classList.remove('d-none');
                if (buttonTextSpan) buttonTextSpan.innerHTML = '제출 중...';
            }

            const formData = new FormData(surveyForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Apps Script 웹 앱 URL (★★ 여기에 본인의 배포된 Apps Script URL을 넣어주세요! ★★)
            const appsScriptUrl = 'YOUR_DEPLOYED_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'; // 이 부분을 반드시 수정!

            try {
                // fetch 요청 수정: mode를 'cors'로 변경하고 응답을 제대로 처리합니다.
                const response = await fetch(appsScriptUrl, {
                    method: 'POST',
                    mode: 'cors', // CORS 정책에 따라 응답을 받기 위해 'cors' 모드 사용
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', // FormData 대신 일반 URL 인코딩 사용
                    },
                    body: new URLSearchParams(data).toString(), // FormData를 URLSearchParams로 변환
                });

                if (!response.ok) {
                    throw new Error(`HTTP 오류! 상태: ${response.status}`);
                }

                const result = await response.json(); // JSON 응답 파싱

                if (result.status === 'success') {
                    console.log('설문 데이터 전송 성공:', result.message, '추가된 행:', result.rowAdded);

                    const surveyModalElement = document.getElementById('surveyModal');
                    const surveyModal = bootstrap.Modal.getInstance(surveyModalElement);
                    if (surveyModal) {
                        surveyModal.hide(); // 설문 모달 닫기
                    }

                    const submitSuccessModal = new bootstrap.Modal(document.getElementById('submitSuccessModal'));
                    submitSuccessModal.show(); // 성공 모달 보여주기

                    surveyForm.reset(); // 폼 초기화
                    updateStars(0); // 별점 초기화
                } else {
                    throw new Error(result.message || 'Apps Script에서 오류 응답');
                }

            } catch (error) {
                console.error('설문 데이터 전송 실패:', error);
                alert('설문 제출 중 오류가 발생했습니다: ' + error.message + '\n콘솔 로그를 확인해주세요.');
            } finally {
                // 버튼 상태 원래대로 복구
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (spinner) spinner.classList.add('d-none');
                    if (buttonTextSpan) buttonTextSpan.innerHTML = '<i class="fas fa-paper-plane"></i> 설문 제출하기';
                }
            }
        });
    }

    // 모달이 닫힐 때 유효성 검사 상태 초기화 및 폼 리셋
    const surveyModalElement = document.getElementById('surveyModal');
    if (surveyModalElement) {
        surveyModalElement.addEventListener('hidden.bs.modal', () => {
            const invalidFields = surveyForm.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => field.classList.remove('is-invalid'));
            const invalidRadioContainers = surveyForm.querySelectorAll('.has-validation-error');
            invalidRadioContainers.forEach(container => container.classList.remove('has-validation-error'));
            const invalidStars = surveyForm.querySelector('.is-invalid-stars');
            if (invalidStars) invalidStars.classList.remove('is-invalid-stars');

            surveyForm.reset();
            updateStars(0);
            if (submitBtn) {
                submitBtn.disabled = false;
                if (spinner) spinner.classList.add('d-none');
                if (buttonTextSpan) buttonTextSpan.innerHTML = '<i class="fas fa-paper-plane"></i> 설문 제출하기';
            }
        });
    }

});
