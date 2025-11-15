import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const startBtn = document.querySelector('.btn-start'); // кнопка Start
const inputPicker = document.querySelector('#datetime-picker'); // input для вибору дати

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerInterval = null;

flatpickr(inputPicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      window.alert('Please choose a date in the future');
      startBtn.disabled = true;
      userSelectedDate = null;
      return;
    }

    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  },
});

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateTimer() {
  const now = new Date();
  const delta = userSelectedDate - now;

  if (delta <= 0) {
    clearInterval(timerInterval);
    daysEl.textContent =
      hoursEl.textContent =
      minutesEl.textContent =
      secondsEl.textContent =
        '00';
    return;
  }

  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  const seconds = Math.floor((delta / 1000) % 60);

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;
  clearInterval(timerInterval);
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
  startBtn.disabled = true;
});
