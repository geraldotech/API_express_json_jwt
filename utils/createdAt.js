export function createdAt(){
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yy = String(today.getFullYear()).slice(2);
  const hh = String(today.getHours()).padStart(2, '0');
  const min = String(today.getMinutes()).padStart(2, '0');
  const ss = String(today.getSeconds()).padStart(2, '0');
  const formattedDateTime = `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;
  
  return formattedDateTime
}