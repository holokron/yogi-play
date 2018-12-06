import app from '../app'
import 'firebase/storage'

export interface AudioProvider {
    getAudio(path: string): Promise<string>
}

const audioProvider: AudioProvider = {
    getAudio: (path: string): Promise<string> => {
        const key = `downloadLink[${path}]`
        const downloadUrl: string | null = localStorage.getItem(key)

        if (downloadUrl) {
            return Promise.resolve(downloadUrl)
        }

        return app.storage()
            .ref(path)
            .getDownloadURL()
    }
}

export default audioProvider