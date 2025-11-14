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
    // 예를 들어, 페이지의 아무 곳이나 클릭 시 재생 시도:
    document.body.addEventListener('click', function attemptPlay() {
        if (!isPlaying) {
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
                section.classList.remove('show'); // 다시 스크롤 올리면 사라지게
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
            });
        });

        // 초기화 시 별점 메시지 설정
        updateStars(parseInt(tasteRateInput.value) || 0);
    }


    // 6. 설문조사 제출 (Google Apps Script 연동)
    const surveyForm = document.getElementById('bearmanSurveyForm');
    const submitBtn = surveyForm ? surveyForm.querySelector('.survey-submit-btn') : null;
    const spinner = submitBtn ? submitBtn.querySelector('.spinner-border') : null;
    const buttonText = submitBtn ? submitBtn.querySelector('.button-text') : null;

    if (surveyForm) {
        surveyForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // 기본 폼 제출 방지

            // 필수로 표시된 필드들을 검사합니다.
            const requiredFields = surveyForm.querySelectorAll('[required]');
            let allFieldsFilled = true;
            requiredFields.forEach(field => {
                if (!field.value.trim() || (field.type === 'radio' && !surveyForm.querySelector(`input[name="${field.name}"]:checked`))) {
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

            if (submitBtn) {
                submitBtn.disabled = true;
                if (spinner) spinner.classList.remove('d-none');
                if (buttonText) buttonText.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 제출 중...';
            }

            const formData = new FormData(surveyForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Apps Script 웹 앱 URL (★★ 여기에 본인의 배포된 Apps Script URL을 넣어주세요! ★★)
            const appsScriptUrl = 'YOUR_DEPLOYED_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'; // 이 부분을 반드시 수정!

            try {
                const response = await fetch(appsScriptUrl, {
                    method: 'POST',
                    mode: 'no-cors', // CORS 문제 우회를 위해 no-cors 사용. 실제 응답을 받지 못함.
                                     // 응답을 받으려면 Apps Script에서 적절한 CORS 헤더를 설정하고 'cors' 모드를 사용해야 합니다.
                                     // 하지만 여기서는 데이터 전송 성공 여부만 확인하므로 no-cors도 무방합니다.
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data).toString(),
                });

                // no-cors 모드에서는 response.ok 등을 직접 확인할 수 없습니다.
                // 성공적인 전송을 가정하고 처리하거나, 보다 정교한 오류 처리를 위해
                // Apps Script에서 'Content-Type': 'application/json'과 함께 JSON 응답을 반환하고
                // CORS 헤더를 설정한 후 mode: 'cors'로 변경하는 것이 좋습니다.

                console.log('설문 데이터 전송 요청 완료 (응답 확인 불가: no-cors 모드)');

                const surveyModalElement = document.getElementById('surveyModal');
                const surveyModal = bootstrap.Modal.getInstance(surveyModalElement);
                if (surveyModal) {
                    surveyModal.hide(); // 설문 모달 닫기
                }

                const submitSuccessModal = new bootstrap.Modal(document.getElementById('submitSuccessModal'));
                submitSuccessModal.show(); // 성공 모달 보여주기

                surveyForm.reset(); // 폼 초기화
                updateStars(0); // 별점 초기화

            } catch (error) {
                console.error('설문 데이터 전송 실패:', error);
                alert('설문 제출 중 오류가 발생했습니다. 다시 시도해주세요. 개발자에게 문의: ' + error.message);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (spinner) spinner.classList.add('d-none');
                    if (buttonText) buttonText.innerHTML = '<i class="fas fa-paper-plane"></i> 설문 제출하기';
                }
            }
        });
    }

    // 모달이 닫힐 때 유효성 검사 상태 초기화
    const surveyModalElement = document.getElementById('surveyModal');
    if (surveyModalElement) {
        surveyModalElement.addEventListener('hidden.bs.modal', () => {
            const invalidFields = surveyForm.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => field.classList.remove('is-invalid'));
            const invalidStars = surveyForm.querySelector('.is-invalid-stars');
            if (invalidStars) invalidStars.classList.remove('is-invalid-stars');
            surveyForm.reset();
            updateStars(0);
            if (submitBtn) {
                submitBtn.disabled = false;
                if (spinner) spinner.classList.add('d-none');
                if (buttonText) buttonText.innerHTML = '<i class="fas fa-paper-plane"></i> 설문 제출하기';
            }
        });
    }

});
