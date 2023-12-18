import * as fs from 'fs';

export const fileRemover = (path : string) => {
  if(fs.existsSync(path)){
    fs.rmSync(path)
  }
}