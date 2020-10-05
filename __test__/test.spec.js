
function displayDate(date){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const disp = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  return disp;
}

test('test display date function',() => {
  const date = new Date('5-5-2020');
  expect(displayDate(date)).toBe('5 May 2020');
});
