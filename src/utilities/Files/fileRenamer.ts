import * as fs from 'fs';

export const fileRenamer = (oldPath : string, newPath : string) => {
  const path = `${process.env.DATA_PATH}/data/${newPath}`

  if(fs.existsSync(path)){
    fs.rmSync(path)
  }
  fs.renameSync(oldPath, path)
  
}