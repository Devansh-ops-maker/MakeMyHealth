import Doctor from '../models/doctor.js';

export async function getProfileByName(req, res) {
  try {

    const name = req.user.name;

    if (!name) {
      res.status(400).json({ error: 'Doctor name is required.' });
      return;
    }

    const doctor = await Doctor.findOne({ name });

    if (!doctor) {
      res.status(404).json({ error: 'Doctor not found.' });
      return;
    }

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export default {
  getProfileByName
};
