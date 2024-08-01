import React, { useState } from 'react';
import './Ref.css'; 
import Navbar from '../Nav/Navbar';
import Home from '../Hm/Home';

const WeeklyReference = () => {
  const topicsAndMaterials = [
    {
      topic: 'Library Management System',
      materials: [
        'https://www.researchgate.net/publication/378435639_Library_management_database_design_and_application',
        'https://www.linkedin.com/pulse/introduction-library-management-system-codeachi-technologies-ajoec/',
        'https://www.studentprojects.live/studentprojectreport/projectreport/library-management-system-case-study/',
        'https://youtu.be/G52wohlgdxY?si=Wv0nv-F-Q7-Z1wNa',
      ],
    },
    {
      topic: 'Inventory Management System',
      materials: [
        'https://www.optiproerp.com/what-is-inventory-management/',
        'https://www.linkedin.com/learning/inventory-management-foundations/what-is-inventory-management?u=78898396',
        'https://www.researchgate.net/publication/327793184_A_Study_of_Inventory_Management_System_Case_Study',
        'https://youtu.be/wlxx3SCHZKk?si=IjZ7oy_gTMBnp3Nh/',
      ],
    },
    {
      topic: 'Face Detection System',
      materials: [
        'https://en.wikipedia.org/wiki/Face_detection',
        'https://www.linkedin.com/advice/0/what-most-common-effective-machine-vision-face-recognition',
        'https://dl.acm.org/doi/pdf/10.1145/3533378',
        'https://youtu.be/1T1gUsbyMhI?si=hKP-rq-55bpHM2Tz',
      ],
    },
    {
      topic: 'Fingerprint Detection System',
      materials: [
        'https://www.innovatrics.com/fingerprint-technology/#:~:text=Fingerprint%20recognition%20is%20the%20process,series%20of%20ridges%20and%20grooves.',
        'https://www.linkedin.com/learning/biometrics-security-and-privacy-considerations/biometrics-security-and-privacy-considerations?u=78898396',
        'https://www.researchgate.net/publication/356852767_Training_Deep_Network_Models_for_Fingerprint_Image_Classification',
        'https://www.routledge.com/AI-and-Deep-Learning-in-Biometric-Security-Trends-Potential-and-Challenges/Jaswal-Kanhangad-Ramachandra/p/book/9780367422448',
      ],
    },
    {
      topic: 'E-commerce Platform',
      materials: [
        'https://www.investopedia.com/terms/e/ecommerce.asp#:~:text=E%2Dcommerce%20involves%20the%20purchase,place%20with%20an%20online%20business.',
        'https://www.coursera.org/projects/create-your-ecommerce-store-with-shopify',
        'https://www.researchgate.net/publication/2359510_Database_Design_for_Real-World_E-Commerce_Systems',
        'https://youtu.be/jbfuzcrfjqQ?si=YgUksDrjx2GdMyjg',
      ],
    },
  ];

  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);

  const handleTopicChange = (index) => {
    setSelectedTopicIndex(index);
    setCurrentWeek(0); 
  };

  const nextWeek = () => {
    setCurrentWeek((currentWeek + 1) % 4); 
  };

  return (
    <>
    <Navbar/>
    <Home/>
    <div className="weekly-reference">
      <h2>Weekly Reference</h2>

      <select value={selectedTopicIndex} onChange={(e) => handleTopicChange(e.target.value)}>
        {topicsAndMaterials.map((topic, index) => (
          <option key={index} value={index}>
            {topic.topic}
          </option>
        ))}
      </select>

      <p>Week {currentWeek + 1} Reference Material:</p>
      <p>
        <a href={topicsAndMaterials[selectedTopicIndex].materials[currentWeek]} target="_blank" rel="noopener noreferrer">
          {topicsAndMaterials[selectedTopicIndex].materials[currentWeek]}
        </a>
      </p>

      <button onClick={nextWeek}>Next Week</button>
    </div>
    </>
  );
};

export default WeeklyReference;