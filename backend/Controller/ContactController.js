const { ContactForm } = require("../Model/contactModel");

async function createContactForm(contactData) {
  try {
    const contactForm = new ContactForm(contactData);
    await contactForm.save();
    return contactForm;
  } catch (error) {
    console.error("Error creating contact form:", error);
    throw error;
  }
}


const getAllQueries = async (req, res) => {
  try {
    const userQueries = await ContactForm.find().sort({ createdAt: -1 });

    res.render("dashboard/admin/queries", { user: req.user, userQueries });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).send("Server Error: Unable to fetch queries");
  }
};

const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuery = await ContactForm.findByIdAndDelete(id);

    if (!deletedQuery) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Query deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting query:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to delete query",
    });
  }
};

module.exports = {
  createContactForm,
  getAllQueries,
  deleteQuery,

};
