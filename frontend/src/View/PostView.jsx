// File: /views/CreatePostView.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faTimes, faUpload} from '@fortawesome/free-solid-svg-icons';
import './PostView.css'

const CreatePostView = () => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    const handleImageChange = (event) => {
        // Assuming you want to keep previous images and add new ones
        setImages([...images, ...event.target.files]);
    };

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleContentChange = (event) => setContent(event.target.value);

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput) {
            if (!tags.includes(tagInput)) { // Prevent adding duplicate tags
                setTags([...tags, tagInput]);
                setTagInput('');
            } else {
                setTagInput(''); // Clear input if tag is duplicate
            }
        } else if (e.key === 'Backspace' && !tagInput) {
            setTags(tags.slice(0, tags.length - 1));
        }
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, idx) => idx !== index));
    };

    const renderTags = () => {
        return tags.map((tag, index) => (
            <span key={index} className="tag">
                {tag}
                <button type="button" className="remove-tag-button" onClick={() => removeTag(index)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </span>
        ));
    };

    const renderImagePreviews = () => {
        return images.map((image, index) => {
            // Create an object URL for each image file
            const imageUrl = URL.createObjectURL(image);

            // Revoke the object URL to avoid memory leaks when the component unmounts or the image changes
            // Note: This clean-up might be better placed in a useEffect hook with a return function for clean-up
            window.addEventListener('unload', () => URL.revokeObjectURL(imageUrl));

            return (
                <div key={index} className="image-preview">
                    <img src={imageUrl} alt={`Preview ${index}`} />
                    <button className="remove-image-button" onClick={() => handleRemoveImage(index)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            );
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Function to convert image to Base64
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        // Convert images to Base64 and add to images array
        const base64Images = await Promise.all(images.map(async image => {
            return await toBase64(image);
        }));

        // Construct JSON object with form data
        const jsonData = {
            "userID": "656ffec0931a250a4c348812",
            "name":"title",
            "label":"test",
            "description":"it is an test"
            //images: base64Images
        };

        console.log(jsonData.title);

        try {
            const response = await fetch('http://localhost:5003/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData) // Convert the object to a JSON string
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success:', result);
            // Handle success here
        } catch (error) {
            console.error('Submission error:', error);
            // Handle errors here
        }
    };


    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit}>

            <h1>Upload image:</h1>
            <div className="image-upload-section">
                {renderImagePreviews()}
                <label htmlFor="image-upload" className="image-upload-label">

                    <div className="icon-wrapper">
                        <FontAwesomeIcon icon={faPlus} /> {/* Font Awesome Icon */}
                    </div>
                    <input
                        id="image-upload"
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="image-upload-input"
                    />
                </label>
            </div>
            <h1>Item title:</h1>
            <div className="title-section">
                <input
                    type="text"
                    placeholder="Add a title here"
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>
            <h1> Item descriptions:</h1>
            <div className="content-section">
                <textarea
                    placeholder="Add your content here..."
                    value={content}
                    onChange={handleContentChange}
                />
            </div>

            <h1>Item Identification:</h1>
            <div className="item-identification-section">
                <div className="tag-input-container">
                    <input
                        type="text"
                        id="item-identification"
                        name="item_identification"
                        placeholder="Enter item tag"
                        className="item-tag-input"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagInputKeyDown}
                    />
                    {renderTags()}
                </div>
            </div>


            <h1>Meet up location:</h1>
            <div className="location-checkbox-section">
                <div className="checkbox-group">
                    <input type="checkbox" id="location1" name="location" value="CS Building" />
                    <label htmlFor="location1">CS Building</label>

                    <input type="checkbox" id="location2" name="location" value="Illini Union" />
                    <label htmlFor="location2">Illini Union</label>

                    {/* Add more locations as needed */}
                </div>
            </div>


            <div className="submit-section">
                <button type="submit" id="submit-button">Submit</button>
            </div>
            </form>
        </div>

    );
};

export default CreatePostView;
