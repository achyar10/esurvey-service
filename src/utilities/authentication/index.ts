import * as bcrypt from 'bcrypt'

export default class Helper {

    public static hashing(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }

    public static compare = async (text: string, encryptedText: string): Promise<Boolean> => {
        const result = await bcrypt.compare(text, encryptedText)
        return result
    }

}