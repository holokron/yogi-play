import app from '../app'

export interface AudioProvider {
    getAudio(path: string): Promise<HTMLAudioElement>
}

const audioProvider: AudioProvider = {
    getAudio: (path: string): Promise<HTMLAudioElement> => 
        app.storage()
            .ref(path)
            .getDownloadURL()
            .then((url: string) => new Audio(url))
}

export default audioProvider