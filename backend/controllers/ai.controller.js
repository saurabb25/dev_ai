import * as aiService from "../services/genAI.service.js"
export const generateResult =async (req, res)=>{
    try {
        const {prompt} = req.query
        const result = await aiService.generateResult(prompt)
        res.send(result)

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}