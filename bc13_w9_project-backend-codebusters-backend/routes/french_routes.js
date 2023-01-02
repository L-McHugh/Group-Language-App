import express from "express";
const frenchRouter = express.Router();

import {
    getFrenchDefinitions,
    getFrenchDefinitionByTitle,
    updateFrenchDefinition,
    createFrenchDefinition,
    deleteFrenchDefinition,
    getFrenchDefinitionByEnglishTitle
} from "../models/french_models.js";

// adding in error handling middleware to the router so that we can use next(err) in the routes
// did it this way so that we don't have to add it to every route
// also added a console.log so that we can see the error in the console

frenchRouter.use((err, req, res, next) => {
    console.log(err);
    return res.status(err.code).json({ success: false, error: err });
})

frenchRouter.get("/", async (req, res) => {
    const allFrenchObject = await getFrenchDefinitions();
    return res.json({ success: true, payload: allFrenchObject });
})

frenchRouter.get("/:title", async (req, res) => {
    const frenchObject = await getFrenchDefinitionByTitle(req.params.title);
    return res.json({ success: true, payload: frenchObject });
})

frenchRouter.get("/english/:title", async (req, res) => {
    const frenchObject = await getFrenchDefinitionByEnglishTitle(req.params.title);
    return res.json({ success: true, payload: frenchObject })
})

frenchRouter.post("/", async (req, res) => {
    const createFrenchObject = await createFrenchDefinition(req.body.englishtitle, req.body.title, req.body.definition, req.body.example, req.body.links, req.body.week);
    return res.json({ success: true, payload: createFrenchObject });
})

frenchRouter.patch("/:id", async (req, res) => {
    const updateFrenchObject = await updateFrenchDefinition(req.params.id, req.body.englishtitle, req.body.title, req.body.definition, req.body.example, req.body.links, req.body.week);
    return res.json({ success: true, payload: updateFrenchObject });
})

frenchRouter.delete("/:id", async (req, res) => {
    const deleteFrenchObject = await deleteFrenchDefinition(req.params.id);
    return res.json({ success: true, payload: deleteFrenchObject });
})

export default frenchRouter;

