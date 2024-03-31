function getidsingle() {
  const copyids = document.querySelectorAll('#singleid')

  for (const i of copyids) {
    i.addEventListener('click', (e) => {
      
      const copy = e.target.textContent
      const eventEl = e.target
      navigator.clipboard.writeText(copy).then((e) => {
        // clean eventEl color
        eventEl.style.color = 'green'
        setTimeout(() => {
          eventEl.style.color = ''
        }, 1000)
      })
    })
  }
}

setTimeout(getidsingle, 500)
