const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.assignOrderOnCreate = functions.database
  .ref('/notes/{noteId}')
  .onCreate(async (snapshot, context) => {
    const newNote = snapshot.val();
    const notesRef = admin.database().ref('/notes');

    try {
      // Fetch all existing notes
      const notesSnapshot = await notesRef.once('value');
      const existingOrders = [];
      notesSnapshot.forEach(childSnapshot => {
        const note = childSnapshot.val();
        if (note.order) {
          existingOrders.push(note.order);
        }
      });

      // Find the next available order
      const maxOrder = Math.max(0, ...existingOrders);
      const missingOrder = Array.from({length: maxOrder}, (_, i) => i + 1).find(
        order => !existingOrders.includes(order)
      );
      const nextOrder = missingOrder || maxOrder + 1;

      // Update the new note with the calculated order
      await snapshot.ref.update({order: nextOrder});
      console.log(`Assigned order ${nextOrder} to note ${context.params.noteId}`);
    } catch (error) {
      console.error('Error assigning order:', error.message);
    }
  });