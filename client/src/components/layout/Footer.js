import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
  color: var(--white);
  padding: var(--space-3xl) 0 var(--space-xl);
  margin-top: var(--space-3xl);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-2xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
`;

const FooterSection = styled(motion.div)`
  h3 {
    color: var(--white);
    font-size: 20px;
    font-weight: 600;
    margin-bottom: var(--space-lg);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: var(--primary-gradient);
      border-radius: var(--radius-full);
    }
  }
`;

const FooterLogo = styled.div`
  font-family: var(--font-family-display);
  font-size: 32px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-md);
`;

const FooterDescription = styled.p`
  color: var(--gray-300);
  line-height: 1.6;
  margin-bottom: var(--space-lg);
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const FooterLink = styled(Link)`
  color: var(--gray-300);
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: var(--space-xs) 0;

  &:hover {
    color: var(--white);
    transform: translateX(5px);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--gray-300);

  svg {
    width: 18px;
    height: 18px;
    color: var(--primary-light);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);
`;

const SocialLink = styled(motion.a)`
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--primary-gradient);
    transform: translateY(-3px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Newsletter = styled.div`
  h3 {
    margin-bottom: var(--space-md);
  }

  p {
    color: var(--gray-300);
    margin-bottom: var(--space-lg);
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
  font-size: 14px;
  transition: all var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--primary-light);
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: var(--gray-400);
  }
`;

const NewsletterButton = styled(motion.button)`
  padding: var(--space-sm) var(--space-lg);
  background: var(--primary-gradient);
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: var(--space-2xl);
  text-align: center;
  color: var(--gray-400);
  font-size: 14px;
`;

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FooterLogo>LuxeCommerce</FooterLogo>
          <FooterDescription>
            Experience luxury shopping like never before. Discover premium products, 
            exceptional service, and unmatched quality at LuxeCommerce.
          </FooterDescription>
          <SocialLinks>
            <SocialLink
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFacebook />
            </SocialLink>
            <SocialLink
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiTwitter />
            </SocialLink>
            <SocialLink
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiInstagram />
            </SocialLink>
            <SocialLink
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLinkedin />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3>Quick Links</h3>
          <FooterLinks>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/products">Products</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/cart">Shopping Cart</FooterLink>
            <FooterLink to="/orders">My Orders</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3>Customer Service</h3>
          <FooterLinks>
            <FooterLink to="/help">Help Center</FooterLink>
            <FooterLink to="/shipping">Shipping Info</FooterLink>
            <FooterLink to="/returns">Returns</FooterLink>
            <FooterLink to="/size-guide">Size Guide</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3>Contact Info</h3>
          <ContactInfo>
            <ContactItem>
              <FiMapPin />
              <span>123 Luxury Street, Premium City, PC 12345</span>
            </ContactItem>
            <ContactItem>
              <FiPhone />
              <span>+1 (555) 123-4567</span>
            </ContactItem>
            <ContactItem>
              <FiMail />
              <span>hello@luxecommerce.com</span>
            </ContactItem>
          </ContactInfo>
        </FooterSection>

        <FooterSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Newsletter>
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for exclusive offers and updates.</p>
            <NewsletterForm onSubmit={handleNewsletterSubmit}>
              <NewsletterInput
                type="email"
                placeholder="Enter your email"
                required
              />
              <NewsletterButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </NewsletterButton>
            </NewsletterForm>
          </Newsletter>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; 2024 LuxeCommerce. All rights reserved. Made with ❤️ for premium shopping experience.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
