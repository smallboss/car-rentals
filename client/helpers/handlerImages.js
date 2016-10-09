/**
 * Created by watcher on 10/7/16.
 */

export function imgToBase64 (image, callback) {
    let reader = new FileReader()
    reader.readAsDataURL(image)
    reader.onloadend = () => {
        callback(reader.result)
    }
}