function getidsingle() {
  const copyids = document.querySelectorAll('#singleid')

  for (const i of copyids) {
    i.addEventListener('click', (e) => {
      
      const copy = e.target.textContent
      navigator.clipboard.writeText(copy).then(() => {
        alert('copiado')
      })
    })
  }
}

setTimeout(getidsingle, 500)
