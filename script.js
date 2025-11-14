document.addEventListener('DOMContentLoaded', () => {
    // 1. Homepage Image Animation
    const premiereImage = document.getElementById('premiereImage');
    const premiereButtons = document.querySelector('.premiere-buttons');

    if (premiereImage) {
        setTimeout(() => {
            premiereImage.classList.add('loaded');
            premiereButtons.classList.add('loaded');
        }, 300); // 0.3초 후에 애니메이션 시작
    }

    // 2. Background Music Autoplay Control (user interaction might be needed for autoplay)
    const bgm = document.getElementById('background-music');
    // For autoplay to work consistently across browsers, a user interaction is usually required.
    // We can add a subtle prompt or ensure it starts on first click.
    document.body.addEventListener('click', () => {
        if (bgm && bgm.paused) {
            bgm.play().catch(e => {
                console.log("Background music autoplay prevented:", e);
                // Optionally show a button for user to play music manually
            });
        }
    }, { once: true }); // Only try to play once on first click


    // 3. Survey Form Submission
    const surveyForm = document.getElementById('surveyForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // **IMPORTANT**: Replace with your deployed Google Apps Script Web App URL
    const GOOGLE_APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwbH_gtT0FrgRL5op4cSDkhE8JMuJkZq6p21_ymd1CIE1G_TZwUGkwPSYoOT8EjbQZHhA/exec'; 
    // 예시: 'https://script.google.com/macros/s/AKfycbzzzzz_your_deploy_id_zzzzzz/exec'

    surveyForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Clear previous messages
        successMessage.classList.add('d-none');
        errorMessage.classList.add('d-none');
        loadingSpinner.classList.remove('d-none'); // Show loading spinner

        const formData = new FormData(surveyForm);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Get current timestamp
        data['timestamp'] = new Date().toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

        // IP 주소 수집 관련 코드를 모두 제거했습니다!

        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_WEB_APP_URL, {
                method: 'POST',
                mode: 'cors', // Enable CORS for cross-origin requests
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString(), // URL-encoded form data
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status === 'success') {
                    surveyForm.reset(); // Clear form
                    successMessage.classList.remove('d-none');
                } else {
                    errorMessage.textContent = '설문 제출에 실패했습니다: ' + (result.message || '알 수 없는 오류');
                    errorMessage.classList.remove('d-none');
                }
            } else {
                errorMessage.textContent = `서버 오류 발생: ${response.status} ${response.statusText}`;
                errorMessage.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            errorMessage.textContent = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
            errorMessage.classList.remove('d-none');
        } finally {
            loadingSpinner.classList.add('d-none'); // Hide loading spinner
        }
    });
});
