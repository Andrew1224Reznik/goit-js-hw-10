// Импорт библиотеки flatpickr
import flatpickr from 'flatpickr';
// Импорт стилей flatpickr
import 'flatpickr/dist/flatpickr.min.css';

// Импорт iziToast
import iziToast from 'izitoast';
// Импорт стилей iziToast
import 'izitoast/dist/css/iziToast.min.css';

// Находим кнопку Start
const startBtn = document.querySelector('.btn-start');
// Находим input с выбором даты
const inputPicker = document.querySelector('#datetime-picker');

// Находим элементы таймера
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

// Выбранная пользователем дата
let userSelectedDate = null;
// ID интервала таймера
let timerInterval = null;

// Функция добавления ведущего нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0'); // добавляем "0" если меньше двух символов
}

// Функция преобразования миллисекунд
function convertMs(ms) {
  const second = 1000; // миллисекунд в секунде
  const minute = second * 60; // миллисекунд в минуте
  const hour = minute * 60; // миллисекунд в часе
  const day = hour * 24; // миллисекунд в сутках

  const days = Math.floor(ms / day); // получаем дни
  const hours = Math.floor((ms % day) / hour); // часы
  const minutes = Math.floor(((ms % day) % hour) / minute); // минуты
  const seconds = Math.floor((((ms % day) % hour) % minute) / second); // секунды

  return { days, hours, minutes, seconds }; // возвращаем объект
}

// Изначально кнопка должна быть отключена
startBtn.disabled = true;

// Инициализация flatpickr
flatpickr(inputPicker, {
  enableTime: true, // включаем выбор времени
  time_24hr: true, // 24-часовой формат
  defaultDate: new Date(), // текущая дата
  minuteIncrement: 1, // шаг минут
  onClose(selectedDates) {
    const selectedDate = selectedDates[0]; // получаем выбранную дату

    // Проверяем, выбрал ли пользователь прошлую дату
    if (selectedDate <= new Date()) {
      // Показываем уведомление iziToast
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        timeout: 3000,
        position: 'topRight',
      });

      startBtn.disabled = true; // блокируем кнопку Start
      userSelectedDate = null; // очищаем выбранную дату
      return;
    }

    // Если дата валидная — сохраняем её
    userSelectedDate = selectedDate;
    startBtn.disabled = false; // разблокируем Start
  },
});

// Функция обновления интерфейса таймера
function updateInterface({ days, hours, minutes, seconds }) {
  daysEl.textContent = days; // дни отображаются как есть (могут быть >2 цифр)
  hoursEl.textContent = addLeadingZero(hours); // форматируем 00
  minutesEl.textContent = addLeadingZero(minutes); // форматируем 00
  secondsEl.textContent = addLeadingZero(seconds); // форматируем 00
}

// Обработка клика по кнопке Start
startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return; // защита

  startBtn.disabled = true; // блокируем кнопку Start
  inputPicker.disabled = true; // блокируем input

  // Запускаем таймер
  timerInterval = setInterval(() => {
    const now = new Date(); // текущее время
    const delta = userSelectedDate - now; // разница между датами

    // Если время вышло — останавливаем
    if (delta <= 0) {
      clearInterval(timerInterval); // стоп таймера

      // Обнуляем отображение
      updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      inputPicker.disabled = false; // разрешаем выбрать новую дату
      startBtn.disabled = true; // Start остаётся выключенной
      return;
    }

    // Получаем объект с временем
    const time = convertMs(delta);

    // Обновляем интерфейс
    updateInterface(time);
  }, 1000); // тик каждую секунду
});
