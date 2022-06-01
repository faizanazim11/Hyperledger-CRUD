const express = require('express')
const router = express.Router();
const network = require('../system/network');

router.get('/read/:patientId', async (req, res) => {
    if (!req || !req.params) {
        res.status(400).send('Patient ID required in URL paramter');
        return;
    }

    mainNetwork = await network.setup(req.headers['mspID'] || 'doctor', 'Admin');

    const contract = mainNetwork.getContract('patient');

    try {
        const submitResult = await contract.evaluateTransaction('readPatient', req.params.patientId).catch(err => res.status(400).send(err));

        res.json(JSON.parse(submitResult.toString()));
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/create', async (req, res) => {
    if (!req || !req.body) {
        res.status(400).send('Patient details required in body');
        return;
    }

    mainNetwork = await network.setup(req.headers['mspID'] || 'doctor', 'Admin');

    const contract = mainNetwork.getContract('patient');

    const patientObj = {
        patientId: req.body.patientId,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        age: req.body.age,
        gender: req.body.gender,
        condition: req.body.condition
    }

    try {
        await contract.submitTransaction('createPatient', patientObj.patientId, patientObj.firstName, patientObj.middleName, patientObj.lastName, patientObj.age, patientObj.gender, patientObj.condition);

        res.json(patientObj);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/update', async (req, res) => {
    if (!req || !req.body) {
        res.status(400).send('Patient details required in body');
        return;
    }

    mainNetwork = await network.setup(req.headers['mspID'] || 'doctor', 'Admin');

    const contract = mainNetwork.getContract('patient');

    const patientObj = {
        patientId: req.body.patientId,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        age: req.body.age,
        gender: req.body.gender,
        condition: req.body.condition
    }

    try {
        await contract.submitTransaction('updatePatient', patientObj.patientId, patientObj.firstName, patientObj.middleName, patientObj.lastName, patientObj.age, patientObj.gender, patientObj.condition);

        res.json(patientObj);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/delete/:patientId", async (req, res) => {
    if (!req || !req.params) {
        res.status(400).send('Patient ID required in URL paramter');
        return;
    }

    mainNetwork = await network.setup(req.headers['mspID'] || 'doctor', 'Admin');

    const contract = mainNetwork.getContract('patient');

    try {
        await contract.submitTransaction('deletePatient', req.params.patientId);
        res.status(200).send("Patient deleted successfully!");
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;