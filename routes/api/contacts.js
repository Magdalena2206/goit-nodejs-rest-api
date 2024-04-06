const express = require('express');
const router = express.Router()
const Contacts = require('../../models/contacts');
const {validateContact, validateId} = require('./validation');

router.get('/', async (req, res, next) => {
  try {
    console.log(req.method);
    const contacts = await Contacts.listContacts();
    res.json({ status: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
  
});

router.get('/:Id', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.id);
    if (contact) {
        return res
            // .status(200)
            .json({status: 200, data: {contact}});
    }
    return res
        // .status(404)
        .json({status: 404, message: 'Not Found'});
  } catch (error) {
    next(error);
  }
  });


    
    
    

router.post('/', validateContact, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const contact = req.params;
  
  if (name || email || phone)
    return res
      // .status(400)
      .json({ status: 400, message: "missing required name - field" });
    const addContact = await Contacts.addContact(req.body);
    if (!addContact) {
      return res
          // .status(200)
          .json({status: 201, data: {contact}});
  }
  // return res
  //     .status(404)
  //     .json({ status: 404, message: 'Not Found'});
} catch (error) {

    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.id);
    if (contact) {
        return res
            // .status(200)
            .json({status: 200, message: 'contact deleted', data: {contact}});
    }
    return res
        // .status(404)
        .json({ status: 404, message: 'Not Found'});
} catch (error) {
    next(error);
}
})

router.put("/:id", validateId, async (req, res, next) => {
  const {name, email, phone} = req.body;
  const contactId = req.params.id;
  if (!name || !email || !phone)
    return res
      // .status(400)
      .json({ status: 400, message: "missing fields" });
  const updatedContact = await Contacts.updateContact(contactId, {name, email, phone});
  if (!updatedContact) return res
    // .status(404)
    .json({ message: "Not found", status: 404 });
  res.json({
      status: "success",
      code: 200,
      data: {
          updatedContact,
      },
  });
});

module.exports = router
