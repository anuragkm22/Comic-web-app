const apiUrl = 'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud';

const query = async (data) => {
  try {
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'image/png',
        'Authorization': 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const imageBlob = await response.blob();
    return URL.createObjectURL(imageBlob); // Convert blob to URL
  } catch (error) {
    throw new Error('Failed to fetch image');
  }
};

export { query };

