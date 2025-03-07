
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Form.css';
import {
  ChakraProvider,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input
} from '@chakra-ui/react';

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phno, setPhno] = useState('');
  const [image, setImage] = useState(null);
  const [idcard, setIdCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);

  const nameValid = useRef(null);
  const emailValid = useRef(null);
  const phnoValid = useRef(null);
  const imageValid = useRef(null);

  // Add class to body when ID card is active
  useEffect(() => {
    if (showIdCard) {
      document.body.classList.add('id-card-active');
    } else {
      document.body.classList.remove('id-card-active');
    }
  }, [showIdCard]);

  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    if (/^[A-Za-z ]*$/.test(nameValue)) {
      setName(nameValue);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  };

  const handlePhnoChange = (e) => {
    const phnoValue = e.target.value;
    setPhno(phnoValue);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const goBackToForm = () => {
    setShowIdCard(false);
  };

  const submitData = async (e) => {
    e.preventDefault();

    if (!name) {
      alert('Enter your name');
      nameValid.current.focus();
    } else if (name.length < 3 || name.length > 20) {
      alert('Enter a valid name');
      nameValid.current.focus();
    } else if (!email) {
      alert('Enter your email');
      emailValid.current.focus();
    } else if (!email.endsWith('@gmail.com')) {
      alert('Enter a valid email');
      emailValid.current.focus();
    } else if (!phno) {
      alert('Enter your phone number');
      phnoValid.current.focus();
    } else if (phno.length !== 10) {
      alert('Enter a valid phone number');
      phnoValid.current.focus();
    } else if (!image) {
      alert('Upload a photo');
      imageValid.current.focus();
    } else {
      setLoading(true);
      
      // Convert image to base64 for sending to API
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        
        // Create payload with base64 image
        const payload = {
          name,
          email,
          phno,
          imageData: base64Image
        };

        try {
          // Use relative URL for API calls to work both locally and in production
          const apiUrl = process.env.NODE_ENV === 'production' 
            ? '/api/generate-id-card' 
            : 'http://localhost:8000/generate-id-card';
            
          const response = await axios.post(apiUrl, payload, {
            headers: { 'Content-Type': 'application/json' },
          });
          
          setIdCard(response.data);
          setShowIdCard(true); // Show ID card after successful generation
        } catch (err) {
          console.log('Error while calling API:', err);
          alert('Failed to generate ID card. Please try again.');
        } finally {
          setLoading(false);
        }
      };
    }
  };

  const isError = name === '';
  const emailError = email === '';
  const phnoError = phno === '';
  const imageError = image === null;

  return (
    <ChakraProvider>
      <div className="container">
        <h1><b>Generate Student ID Card</b></h1>
        <form onSubmit={submitData}>
          <FormControl isInvalid={isError}>
            <FormLabel>Name <sup style={{ color: 'red' }}>*</sup></FormLabel>
            <Input
              type="text"
              name="name"
              value={name}
              ref={nameValid}
              onChange={handleNameChange}
            />
            {!isError ? <FormHelperText></FormHelperText> : <FormErrorMessage>Name is required.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={emailError}>
            <FormLabel>Email <sup style={{ color: 'red' }}>*</sup></FormLabel>
            <Input
              type="email"
              name="email"
              value={email}
              ref={emailValid}
              onChange={handleEmailChange}
              required
            />
            {!emailError ? <FormHelperText></FormHelperText> : <FormErrorMessage>Email is required.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={phnoError}>
            <FormLabel>Mobile No <sup style={{ color: 'red' }}>*</sup></FormLabel>
            <Input
              type="number"
              name="phno"
              value={phno}
              ref={phnoValid}
              onChange={handlePhnoChange}
            />
            {!phnoError ? <FormHelperText></FormHelperText> : <FormErrorMessage>Mobile number is required.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={imageError}>
            <FormLabel>Upload Your Photo <sup style={{ color: 'red' }}>*</sup></FormLabel>
            <Input
              type="file"
              name="image"
              ref={imageValid}
              onChange={handleImageChange}
            />
            {!imageError ? (
              <FormHelperText>
                <span style={{ color: 'green' }}>Photo uploaded</span>
              </FormHelperText>
            ) : (
              <FormErrorMessage>Photo is required.</FormErrorMessage>
            )}
          </FormControl>

          <Button type="submit" colorScheme="blue" isLoading={loading}>
            Generate ID Card
          </Button>
        </form>
      </div>

      {idcard && (
        <div className="id-card-container">
          <div className="id-card">
            <button className="back-button" onClick={goBackToForm}>
              ←
            </button>
            <h2 className="id-title">Heritage Institute Of Technology</h2>
            <h2 className="id-subtitle">Student ID Card</h2>
            <div className="id-content">
              <div className="image">
                {idcard.imageData && (
                  <img
                    src={idcard.imageData}
                    alt="Student Photo"
                  />
                )}
              </div>
              <div className="info-section">
                <p><b>Name:</b> {idcard.name}</p>
                <p><b>Email:</b> {idcard.email}</p>
                <p><b>Mobile:</b> {idcard.phno}</p>
              </div>
              <div className="qr-sec">
                {idcard.qrCode && <img src={idcard.qrCode} alt="QR Code" />}
              </div>
            </div>
          </div>
        </div>
      )}
    </ChakraProvider>
  );
};

export default Form;