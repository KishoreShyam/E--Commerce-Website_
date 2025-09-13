import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiGlobe, FiHeart, FiShield, FiTruck } from 'react-icons/fi';

const AboutContainer = styled.div`
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

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
`;

const StoryCard = styled(motion.div)`
  background: var(--card-bg, #ffffff);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px var(--shadow-color, rgba(0, 0, 0, 0.15));
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary, #333333);
`;

const CardDescription = styled.p`
  color: var(--text-secondary, #666666);
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background: var(--bg-secondary, #f8f9fa);
  padding: 4rem 2rem;
  margin: 4rem 0;
`;

const StatsGrid = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatItem = styled(motion.div)`
  .number {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  .label {
    font-size: 1.1rem;
    color: var(--text-secondary, #666666);
    font-weight: 500;
  }
`;

const TeamSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const TeamDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary, #666666);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 3rem;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ValueCard = styled(motion.div)`
  background: var(--card-bg, #ffffff);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
  text-align: left;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px var(--shadow-color, rgba(0, 0, 0, 0.15));
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-primary, #333333);
  }

  p {
    color: var(--text-secondary, #666666);
    line-height: 1.6;
  }
`;

const About = () => {
  return (
    <AboutContainer>
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>About LuxeCommerce</Title>
          <Subtitle>
            We're redefining luxury e-commerce with premium products, exceptional service, 
            and an unmatched shopping experience that puts our customers first.
          </Subtitle>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <SectionTitle>Our Story</SectionTitle>
        <StoryGrid>
          <StoryCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <IconWrapper>
              <FiHeart />
            </IconWrapper>
            <CardTitle>Founded with Passion</CardTitle>
            <CardDescription>
              LuxeCommerce was born from a passion for bringing the world's finest products 
              to discerning customers who appreciate quality, craftsmanship, and exceptional service.
            </CardDescription>
          </StoryCard>

          <StoryCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <IconWrapper>
              <FiAward />
            </IconWrapper>
            <CardTitle>Premium Quality</CardTitle>
            <CardDescription>
              Every product in our collection is carefully curated and tested to meet our 
              rigorous standards for quality, durability, and design excellence.
            </CardDescription>
          </StoryCard>

          <StoryCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <IconWrapper>
              <FiGlobe />
            </IconWrapper>
            <CardTitle>Global Reach</CardTitle>
            <CardDescription>
              From our headquarters to customers worldwide, we've built a global network 
              that delivers luxury products with the care and attention they deserve.
            </CardDescription>
          </StoryCard>
        </StoryGrid>
      </ContentSection>

      <StatsSection>
        <SectionTitle>Our Impact</SectionTitle>
        <StatsGrid>
          <StatItem
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="number">50K+</div>
            <div className="label">Happy Customers</div>
          </StatItem>

          <StatItem
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="number">10K+</div>
            <div className="label">Premium Products</div>
          </StatItem>

          <StatItem
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="number">99%</div>
            <div className="label">Satisfaction Rate</div>
          </StatItem>

          <StatItem
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="number">24/7</div>
            <div className="label">Customer Support</div>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <TeamSection>
        <SectionTitle>Our Values</SectionTitle>
        <TeamDescription>
          At LuxeCommerce, our values guide everything we do. From product selection to customer service, 
          these principles ensure we deliver an exceptional experience that exceeds expectations.
        </TeamDescription>

        <ValuesGrid>
          <ValueCard
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4>Quality First</h4>
            <p>
              We never compromise on quality. Every product is meticulously selected and tested 
              to ensure it meets our exacting standards for excellence.
            </p>
          </ValueCard>

          <ValueCard
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4>Customer Obsession</h4>
            <p>
              Our customers are at the heart of everything we do. We're committed to providing 
              exceptional service and creating memorable shopping experiences.
            </p>
          </ValueCard>

          <ValueCard
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4>Innovation</h4>
            <p>
              We continuously innovate to improve our platform, enhance user experience, 
              and stay ahead of evolving customer needs and expectations.
            </p>
          </ValueCard>

          <ValueCard
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4>Sustainability</h4>
            <p>
              We're committed to sustainable practices, working with eco-conscious brands 
              and implementing environmentally responsible business operations.
            </p>
          </ValueCard>

          <ValueCard
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4>Trust & Security</h4>
            <p>
              Your trust is paramount. We maintain the highest security standards to protect 
              your data and ensure safe, secure transactions every time.
            </p>
          </ValueCard>

          <ValueCard
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h4>Global Community</h4>
            <p>
              We're building a global community of luxury enthusiasts who share our passion 
              for quality, style, and exceptional experiences.
            </p>
          </ValueCard>
        </ValuesGrid>
      </TeamSection>
    </AboutContainer>
  );
};

export default About;
