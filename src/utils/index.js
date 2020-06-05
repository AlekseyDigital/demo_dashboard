export const getTimePassed = function (date) {
  let result = '';
  const dateNow = new Date();
  const diff = dateNow - date;
  if (diff > 0) {
    const secondsPassed = Math.ceil(diff / 1000);
    const MIN = 60;
    const HOUR = 60 * 60;
    const DAY = 24 * 60 * 60;
    if (secondsPassed < MIN) {
      result += `${secondsPassed} ${pluralize(secondsPassed, 'секунда', 'секунды', 'секунд')}`;
    } else if (secondsPassed >= MIN && secondsPassed < HOUR) {
      let value = Math.ceil(secondsPassed / MIN);
      result += `${value} ${pluralize(value, 'минута', 'минуты', 'минут')}`;
    } else if (secondsPassed >= HOUR && secondsPassed < DAY) {
      let value = Math.ceil(secondsPassed / HOUR);
      result += `${value} ${pluralize(value, 'час', 'часа', 'часов')}`;
    } else if (secondsPassed >= DAY) {
      let value = Math.ceil(secondsPassed / DAY);
      result += `${value} ${pluralize(value, 'день', 'дня', 'дней')}`;
    }
    result += ' назад';
  }
  return result;
};

export const pluralize = function (value, one, twoToFour, fiveToNine) {
  let result = '';
  const ost = value % 10;
  if (ost === 1) {
    result = one;
  } else if (ost >= 2 && ost <= 4) {
    result = twoToFour;
  } else if (
    ost === 0 ||
    (ost >= 5 && ost <= 9) ||
    (value >= 11 && value <= 19)
  ) {
    result = fiveToNine;
  }
  return result;
};
