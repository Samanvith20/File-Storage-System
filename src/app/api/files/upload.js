import { authenticate } from "../middleware.js/verifyToken";


export const uploadFile = async (req, res) => {
     let user=authenticate()

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        return res.status(200).json({ message: 'File upload endpoint', user });
}