document.addEventListener('DOMContentLoaded', function() {
  const newPostForm = document.querySelector('.new-post-form');
  
  newPostForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    
    // Get the file input element
    const imageFile = document.getElementById('post-image').files[0];
    
    // Example validation (you should perform proper validation)
    if (!title || !content || !imageFile) {
      alert('Please enter title, content, and select an image for the post.');
      return;
    }
    
    // Upload image to Cloudinary
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'your_upload_preset'); // Replace 'your_upload_preset' with your Cloudinary upload preset
    
    fetch('https://api.cloudinary.com/v1_1/dz4oq10ph/image/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary.');
      }
      return response.json();
    })
    .then(data => {
      // Image successfully uploaded to Cloudinary
      const imageUrl = data.secure_url;
      
      // Example AJAX request to send new post data (including image URL) to the server
      return fetch('/api/posts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title, content: content, imageUrl: imageUrl })
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add post.');
      }
      return response.json();
    })
    .then(data => {
      // Handle successful post addition (e.g., show success message)
      alert('Post successfully added!');
      // Optionally, you can redirect to another page after successful addition
      window.location.href = '/dashboard';
    })
    .catch(error => {
      // Handle error
      console.error('Error adding post:', error);
      alert('Failed to add post');
    });
  });
});




const cloudName = "hzxyensd5"; // replace with your own cloud name
const uploadPreset = "aoh4fpwm"; // replace with your own upload preset

// Remove the comments from the code below to add
// additional functionality.
// Note that these are only a few examples, to see
// the full list of possible parameters that you
// can add see:
//   https://cloudinary.com/documentation/upload_widget_reference

const myWidget = cloudinary.createUploadWidget(
  {
    cloudName: cloudName,
    uploadPreset: uploadPreset,
    // cropping: true, //add a cropping step
    // showAdvancedOptions: true,  //add advanced options (public_id and tag)
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    // multiple: false,  //restrict upload to a single file
    // folder: "user_images", //upload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    // clientAllowedFormats: ["images"], //restrict uploading to image files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    // theme: "purple", //change to a purple theme
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Done! Here is the image info: ", result.info);
      document
        .getElementById("uploadedimage")
        .setAttribute("src", result.info.secure_url);
    }
  }
);

document.getElementById("upload_widget").addEventListener(
  "click",
  function () {
    myWidget.open();
  },
  false
);
