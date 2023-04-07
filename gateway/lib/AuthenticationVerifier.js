import authApi from "../infrastructure/api/authApi.js";

class Authentication {

    static async verifyJWT(token) {
        const [res, error] = await authApi.VerifyToken(token)
        if (error) {
            console.log('error' + error)
            return null
        }
        if (res.status !== 200) return null
        return res.data
    }

}
export default Authentication