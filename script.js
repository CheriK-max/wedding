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

    // Отправка формы
    const submitBtn = document.getElementById('submitForm');
    const statusDiv = document.getElementById('formStatus');

    async function sendToAPI(message) {
        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            return response.ok;
        } catch (err) {
            console.error('Fetch error:', err);
            return false;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
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
                const noMsg = document.getElementById('noMessage')?.value.trim() || 'Не оставлено';
                message = `💔 <b>Ответ: не придёт</b>\n\n👥 <b>Гости:</b> ${escapeHtml(names)}\n📝 <b>Пожелание:</b> ${escapeHtml(noMsg)}\n🕐 <b>Время:</b> ${new Date().toLocaleString()}`;
            } else {
                const selectedDrinks = [];
                document.querySelectorAll('.drink-option input[type="checkbox"]:checked').forEach(cb => {
                    if (cb.value === 'Свой вариант') {
                        const custom = customInput?.value.trim();
                        selectedDrinks.push(custom ? `Свой вариант: ${custom}` : 'Свой вариант (не указан)');
                    } else {
                        selectedDrinks.push(cb.value);
                    }
                });
                const drinksText = selectedDrinks.length ? selectedDrinks.join(', ') : 'Не указано';
                const allergies = document.getElementById('allergies')?.value.trim() || 'Не указано';
                message = `🎉 <b>Новый ответ на приглашение!</b>\n\n✅ <b>Присутствие:</b> БУДЕТ\n👥 <b>Гости:</b> ${escapeHtml(names)}\n🍷 <b>Напитки:</b> ${escapeHtml(drinksText)}\n⚠️ <b>Аллергии/пожелания:</b> ${escapeHtml(allergies)}\n🕐 <b>Время:</b> ${new Date().toLocaleString()}`;


statusDiv.textContent = '⏳ Отправка...';
            statusDiv.className = 'form-status';
            const success = await sendToAPI(message);

            if (success) {
                statusDiv.textContent = '✅ Спасибо! Ваш ответ отправлен организаторам.';
                statusDiv.className = 'form-status success';
                // Очистка формы
                document.getElementById('guestNames').value = '';
                if (customInput) customInput.value = '';
                document.getElementById('allergies').value = '';
                const noMsgField = document.getElementById('noMessage');
                if (noMsgField) noMsgField.value = '';
                document.querySelectorAll('.drink-option input[type="checkbox"]:checked').forEach(cb => cb.checked = false);
            } else {
                statusDiv.textContent = '❌ Ошибка отправки. Попробуйте позже или свяжитесь с нами напрямую.';
                statusDiv.className = 'form-status error';
            }
        });
    }
});}
