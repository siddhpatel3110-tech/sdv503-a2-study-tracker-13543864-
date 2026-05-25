const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

// In-memory database (Global state)
const studySessions = [];

// Helper function to initialize readline interface
function createInterface() {
  return readline.createInterface({ input, output });
}

// 1. Add a Study Session (with validation and retry loop)
async function addSessionMenu() {
  const rl = createInterface();
  console.log('\n--- Add New Study Session ---');

  try {
    // Topic validation
    const topic = await rl.question('Enter study topic: ');
    if (!topic.trim()) {
      console.log('Error: Topic cannot be empty.');
      rl.close();
      return await addSessionMenu(); // Retry loop
    }

    // Minutes validation
    const minutesInput = await rl.question('Enter duration (minutes): ');
    const minutes = parseInt(minutesInput, 10);

    if (isNaN(minutes) || minutes <= 0 || !Number.isInteger(minutes)) {
      console.log('Error: Minutes must be a whole number greater than zero.');
      rl.close();
      return await addSessionMenu(); // Retry loop
    }

    // Save valid session to memory
    studySessions.push({ topic: topic.trim(), minutes: minutes });
    console.log(' Session recorded successfully!');

  } catch (error) {
    console.log('An error occurred:', error.message);
  } finally {
    rl.close();
  }

  await mainMenu(); // Return to main menu
}

// 2. List All Sessions
async function listSessionsMenu() {
  console.log('\n--- Recorded Study Sessions ---');
 
  if (studySessions.length === 0) {
    console.log('No sessions recorded yet.');
  } else {
    studySessions.forEach((session, index) => {
      console.log(`${index + 1}. Topic: ${session.topic} | Duration: ${session.minutes} mins`);
    });
  }
 
  await mainMenu();
}

// 3. Show Total Minutes
async function showTotalMenu() {
  console.log('\n--- Weekly Summary ---');
 
  // Sum up all minutes using reduce
  const totalMinutes = studySessions.reduce((sum, session) => sum + session.minutes, 0);
 
  console.log(`Total Study Time: ${totalMinutes} minutes`);
  await mainMenu();
}

// Main Menu Loop
async function mainMenu() {
  const rl = createInterface();
 
  console.log('\n===== STUDY TRACKER MENU =====');
  console.log('1. Add a study session');
  console.log('2. List all study sessions');
  console.log('3. Show total minutes studied');
  console.log('4. Exit');
 
  const choice = await rl.question('Choose an option (1-4): ');
  rl.close();

  switch (choice.trim()) {
    case '1':
      await addSessionMenu();
      break;
    case '2':
      await listSessionsMenu();
      break;
    case '3':
      await showTotalMenu();
      break;
    case '4':
      console.log('Goodbye! Happy studying.');
      process.exit(0);
      break;
    default:
      console.log(' Invalid option. Please select 1, 2, 3, or 4.');
      await mainMenu();
      break;
  }
}

// Start the application
mainMenu();