import multer from 'multer'

//Usar o memoryStorange para enciar para o cloudinary

export default {
    storage: multer.memoryStorage(),
        limits: {
        fileSize:4 * 1024*1024,
    },
    fileFilter: (_req:any, file: Express.Multer.File, cb:any) => {
        const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg'];
        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error('Formato de arquivo inválido, utilize png,jpg ou jpeg ou maximo 4Mb'));
        }
    }
}