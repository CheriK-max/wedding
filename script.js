const BOT_TOKEN = '8610712714:AAEj0AiKPPOTelqyU5BiQNiUeQOtq2v5_a4';     // Сюда токен от @id199142634 (@BotFather)
const CHAT_ID = '1298894068';        

document.addEventListener('DOMContentLoaded', function() {
    // === Модальное окно ===
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
const weddingDetails = document.getElementById('weddingDetails'); // блок с деталями свадьбы

function toggleAttendanceBlocks() {
    if (radioNo && radioNo.checked) {
        // Скрываем блок для тех, кто придёт (напитки, аллергии)
        if (yesBlock) yesBlock.style.display = 'none';
        // Показываем блок для тех, кто не придёт (пожелания)
        if (noBlock) noBlock.style.display = 'block';
        // Скрываем ВСЕ детали свадьбы (дресс-код, пожелания, календарь, локацию)
        if (weddingDetails) weddingDetails.style.display = 'none';
    } else {
        // Показываем блок для тех, кто придёт
        if (yesBlock) yesBlock.style.display = 'block';
        // Скрываем блок для тех, кто не придёт
        if (noBlock) noBlock.style.display = 'none';
        // Показываем детали свадьбы
        if (weddingDetails) weddingDetails.style.display = 'block';
    }
}

if (radioYes && radioNo) {
    radioYes.addEventListener('change', toggleAttendanceBlocks);
    radioNo.addEventListener('change', toggleAttendanceBlocks);
    toggleAttendanceBlocks(); // Устанавливаем начальное состояние
}

    // === Логика для "Свой вариант" напитка ===
    const customCheckbox = document.querySelector('input[value="Свой вариант"]');
    const customInput = document.getElementById('customDrink');
    if (customCheckbox && customInput) {
        customCheckbox.addEventListener('change', function() {
            customInput.style.display = this.checked ? 'block' : 'none';
        });
    }

    // === ОТПРАВКА В TELEGRAM ===
    const submitBtn = document.getElementById('submitForm');
    const statusDiv = document.getElementById('formStatus');

    async function sendToTelegram(message) {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            return response.ok;
        } catch (error) {
            console.error('Ошибка:', error);
            return false;
        }
    }

   submitBtn.addEventListener('click', async function() {
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
    const names = document.getElementById('guestNames')?.value.trim();
    
    // Проверяем, заполнены ли имена (в любом случае)
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
        // Собираем выбранные напитки
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
        const phone = document.getElementById('phone')?.value.trim() || 'Не указан';

        message = `🎉 <b>Новый ответ на приглашение!</b>\n\n` +
            `✅ <b>Присутствие:</b> БУДЕТ\n` +
            `👥 <b>Гости:</b> ${escapeHtml(names)}\n` +
            `🍷 <b>Напитки:</b> ${escapeHtml(drinksText)}\n` +
            `⚠️ <b>Аллергии/пожелания:</b> ${escapeHtml(allergies)}\n` +
            `📞 <b>Телефон:</b> ${escapeHtml(phone)}\n` +
            `🕐 <b>Время:</b> ${new Date().toLocaleString()}`;
    }

    statusDiv.textContent = '⏳ Отправка...';
    statusDiv.className = 'form-status';
    
    const success = await sendToTelegram(message);
    
    if (success) {
        statusDiv.textContent = '✅ Спасибо! Ваш ответ отправлен организаторам.';
        statusDiv.className = 'form-status success';
        
        // Очистка формы
        const guestNamesField = document.getElementById('guestNames');
        if (guestNamesField) guestNamesField.value = '';
        if (customInput) customInput.value = '';
        const allergiesField = document.getElementById('allergies');
        if (allergiesField) allergiesField.value = '';
        const phoneField = document.getElementById('phone');
        if (phoneField) phoneField.value = '';
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
    // Добавляем классы для анимации дверей
    leftDoor.classList.add('open');
    rightDoor.classList.add('open');
    
    // Через 1.2 секунды (время анимации) скрываем экран-заставку
    setTimeout(() => {
        splash.style.display = 'none';
        weddingContainer.style.display = 'flex'; // Показываем основное приглашение
    }, 1200);
}

// Открытие по кнопке
if (openBtn) {
    openBtn.addEventListener('click', openDoors);
}
