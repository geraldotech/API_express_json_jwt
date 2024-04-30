import fs from 'fs'


export function categories() {
  return new Promise((resolve, reject) => {
    fs.readFile('./db/category.json', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const category = JSON.parse(data);
        resolve(category);
      }
    });
  });
}