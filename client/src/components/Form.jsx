

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
  Input,
  useToast
} from '@chakra-ui/react';

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phno, setPhno] = useState('');
  const [image, setImage] = useState(null);
  const [idcard, setIdCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);
  const toast = useToast();

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
      toast({
        title: "Error",
        description: "Enter your name",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      nameValid.current.focus();
    } else if (name.length < 3 || name.length > 20) {
      toast({
        title: "Error",
        description: "Enter a valid name (3-20 characters)",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      nameValid.current.focus();
    } else if (!email) {
      toast({
        title: "Error",
        description: "Enter your email",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      emailValid.current.focus();
    } else if (!email.endsWith('@gmail.com')) {
      toast({
        title: "Error",
        description: "Enter a valid email",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      emailValid.current.focus();
    } else if (!phno) {
      toast({
        title: "Error",
        description: "Enter your phone number",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      phnoValid.current.focus();
    } else if (phno.length !== 10) {
      toast({
        title: "Error",
        description: "Enter a valid 10-digit phone number",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      phnoValid.current.focus();
    } else if (!image) {
      toast({
        title: "Error",
        description: "Upload a photo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
          // Fixed API URL handling for Vercel deployment
          // This will work correctly with serverless functions in /api directory
          let apiUrl = '/api/generate-id-card';
          
          // Only use localhost in development
          if (process.env.NODE_ENV === 'development') {
            apiUrl = 'http://localhost:8000/generate-id-card';
          }
            
          const response = await axios.post(apiUrl, payload, {
            headers: { 'Content-Type': 'application/json' },
          });
          
          setIdCard(response.data);
          setShowIdCard(true); // Show ID card after successful generation
          toast({
            title: "Success",
            description: "ID Card generated successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (err) {
          console.error('Error while calling API:', err);
          toast({
            title: "Error",
            description: "Failed to generate ID card. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
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
          <FormControl isInvalid={isError} mb={4}>
            <FormLabel>Name <sup style={{ color: 'red' }}>*</sup></FormLabel>
            <Input
              type="text"
              name="name"
              value={name}
              ref={nameValid}
              onChange={handleNameChange}
              placeholder="Enter your full name"
            />
            {!isError ? <FormHelperText></FormHelperText> : <FormErrorMessage>Name is required.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={emailError} mb={4}>
            <FormLabel>Email <sup style={{ color: 'red' }}>*</sup></FormLabel>
            <Input
              type="email"
              name="email"
              value={email}
              ref={emailValid}
              onChange={handleEmailChange}
              placeholder="example@gmail.com"
              required
            />
            {!emailError ? <FormHelperText></FormHelperText> : <FormErrorMessage>Email is required.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={phnoError} mb={4}>
            <FormLabel>Mobile No <sup style={{ color: 'red' }}>*</sup></FormLabel>
            <Input
              type="number"
              name="phno"
              value={phno}
              ref={phnoValid}
              onChange={handlePhnoChange}
              placeholder="10-digit mobile number"
            />
            {!phnoError ? <FormHelperText></FormHelperText> : <FormErrorMessage>Mobile number is required.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={imageError} mb={4}>
            <FormLabel>Upload Your Photo <sup style={{ color: 'red' }}>*</sup></FormLabel>
            <Input
              type="file"
              name="image"
              ref={imageValid}
              onChange={handleImageChange}
              accept="image/*"
            />
            {image ? (
              <FormHelperText>
                <span style={{ color: 'green' }}>Photo uploaded: {image.name}</span>
              </FormHelperText>
            ) : (
              <FormErrorMessage>Photo is required.</FormErrorMessage>
            )}
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="blue" 
            isLoading={loading} 
            loadingText="Generating..."
            width="100%"
            mt={2}
          >
            Generate ID Card
          </Button>
        </form>
      </div>

      {idcard && (
        <div className={`id-card-container ${showIdCard ? 'visible' : ''}`}>
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