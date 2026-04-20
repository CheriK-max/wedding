document.addEventListener('DOMContentLoaded', function() {
    // === Модальное окно (если используется) ===
    const rsvpBtn = document.getElementById('rsvpButton');
    const modal = document.getElementById('modal');
    const closeSpan = document.querySelector('.close');
    const doneBtn = document.getElementById('doneButton');

    if (rsvpBtn) rsvpBtn.addEventListener('click', () => modal.style.display = 'flex');
    if (closeSpan) closeSpan.addEventListener('click', () => modal.style.display = 'none');
    if (doneBtn) doneBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        alert('Спасибо! Мы вас ждём 💖');
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
    });

    // === Переключение блоков "Приду / Не приду" ===
    const radioYes = document.querySelector('input[value="yes"]');
    const radioNo = document.querySelector('input[value="no"]');
    const yesBlock = document.getElementById('yesBlock');
    const noBlock = document.getElementById('noBlock');
    const weddingDetails = document.getElementById('weddingDetails');

    function toggleAttendanceBlocks() {
        if (radioNo && radioNo.checked) {
            if (yesBlock) yesBlock.style.display = 'none';
            if (noBlock) noBlock.style.display = 'block';
            if (weddingDetails) weddingDetails.style.display = 'none';
        } else {
            if (yesBlock) yesBlock.style.display = 'block';
            if (noBlock) noBlock.style.display = 'none';
            if (weddingDetails) weddingDetails.style.display = 'block';
        }
    }

    if (radioYes && radioNo) {
        radioYes.addEventListener('change', toggleAttendanceBlocks);
        radioNo.addEventListener('change', toggleAttendanceBlocks);
        toggleAttendanceBlocks();
    }

    // === Логика для "Свой вариант" напитка ===
    const customCheckbox = document.querySelector('input[value="Свой вариант"]');
    const customInput = document.getElementById('customDrink');
    if (customCheckbox && customInput) {
        customCheckbox.addEventListener('change', function() {
            customInput.style.display = this.checked ? 'block' : 'none';
        });
    }

    // === ОТПРАВКА ЧЕРЕЗ СВОЙ API (Vercel) ===
    const submitBtn = document.getElementById('submitForm');
    const statusDiv = document.getElementById('formStatus');

    async function sendToMyApi(message) {
        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            return response.ok;
        } catch (error) {
            console.error('Ошибка вызова API:', error);
            return false;
        }
    }

    submitBtn.addEventListener('click', async function() {
        const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
        const names = document.getElementById('guestNames')?.value.trim();
        
        if (!names) {
            statusDiv.textContent = '❌ Пожалуйста, укажите имена гостей';
            statusDiv.className = 'form-status error';
            return;
        }
        
        let message = '';
        
        if (attendance === 'no') {
            const noMessage = document.getElementById('noMessage')?.value.trim() || 'Не оставлено';
            message = `💔 <b>Ответ: не придёт</b>\n\n` +
                `👥 <b>Гости:</b> ${escapeHtml(names)}\n` +
                `📝 <b>Пожелание/поздравление:</b> ${escapeHtml(noMessage)}\n` +
                `🕐 <b>Время:</b> ${new Date().toLocaleString()}`;
        } else {
            const selectedDrinks = [];
            document.querySelectorAll('.drink-option input[type="checkbox"]:checked').forEach(cb => {
                if (cb.value === 'Свой вариант') {
                    const custom = customInput?.value.trim();
                    if (custom) selectedDrinks.push(`Свой вариант: ${custom}`);
                    else


Drinks.push('Свой вариант (не указан)');
                } else {
                    selectedDrinks.push(cb.value);
                }
            });
            const drinksText = selectedDrinks.length ? selectedDrinks.join(', ') : 'Не указано';
            const allergies = document.getElementById('allergies')?.value.trim() || 'Не указано';
            message = `🎉 <b>Новый ответ на приглашение!</b>\n\n` +
                `✅ <b>Присутствие:</b> БУДЕТ\n` +
                `👥 <b>Гости:</b> ${escapeHtml(names)}\n` +
                `🍷 <b>Напитки:</b> ${escapeHtml(drinksText)}\n` +
                `⚠️ <b>Аллергии/пожелания:</b> ${escapeHtml(allergies)}\n` +
                `🕐 <b>Время:</b> ${new Date().toLocaleString()}`;
        }

        statusDiv.textContent = '⏳ Отправка...';
        statusDiv.className = 'form-status';
        
        const success = await sendToMyApi(message);
        
        if (success) {
            statusDiv.textContent = '✅ Спасибо! Ваш ответ отправлен организаторам.';
            statusDiv.className = 'form-status success';
            // Очистка формы
            document.getElementById('guestNames').value = '';
            if (customInput) customInput.value = '';
            document.getElementById('allergies').value = '';
            const noMessageField = document.getElementById('noMessage');
            if (noMessageField) noMessageField.value = '';
            document.querySelectorAll('.drink-option input[type="checkbox"]:checked').forEach(cb => cb.checked = false);
        } else {
            statusDiv.textContent = '❌ Ошибка отправки. Пожалуйста, свяжитесь с нами напрямую в Telegram';
            statusDiv.className = 'form-status error';
        }
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

// === ЭФФЕКТ ОТКРЫВАЮЩИХСЯ ДВЕРЕЙ ===
const splash = document.getElementById('splashScreen');
const leftDoor = document.getElementById('leftDoor');
const rightDoor = document.getElementById('rightDoor');
const openBtn = document.getElementById('openDoorsBtn');
const weddingContainer = document.getElementById('weddingContainer');

function openDoors() {
    leftDoor.classList.add('open');
    rightDoor.classList.add('open');
    setTimeout(() => {
        splash.style.display = 'none';
        weddingContainer.style.display = 'flex';
    }, 1200);
}

if (openBtn) {
    openBtn.addEventListener('click', openDoors);
} selected
