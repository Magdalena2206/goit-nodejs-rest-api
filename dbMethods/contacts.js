const contact = require('../models/contacts');

const listContacts = async () => {
  const results = await contact.find();
  return results;
};

const getContactById = async contactId => {
  const results = await contact.findById(contactId);
  return results;
};

const removeContact = async contactId => {
  const result = await contact.findByIdAndRemove({ _id: contactId });
  return result;
};

const addContact = async body => {
  const result = await contact.create(body);
  return result;
};

const updateContact = async (contactId, body) => {
  const result = await contact.findByIdAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true },
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};