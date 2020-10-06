function displayDate(date){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const disp = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  return disp;
}

export { displayDate }
