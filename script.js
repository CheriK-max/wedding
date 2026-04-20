// ========== ОТКРЫТИЕ ДВЕРЕЙ (глобальный код, выполняется сразу) ==========
const splash = document.getElementById('splashScreen');
const leftDoor = document.getElementById('leftDoor');
const rightDoor = document.getElementById('rightDoor');
const openBtn = document.getElementById('openDoorsBtn');
const weddingContainer = document.getElementById('weddingContainer');

function openDoors() {
    if (leftDoor) leftDoor.classList.add('open');
    if (rightDoor) rightDoor.classList.add('open');
    setTimeout(() => {
        if (splash) splash.style.display = 'none';
        if (weddingContainer) {
            weddingContainer.style.display = 'block';
            weddingContainer.style.opacity = '1';
        }
    }, 1200);
}

if (openBtn) {
    openBtn.addEventListener('click', openDoors);
}

// ========== ВСЯ ОСТАЛЬНАЯ ЛОГИКА (после загрузки DOM) ==========
document.addEventListener('DOMContentLoaded', function() {
    // Переключение блоков "Приду / Не приду"
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

    // Логика для "Свой вариант" напитка
    const customCheckbox = document.querySelector('input[value="Свой вариант"]');
    const customInput = document.getElementById('customDrink');
    if (customCheckbox && customInput) {
        customCheckbox.addEventListener('change', function() {
            customInput.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Отправка в Telegram через API Vercel
    const submitBtn = document.getElementById('submitForm');
    const statusDiv = document.getElementById('formStatus');

    async function sendToTelegramAPI(message) {
        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
            return response.ok;
        } catch (error) {
            console.error('Ошибка при вызове API:', error);
            return false;
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    if (submitBtn) {
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
                        else selectedDrinks.push('Свой вариант (не указан)');
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

            const success = await sendToTelegramAPI(message);

            if (success) {
                statusDiv.textContent = '✅ Спасибо! Ваш ответ отправлен организаторам.';
                statusDiv.className = 'form-status success';
                // Очистка формы
                const guestNamesField = document.getElementById('guestNames');
                if (guestNamesField) guestNamesField.value = '';
                if (customInput) customInput.value = '';
                const allergiesField = document.getElementById('allergies');
                if (allergiesField) allergiesField.value = '';
                const noMessageField = document.getElementById('noMessage');
                if (noMessageField) noMessageField.value = '';
                document.querySelectorAll('.drink-option input[type="checkbox"]:checked').forEach(cb => cb.checked = false);
            } else {
                statusDiv.textContent = '❌ Ошибка отправки. Попробуйте позже или свяжитесь с нами напрямую.';
                statusDiv.className = 'form-status error';
            }
        });
    }
});
