const express = require('express');
const router = express.Router();
const {
    getContact,
    getContacts,
    removeContact,
    saveContact,
    updateContact,
    updateStatusFavoriteContact,
  } = require('../../controllers/contact');
  const {
    validateContact,
    validateStatusContact,
    validateId,
  } = require('./validation');

  router.get('/', getContacts);

  router.get('/:id', validateId, getContact);
  
  router.post('/', validateContact, saveContact);
  
  router.delete('/:id', validateId, removeContact);
  
  router.put('/:id', [validateId, validateContact], updateContact);
  
  router.patch(
    '/:id/vaccinated/',
    [validateId, validateStatusContact],
    updateStatusFavoriteContact,
  );
  
  module.exports = router;