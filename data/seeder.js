const { faker } = require('@faker-js/faker');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const User = require('../backend/models/User');
const Job = require('../backend/models/Job');

const SKILLS = [
  'React', 'Node.js', 'Python', 'Java', 'C++', 'Go', 'Docker', 'Kubernetes', 'AWS',
  'MongoDB', 'PostgreSQL', 'SQL', 'TypeScript', 'Javascript', 'Figma', 'UI/UX',
  'Machine Learning', 'TensorFlow', 'Data Science', 'Angular', 'Vue', 'CSS', 'HTML'
];

exports.seedData = async () => {
  try {
    await User.deleteMany();
    await Job.deleteMany();

    console.log('Generating Users...');
    const users = [];
    
    // Create 1 recruiter
    users.push({
      name: 'John Recruiter',
      email: 'recruiter@test.com',
      password: 'hashing-in-model',
      role: 'recruiter',
      skills: [],
      experience: 5
    });
    
    // Create 1 generic user
    users.push({
      name: 'Jane User',
      email: 'user@test.com',
      password: 'hashing-in-model',
      role: 'user',
      skills: ['React', 'Node.js', 'MongoDB', 'Javascript'],
      experience: 3
    });

    for (let i = 0; i < 98; i++) {
        const userSkills = faker.helpers.arrayElements(SKILLS, faker.number.int({ min: 2, max: 6 }));
        users.push({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: 'hashing-in-model',
          role: 'user',
          skills: userSkills,
          experience: faker.number.int({ min: 0, max: 10 }),
          education: faker.helpers.arrayElement(["Bachelor's", "Master's", "PhD", "Bootcamp"])
        });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);
    for (let u of users) u.password = password;

    const createdUsers = await User.insertMany(users);
    
    console.log('Generating Jobs...');
    const jobs = [];
    const recruiterId = createdUsers[0]._id;

    for (let i = 0; i < 100; i++) {
        const requiredSkills = faker.helpers.arrayElements(SKILLS, faker.number.int({ min: 2, max: 5 }));
        jobs.push({
            title: faker.person.jobTitle(),
            company: faker.company.name(),
            description: faker.lorem.paragraphs(2),
            requiredSkills,
            experienceLevel: faker.number.int({ min: 0, max: 7 }),
            salaryRange: `$${faker.number.int({min: 50, max: 90})},000 - $${faker.number.int({min:91, max: 200})},000`,
            location: `${faker.location.city()}, ${faker.location.state()}`,
            postedBy: recruiterId
        });
    }

    await Job.insertMany(jobs);
    
    fs.writeFileSync(`${__dirname}/fake_users.json`, JSON.stringify(users, null, 2));
    fs.writeFileSync(`${__dirname}/fake_jobs.json`, JSON.stringify(jobs, null, 2));

    console.log('Data Imported successfully into memory database!');
  } catch (err) {
    console.error(err);
  }
}
