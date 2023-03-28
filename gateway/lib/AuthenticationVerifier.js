import authApi from "../infrastructure/api/authApi.js";

class Authentication {

    static async verifyJWT(token) {
        const [res, error] = await authApi.VerifyToken(token)
        if (error) {
            console.log('error' + error)
            return false
        }
        console.log(res)
        if (res.status !== 200) return false
        return true
    }

}
export default Authentication