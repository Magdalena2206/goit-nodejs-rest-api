const contacts = require('../dbMethods/contacts');
const { CustomError } = require('../helpers/customErr');

const getContacts = async (req, res) => {
  const userId = req.user._id;
  const data = await contacts.listContacts(userId, req.query);
  res.json({ status: 'success', code: 200, data: { ...data } });
};

const getContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await contacts.getContactById(req.params.id, userId);

  if (contact) {
    return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
  }

  throw new CustomError(404, 'Not Found');
};

const saveContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await contacts.addContact({ ...req.body, owner: userId });
  res.status(201).json({ status: 'success', code: 202, data: { contact } });
};

const removeContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await contacts.removeContact(req.params.id, userId);
  if (contact) {
    return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
  }
  throw new CustomError(404, 'Not Found');
};

const updateContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await contacts.updateContact(req.params.id, req.body, userId);
  if (contact) {
    return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
  }
  throw new CustomError(404, 'Not Found');
};

const updateStatusFavoriteContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await contacts.updateContact(req.params.id, req.body, userId);
  if (contact) {
    return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
  }
  throw new CustomError(404, 'Not Found');
};

module.exports = {
  getContact,
  getContacts,
  removeContact,
  saveContact,
  updateContact,
  updateStatusFavoriteContact,
};