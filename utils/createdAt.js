export function createdAt(){
    const options = {
      timeZone: 'America/Sao_Paulo', // Set time zone to Brazil (Brasília)
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Use 24-hour format
    };
  
    const formattedDateTime = new Date().toLocaleString('pt-BR', options);
    return formattedDateTime;
  }
