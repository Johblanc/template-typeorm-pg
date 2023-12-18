

/** Permet de déterminer le nom du fichier stoqué */
export const dataFilename = (_ :any, file : Express.Multer.File , cb : (error: Error | null, filename: string) => void) => {
  cb(null, file.originalname.replace(/: /g, '-'))
}
