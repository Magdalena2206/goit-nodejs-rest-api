const express = require("express");
const router = express.Router();
const {
  getContact,
  getContacts,
  removeContact,
  saveContact,
  updateContact,
  updateStatusFavoriteContact,
} = require("../../controllers/contact");
const { validateContact, validateStatusContact, validateId } = require("./validation");
const guard = require("../../helpers/guard");
const wrapError = require("../../helpers/errHandler");

router.get("/", guard, wrapError(getContacts));

router.get("/:id", guard, validateId, wrapError(getContact));

router.post("/", guard, validateContact, wrapError(saveContact));

router.delete("/:id", guard, validateId, wrapError(removeContact));

router.put("/:id", guard, [(validateId, validateContact)], wrapError(updateContact));

router.patch(
  "/:id/vaccinated/",
  guard,
  [(validateId, validateStatusContact)],
  wrapError(updateStatusFavoriteContact)
);

module.exports = router;
