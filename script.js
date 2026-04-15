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

    // === ПЕРЕКЛЮЧЕНИЕ МЕЖДУ БЛОКАМИ "ПРИДУ / НЕ ПРИДУ" ===
    const radioYes = document.querySelector('input[value="yes"]');
    const radioNo = document.querySelector('input[value="no"]');
    const yesBlock = document.getElementById('yesBlock');
    const noBlock = document.getElementById('noBlock');

    function toggleAttendanceBlocks() {
        if (radioNo.checked) {
            yesBlock.style.display = 'none';
            noBlock.style.display = 'block';
        } else {
            yesBlock.style.display = 'block';
            noBlock.style.display = 'none';
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
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        return response.ok;
    }

    submitBtn.addEventListener('click', async function() {
        const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
      // Формируем сообщение в зависимости от ответа
        let message = '';
        
        if (attendance === 'no') {
            const noMessage = document.getElementById('noMessage')?.value.trim() || 'Не оставлено';
            message = `💔 <b>Ответ: не придёт</b>\n\n` +
                `📝 <b>Пожелание/поздравление:</b> ${escapeHtml(noMessage)}\n` +
                `🕐 <b>Время:</b> ${new Date().toLocaleString()}`;
        } 
        else { // attendance === 'yes' (или по умолчанию)
            const names = document.getElementById('guestNames')?.value.trim();
            if (!names) {
                statusDiv.textContent = '❌ Пожалуйста, укажите имена гостей';
                statusDiv.className = 'form-status error';
                return;
            }

            // Собираем напитки
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
      // Отправляем
        statusDiv.textContent = '⏳ Отправка...';
        statusDiv.className = 'form-status';
        
        const success = await sendToTelegram(message);
        
        if (success) {
            statusDiv.textContent = '✅ Спасибо! Ваш ответ отправлен организаторам.';
            statusDiv.className = 'form-status success';
            
            // Очищаем форму
            const guestNamesField = document.getElementById('guestNames');
    if (guestNamesField) guestNamesField.value = '';

    const customInputField = document.getElementById('customDrink');
    if (customInputField) customInputField.value = '';

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