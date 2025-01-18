import Patient from '../models/patient.js'; // Adjust the path based on your project structure

export async function getProfileByName(req, res) {
  try {
    const name = req.user.name; // Assuming `req.user` contains the logged-in user's information

    if (!name) {
      res.status(400).json({ error: 'Patient name is required.' });
      return;
    }

    // Find the patient by name
    const patient = await Patient.findOne({ name });

    if (!patient) {
      res.status(404).json({ error: 'Patient not found.' });
      return;
    }

    res.status(200).json({ success: true, patient });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
export default {
  getProfileByName
};
