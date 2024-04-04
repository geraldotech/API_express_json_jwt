const Production = true
export const baseURL = Production ? 'https://api.gpdev.tech/products/' : 'http://localhost:3001/products/'

export function hello(){
  return 1 + 1
}
