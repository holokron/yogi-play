import app from '../app'

export interface AudioProvider {
    getAudio(path: string): Promise<HTMLAudioElement>
}

const audioProvider: AudioProvider = {
    getAudio: (path: string): Promise<HTMLAudioElement> => {
        const key = `downloadLink[${path}]`
        const downloadUrl: string | null = localStorage.getItem(key)

        if (downloadUrl) {
            const audio = new Audio(downloadUrl)
            if (!audio.duration) {
                return Promise.resolve(audio)
            }
        }

        return app.storage()
            .ref(path)
            .getDownloadURL()
            .then((url: string) => {
                localStorage.setItem(key, url)

                return new Audio(url)
            })
    }
}

export default audioProvider