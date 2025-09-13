import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';

const ContactContainer = styled.div`
  margin-top: 70px;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #333333);
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const ContentSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div``;

const ContactForm = styled.div``;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const InfoCard = styled(motion.div)`
  background: var(--card-bg, #ffffff);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px var(--shadow-color, rgba(0, 0, 0, 0.15));
  }
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary, #333333);
  }

  p {
    color: var(--text-secondary, #666666);
    line-height: 1.6;
    margin: 0;
  }

  a {
    color: #667eea;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #764ba2;
    }
  }
`;

const Form = styled.form`
  background: var(--card-bg, #ffffff);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary, #333333);
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid var(--border-color, #e1e5e9);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #333333);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid var(--border-color, #e1e5e9);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #333333);
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  color: #38a169;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(56, 161, 105, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(56, 161, 105, 0.2);
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(229, 62, 62, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(229, 62, 62, 0.2);
  margin-bottom: 1rem;
`;

const MapSection = styled.section`
  background: var(--bg-secondary, #f8f9fa);
  padding: 4rem 2rem;
  text-align: center;
`;

const MapContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #666666);
  font-size: 1.1rem;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactContainer>
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>Get in Touch</Title>
          <Subtitle>
            Have questions or need assistance? We're here to help! 
            Reach out to our friendly team and we'll respond promptly.
          </Subtitle>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <ContactGrid>
          <ContactInfo>
            <SectionTitle>Contact Information</SectionTitle>
            
            <InfoCard
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <IconWrapper>
                <FiMail />
              </IconWrapper>
              <InfoContent>
                <h3>Email Us</h3>
                <p>
                  <a href="mailto:support@luxecommerce.com">support@luxecommerce.com</a><br />
                  <a href="mailto:sales@luxecommerce.com">sales@luxecommerce.com</a>
                </p>
              </InfoContent>
            </InfoCard>

            <InfoCard
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <IconWrapper>
                <FiPhone />
              </IconWrapper>
              <InfoContent>
                <h3>Call Us</h3>
                <p>
                  <a href="tel:+1234567890">+1 (234) 567-8900</a><br />
                  <a href="tel:+1234567891">+1 (234) 567-8901</a> (Sales)
                </p>
              </InfoContent>
            </InfoCard>

            <InfoCard
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <IconWrapper>
                <FiMapPin />
              </IconWrapper>
              <InfoContent>
                <h3>Visit Us</h3>
                <p>
                  123 Luxury Avenue<br />
                  Premium District<br />
                  New York, NY 10001
                </p>
              </InfoContent>
            </InfoCard>

            <InfoCard
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <IconWrapper>
                <FiClock />
              </IconWrapper>
              <InfoContent>
                <h3>Business Hours</h3>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </InfoContent>
            </InfoCard>
          </ContactInfo>

          <ContactForm>
            <SectionTitle>Send us a Message</SectionTitle>
            
            <Form onSubmit={handleSubmit}>
              {success && <SuccessMessage>{success}</SuccessMessage>}
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <InputGroup>
                  <InputIcon>
                    <FiUser />
                  </InputIcon>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <InputGroup>
                  <InputIcon>
                    <FiMail />
                  </InputIcon>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="subject">Subject</Label>
                <InputGroup>
                  <InputIcon>
                    <FiMessageSquare />
                  </InputIcon>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="message">Message</Label>
                <InputGroup>
                  <InputIcon style={{ top: '1.5rem', transform: 'none' }}>
                    <FiMessageSquare />
                  </InputIcon>
                  <TextArea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <SubmitButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Sending...' : (
                  <>
                    Send Message <FiSend />
                  </>
                )}
              </SubmitButton>
            </Form>
          </ContactForm>
        </ContactGrid>
      </ContentSection>

      <MapSection>
        <SectionTitle>Find Our Store</SectionTitle>
        <MapContainer>
          <div>
            <FiMapPin size={48} style={{ marginBottom: '1rem', color: '#667eea' }} />
            <p>Interactive map will be integrated here</p>
            <p>123 Luxury Avenue, Premium District, New York, NY 10001</p>
          </div>
        </MapContainer>
      </MapSection>
    </ContactContainer>
  );
};

export default Contact;
