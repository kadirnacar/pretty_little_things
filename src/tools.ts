import { PassThrough ,Readable} from 'stream';

export const createStream = (text) => {
    const rv = new Readable() // PassThrough is also a Readable stream
    rv.push(text)
    rv.push(null)
    return rv;
}