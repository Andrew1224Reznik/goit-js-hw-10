import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('.btn-start');
const inputPicker = document.querySelector('#datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerInterval = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0'); // добавляем "0" если меньше двух символов
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startBtn.disabled = true;

flatpickr(inputPicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        timeout: 3000,
        position: 'topRight',
      });

      startBtn.disabled = true;
      userSelectedDate = null;
      return;
    }

    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  },
});

function updateInterface({ days, hours, minutes, seconds }) {
  daysEl.textContent = days;
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  inputPicker.disabled = true;

  timerInterval = setInterval(() => {
    const nowDate = new Date();
    const delta = userSelectedDate - nowDate;

    if (delta <= 0) {
      clearInterval(timerInterval);
      updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      inputPicker.disabled = false;
      startBtn.disabled = true;
      return;
    }

    const time = convertMs(delta);

    updateInterface(time);
  }, 1000);
});
