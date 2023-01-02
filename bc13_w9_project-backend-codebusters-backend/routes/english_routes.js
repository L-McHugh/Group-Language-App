import express from "express";
const router = express.Router();

import {
    getEnglishDefinitions,
    getEnglishDefinitionByTitle,
    updateEnglishDefinition,
    createEnglishDefinition,
    deleteEnglishDefinition
} from "../models/english_models.js";

// adding in error handling
router.get("/", async (req, res, next) => {
    try {
        const englishObjects = await getEnglishDefinitions();
        return res.json({ success: true, payload: englishObjects });
    } catch (err) {
        next(err);
    }
})

router.get("/:title", async (req, res, next) => {
    try {
        const englishObject = await getEnglishDefinitionByTitle(req.params.title);
        return res.json({ success: true, payload: englishObject });
    } catch (err) {
        next(err);
    }
})

router.post("/", async (req, res, next) => {
    try {
        const createEnglishObject = await createEnglishDefinition(req.body.title, req.body.definition, req.body.example, req.body.links, req.body.week);
        return res.json({ success: true, payload: createEnglishObject });
    } catch (err) {
        next(err);
    }
})

router.patch("/:id", async (req, res, next) => {
    try {
        const updateEnglishObject = await updateEnglishDefinition(req.params.id, req.body.title, req.body.definition, req.body.example, req.body.links, req.body.week);
        return res.json({ success: true, payload: updateEnglishObject });
    } catch (err) {
        next(err);
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const deleteEnglishObject = await deleteEnglishDefinition(req.params.id);
        return res.json({ success: true, payload: deleteEnglishObject });
    } catch (err) {
        next(err);
    }
})


export default router;

