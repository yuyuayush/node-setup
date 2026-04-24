import sharp from "sharp";
import {workerData,parentPort} from "worker_threads"

async function imageProcessing(){

    const buffer = workerData;

    try{

      const [mobile, laptop, desktop] = await Promise.all([
                        sharp(buffer)
                       .resize(300, 300, { fit: 'cover' })
                       .webp({ quality: 80 })
                       .toBuffer(),

                       sharp(buffer)
                       .resize(300, 300, { fit: 'cover' })
                       .webp({ quality: 80 })
                       .toBuffer(),

                       sharp(buffer)
                       .resize(300, 300, { fit: 'cover' })
                       .webp({ quality: 80 })
                       .toBuffer(),
      ])

      parentPort.postMessage({
        success:true,
        results:{
            mobile,
            laptop,
            desktop
        }
      })

    }catch(error){
        parentPort.postMessage({
            success:false,
            error:error.message
        })
    }

}
imageProcessing();