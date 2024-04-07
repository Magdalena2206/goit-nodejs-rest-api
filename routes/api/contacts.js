const express = require('express');
const router = express.Router();
const Contacts = require('../../models/contacts.js');
const {validateContact, validateId} = require('./validation.js');

router.get('/', async (req, res, next) => {
    try {
        console.log(req.method);
        const contacts = await Contacts.listContacts();
        res.json({status: 200, data: {contacts}});
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const contact = await Contacts.getContactById(req.params.id);
        if (contact) {
            return res
                .status(200)
                .json({status: 'success', code: 200, data: {contact}});
        }
        return res
            .status(404)
            .json({status: 'error', code: 404, message: 'Not Found'});
    } catch (error) {
        next(error);
    }
});

router.post('/', validateContact, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const contact = req.params;
    if (name || email || phone) {
      return res.json({ status: 400, message: "missing required name - field" });
    }
      const addContact = await Contacts.addContact(req.body);
      if (!addContact) {
        return res.json({ status: 201, data: { contact } });
        }
    
    } catch (error) {
      next(error);
    }
  });



router.delete('/:id', async (req, res, next) => {
    try {
        const contact = await Contacts.removeContact(req.params.id);
        if (contact) {
            return res
                .status(200)
                .json({status: 'success', code: 200, data: {contact}});
        }
        return res
            .status(404)
            .json({status: 'error', code: 404, message: 'Not Found'});
    } catch (error) {
        next(error);
    }
});

router.put("/:id", validateId, async (req, res, next) => {
    const {name, email, phone} = req.body;
    const contactId = req.params.id;
    if (!name || !email || !phone)
        return res.status(400).json({message: "missing fields"});
    const updatedContact = await Contacts.updateContact(contactId, {name, email, phone});
    if (!updatedContact) return res.status(404).json({message: "Not found"});
    // res.json({
    //     status: "success",
    //     code: 200,
    //     data: {
    //         updatedContact,
    //     },
    // });
});

router.patch('/:id', async (req, res, next) => {
    res.json({message: 'template message'});
});

module.exports = router;