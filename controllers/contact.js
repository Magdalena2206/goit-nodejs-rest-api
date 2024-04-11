const contacts = require('../repository/contacts');

const getContacts = async (req, res, next) => {
  try {
    console.log(req.method);
    const contact = await contacts.listContacts();
    res.json({ status: 'success', code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await contacts.getContactById(req.params.id);
    console.log(contact);
    console.log(contact.id);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (error) {
    next(error);
  }
};

const saveContact = async (req, res, next) => {
  try {
    const contact = await contacts.addContact(req.body);
    res.status(201).json({ status: 'success', code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const contact = await contacts.removeContact(req.params.id);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    console.log(req.method);
    const contact = await contacts.updateContact(req.params.id, req.body);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (error) {
    next(error);
  }
};

const updateStatusFavoriteContact = async (req, res, next) => {
  try {
    const contact = await contacts.updateContact(req.params.id, req.body);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContact,
  getContacts,
  removeContact,
  saveContact,
  updateContact,
  updateStatusFavoriteContact,
};