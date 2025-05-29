'use client'

import { motion } from 'framer-motion';
import {
  FaRobot,
  FaUsers,
  FaLightbulb,
  FaCode,
  FaHome,
  FaInfoCircle,
  FaProjectDiagram,
  FaEnvelope,
} from 'react-icons/fa';
import { useState } from 'react';
import { useTheme } from '../context/theme';
import { appVersion } from '../lib/app-version';

export default function AboutPage() {
  const { theme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`flex h-full ${
        theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      {/* Hamburger menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 w-full">
        <button
          title="Menu"
          onClick={toggleSidebar}
          className="p-4 text-primary hover:text-primary/80 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-card shadow-lg transform z-40 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-5">
          <nav className="space-y-1">
            <NavItem icon={<FaHome />} text="Home" href="/" />
            <NavItem icon={<FaInfoCircle />} text="About" href="#about" active />
            <NavItem icon={<FaProjectDiagram />} text="Other Projects" href="#projects" />
            <NavItem icon={<FaEnvelope />} text="Contact us" href="#contact" />
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-5">
          <div className="bg-primary/10 rounded-lg p-4 text-sm">
            <p className="text-primary font-medium">CodaWeb AI v{appVersion}</p>
          </div>
        </div>
      </motion.aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto lg:pl-0 pl-0 pt-14 lg:pt-0">
        <main className="flex-grow container mx-auto px-6 py-12 max-w-5xl">
          <motion.div
            id="about"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-extrabold mb-4 text-primary text-center">
              About CodaWeb
            </h1>
            <p className="text-xl text-center text-muted-foreground max-w-2xl mx-auto">
              Discover our innovative platform {"that's"} redefining the interaction between humans and artificial intelligence.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            <InfoCard
              icon={<FaRobot size={24} />}
              title="Connecting with AI"
              description="CodaWeb is an innovative platform that connects you to advanced AI models, enabling dynamic, intuitive, and productive interactions."
              delay={0.3}
            />
            <InfoCard
              icon={<FaUsers size={24} />}
              title="Mission"
              description="Our mission is to democratize access to artificial intelligence, making it accessible and useful for everyone, regardless of background or technical experience."
              delay={0.4}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-primary">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ValueCard
                icon={<FaLightbulb />}
                title="Innovation"
                description="We constantly seek new ways to improve and expand our capabilities."
              />
              <ValueCard
                icon={<FaCode />}
                title="Excellence"
                description="Committed to the highest quality in everything we do."
              />
              <ValueCard
                icon={<FaUsers />}
                title="Collaboration"
                description="We believe in the power of teamwork and diverse perspectives."
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-primary">Our Journey</h2>
            <div className="space-y-4">
              <TimelineItem
                year="2023"
                title="CodaWeb Foundation"
                description="We began our journey with the mission to make AI accessible to everyone."
              />
              <TimelineItem
                year="2024"
                title="Platform Expansion"
                description="We implemented new models and features to enhance user experience."
              />
              <TimelineItem
                year="2025"
                title="Global Reach"
                description="We reached users in over 50 countries worldwide."
              />
            </div>
          </motion.section>

          <motion.section id="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Other Projects</h2>
            <div className="grid gap-4">
              <InfoCard
                icon={<FaProjectDiagram size={24} />}
                title="CodaWeb Assistant"
                description="An AI assistant trained to answer questions about your business."
              />
              <InfoCard
                icon={<FaCode size={24} />}
                title="API Platform"
                description="A suite of open APIs to integrate artificial intelligence into your systems."
              />
            </div>
          </motion.section>

          <motion.section id="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold mb-6 text-primary">Get in Touch</h2>
            <div className="bg-card p-6 rounded-xl border border-border shadow">
              <p className="text-muted-foreground mb-4">
                Want to talk to the team? Send an email to{' '}
                <a
                  href="mailto:contact-us@codaweb.com.br"
                  className="text-primary hover:underline"
                >
                  contact-us@codaweb.com.br
                </a>
              </p>
              <p className="text-muted-foreground">
                Or follow us on social media to stay updated!
              </p>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}

// NavItem component with optional `active`
type NavItemProps = {
  icon: React.ReactNode;
  text: string;
  href: string;
  active?: boolean;
};

function NavItem({ icon, text, href, active = false }: NavItemProps) {
  return (
    <a
      href={href}
      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-foreground hover:bg-primary/5 hover:text-primary'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </a>
  );
}

function InfoCard({ icon, title, description, delay = 0 }: { icon: React.ReactNode; title: string; description: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-card rounded-xl p-6 shadow border border-border text-center"
    >
      <div className="rounded-full bg-primary/10 p-4 inline-flex text-primary mb-4">
        <span className="text-xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
}

function TimelineItem({ year, title, description }: { year: string; title: string; description: string }) {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-12 h-12 text-sm font-bold">{year}</div>
        <div className="flex-grow w-0.5 h-full bg-border mt-2"></div>
      </div>
      <div className="bg-card rounded-lg p-4 shadow-sm border border-border flex-1 -mt-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}
