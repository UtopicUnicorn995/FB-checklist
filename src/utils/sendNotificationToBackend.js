export const sendNotificationToBackend = async (deviceToken, title, body, data) => {
    try {
      const response = await fetch('http://localhost:3000/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceToken,
          title,
          body,
          data,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Notification sent successfully:', result);
    } catch (error) {
      console.error('Error sending notification to backend:', error.message);
    }
  };