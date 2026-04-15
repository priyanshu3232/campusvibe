// CampusVibe — Mock chat/conversation data
import { MOCK_USERS } from './mockUsers';

export const MOCK_CHATS = [
  // Chat 1: Study group planning
  {
    id: 'chat_1',
    participantId: 'user_4',
    messages: [
      { id: 'msg_1_1', senderId: 'user_4', text: 'Bro DSA exam next week, kuch padha?', timestamp: '2026-04-07T18:00:00Z' },
      { id: 'msg_1_2', senderId: 'me', text: 'Nahi yaar 😭 trees and graphs samajh nahi aaye abhi tak', timestamp: '2026-04-07T18:02:00Z' },
      { id: 'msg_1_3', senderId: 'user_4', text: 'Same lol. Wanna do a group study sesh tomorrow?', timestamp: '2026-04-07T18:03:00Z' },
      { id: 'msg_1_4', senderId: 'me', text: 'Yes please. Library ya common room?', timestamp: '2026-04-07T18:05:00Z' },
      { id: 'msg_1_5', senderId: 'user_4', text: 'Library 3rd floor, less crowd wahan pe. 4 PM works?', timestamp: '2026-04-07T18:06:00Z' },
      { id: 'msg_1_6', senderId: 'me', text: 'Done. Rahul ko bhi bula lete hain, he\'s good at DP', timestamp: '2026-04-07T18:08:00Z' },
      { id: 'msg_1_7', senderId: 'user_4', text: 'Good idea. I\'ll text him. Also bring your notes for sorting algos', timestamp: '2026-04-07T18:09:00Z' },
      { id: 'msg_1_8', senderId: 'me', text: 'Bold of you to assume I have notes 😂', timestamp: '2026-04-07T18:10:00Z' },
      { id: 'msg_1_9', senderId: 'user_4', text: 'Haha fair. I\'ll get the PYQs from the drive. That should help', timestamp: '2026-04-07T18:12:00Z' },
      { id: 'msg_1_10', senderId: 'me', text: 'You\'re a lifesaver. See you tomorrow then!', timestamp: '2026-04-07T18:13:00Z' },
      { id: 'msg_1_11', senderId: 'user_4', text: 'Pakka. And get some sleep tonight, you look dead in class 💀', timestamp: '2026-04-07T18:14:00Z' },
      { id: 'msg_1_12', senderId: 'me', text: 'Sleep is for the weak. But okay fine, goodnight 😴', timestamp: '2026-04-07T18:16:00Z' },
    ],
  },

  // Chat 2: Birthday planning
  {
    id: 'chat_2',
    participantId: 'user_7',
    messages: [
      { id: 'msg_2_1', senderId: 'user_7', text: 'Bro Ankit ka birthday kal hai, plan kya hai?', timestamp: '2026-04-06T20:00:00Z' },
      { id: 'msg_2_2', senderId: 'me', text: 'Oh shit I almost forgot! Cake order kiya kisine?', timestamp: '2026-04-06T20:02:00Z' },
      { id: 'msg_2_3', senderId: 'user_7', text: 'Nahi abhi tak. Bakery near gate 2 se kara lete hain, chocolate wala', timestamp: '2026-04-06T20:03:00Z' },
      { id: 'msg_2_4', senderId: 'me', text: 'Done. 1 kg enough hoga? We\'re like 8-10 people', timestamp: '2026-04-06T20:05:00Z' },
      { id: 'msg_2_5', senderId: 'user_7', text: 'Make it 1.5 kg. Better to have extra than less. Last time Vikram ate half the cake alone 😤', timestamp: '2026-04-06T20:06:00Z' },
      { id: 'msg_2_6', senderId: 'me', text: 'Hahaha true. I\'ll order it. ₹150 per person collect kar lena', timestamp: '2026-04-06T20:08:00Z' },
      { id: 'msg_2_7', senderId: 'user_7', text: 'Cool. 12 baje surprise denge room pe?', timestamp: '2026-04-06T20:10:00Z' },
      { id: 'msg_2_8', senderId: 'me', text: 'Yess midnight surprise. Everyone gather at my room at 11:50', timestamp: '2026-04-06T20:11:00Z' },
      { id: 'msg_2_9', senderId: 'user_7', text: 'Also someone get the bumps ready lol', timestamp: '2026-04-06T20:12:00Z' },
      { id: 'msg_2_10', senderId: 'me', text: 'RIP Ankit\'s back 💀 okay I\'ll create a group for coordination', timestamp: '2026-04-06T20:14:00Z' },
      { id: 'msg_2_11', senderId: 'user_7', text: 'Perfect. Don\'t add Ankit to the group this time. Last year Sneha accidentally added the birthday person 😂', timestamp: '2026-04-06T20:15:00Z' },
      { id: 'msg_2_12', senderId: 'me', text: 'Noted lol. This is going to be fun 🎂', timestamp: '2026-04-06T20:17:00Z' },
    ],
  },

  // Chat 3: Professor complaints
  {
    id: 'chat_3',
    participantId: 'user_19',
    messages: [
      { id: 'msg_3_1', senderId: 'me', text: 'Dude did Prof. Rao actually give us assignment due tomorrow??', timestamp: '2026-04-08T21:00:00Z' },
      { id: 'msg_3_2', senderId: 'user_19', text: 'Bro yes. 3 questions, each with 5 sub-parts. The man has no mercy', timestamp: '2026-04-08T21:02:00Z' },
      { id: 'msg_3_3', senderId: 'me', text: 'We literally had a quiz yesterday and lab report due today. Does he think we only have his subject?', timestamp: '2026-04-08T21:04:00Z' },
      { id: 'msg_3_4', senderId: 'user_19', text: 'He literally said "this should only take 2 hours" BRUH 2 hours for question 1 maybe', timestamp: '2026-04-08T21:05:00Z' },
      { id: 'msg_3_5', senderId: 'me', text: 'The attendance policy is also insane. 85% mandatory? I\'ve been sick twice and I\'m already at 78%', timestamp: '2026-04-08T21:07:00Z' },
      { id: 'msg_3_6', senderId: 'user_19', text: 'Get a medical certificate. Nurse didi at the health center is nice about it', timestamp: '2026-04-08T21:08:00Z' },
      { id: 'msg_3_7', senderId: 'me', text: 'Good idea. Also have you started the assignment? Want to discuss Q2?', timestamp: '2026-04-08T21:10:00Z' },
      { id: 'msg_3_8', senderId: 'user_19', text: 'Q2 is basically the same as the tutorial problem from week 3. Check those notes', timestamp: '2026-04-08T21:11:00Z' },
      { id: 'msg_3_9', senderId: 'me', text: 'Oh wait you\'re right! Thanks bhai, that saves so much time', timestamp: '2026-04-08T21:13:00Z' },
      { id: 'msg_3_10', senderId: 'user_19', text: 'No worries. Let\'s just survive this semester 💪', timestamp: '2026-04-08T21:14:00Z' },
      { id: 'msg_3_11', senderId: 'me', text: 'Amen. Chai break at 11? Night canteen?', timestamp: '2026-04-08T21:15:00Z' },
      { id: 'msg_3_12', senderId: 'user_19', text: 'You read my mind. See you there', timestamp: '2026-04-08T21:16:00Z' },
    ],
  },

  // Chat 4: Internship info
  {
    id: 'chat_4',
    participantId: 'user_22',
    messages: [
      { id: 'msg_4_1', senderId: 'user_22', text: 'Hey! Saw your post about looking for internships. I might have a lead', timestamp: '2026-04-05T14:00:00Z' },
      { id: 'msg_4_2', senderId: 'me', text: 'Oh really? Tell me more!', timestamp: '2026-04-05T14:03:00Z' },
      { id: 'msg_4_3', senderId: 'user_22', text: 'My senior is at Razorpay and they\'re hiring SDE interns. 6 month stint, Bangalore based', timestamp: '2026-04-05T14:04:00Z' },
      { id: 'msg_4_4', senderId: 'me', text: 'That sounds amazing! What\'s the tech stack? And stipend?', timestamp: '2026-04-05T14:06:00Z' },
      { id: 'msg_4_5', senderId: 'user_22', text: 'Go + React. Stipend is around 80k/month. The team is really good apparently', timestamp: '2026-04-05T14:07:00Z' },
      { id: 'msg_4_6', senderId: 'me', text: '80k?? That\'s insane. I know React but Go is new for me', timestamp: '2026-04-05T14:09:00Z' },
      { id: 'msg_4_7', senderId: 'user_22', text: 'They\'re okay with people learning on the job. The interview is more DSA + system design focused', timestamp: '2026-04-05T14:10:00Z' },
      { id: 'msg_4_8', senderId: 'me', text: 'I can work with that. Can you share the referral link or your senior\'s contact?', timestamp: '2026-04-05T14:12:00Z' },
      { id: 'msg_4_9', senderId: 'user_22', text: 'Sending you his LinkedIn. Mention my name when you reach out, he\'ll fast-track your resume', timestamp: '2026-04-05T14:13:00Z' },
      { id: 'msg_4_10', senderId: 'me', text: 'You\'re the best! I owe you one 🙏', timestamp: '2026-04-05T14:15:00Z' },
      { id: 'msg_4_11', senderId: 'user_22', text: 'No worries, we\'re all in this together. Also prep Leetcode mediums, that\'s what they ask', timestamp: '2026-04-05T14:16:00Z' },
      { id: 'msg_4_12', senderId: 'me', text: 'On it. Starting tonight. Thanks again Shreya!', timestamp: '2026-04-05T14:18:00Z' },
      { id: 'msg_4_13', senderId: 'user_22', text: 'Good luck! Let me know how it goes 💪', timestamp: '2026-04-05T14:19:00Z' },
    ],
  },

  // Chat 5: Meme sharing / casual banter
  {
    id: 'chat_5',
    participantId: 'user_9',
    messages: [
      { id: 'msg_5_1', senderId: 'user_9', text: 'Bro check this meme 😂 [engineering_meme.jpg]', timestamp: '2026-04-08T15:00:00Z' },
      { id: 'msg_5_2', senderId: 'me', text: 'LMAOOO "me explaining my 6 backlogs to the interviewer" 💀💀', timestamp: '2026-04-08T15:02:00Z' },
      { id: 'msg_5_3', senderId: 'user_9', text: 'That\'s literally half our batch. Also did you see Varun\'s post about Leetcode?', timestamp: '2026-04-08T15:03:00Z' },
      { id: 'msg_5_4', senderId: 'me', text: '45 day streak? That man is not human. I can\'t even maintain a 3 day streak', timestamp: '2026-04-08T15:05:00Z' },
      { id: 'msg_5_5', senderId: 'user_9', text: 'Fr fr. Meanwhile I\'m watching Netflix telling myself "productive break" 🤡', timestamp: '2026-04-08T15:06:00Z' },
      { id: 'msg_5_6', senderId: 'me', text: 'What are you watching?', timestamp: '2026-04-08T15:07:00Z' },
      { id: 'msg_5_7', senderId: 'user_9', text: 'Panchayat Season 4. It\'s so good. Binged 5 episodes yesterday instead of studying', timestamp: '2026-04-08T15:08:00Z' },
      { id: 'msg_5_8', senderId: 'me', text: 'No spoilers!! I\'m on episode 2. Sachiv ji is the GOAT', timestamp: '2026-04-08T15:10:00Z' },
      { id: 'msg_5_9', senderId: 'user_9', text: 'Haha okay no spoilers. But episode 7 will destroy you emotionally. Just saying.', timestamp: '2026-04-08T15:11:00Z' },
      { id: 'msg_5_10', senderId: 'me', text: 'Great, something to look forward to besides exams 😂', timestamp: '2026-04-08T15:13:00Z' },
      { id: 'msg_5_11', senderId: 'user_9', text: 'Oh also, you coming for the football match tomorrow? Inter-hostel final', timestamp: '2026-04-08T15:14:00Z' },
      { id: 'msg_5_12', senderId: 'me', text: 'Obviously! H3 vs H7 right? H7 is going down 🔥', timestamp: '2026-04-08T15:15:00Z' },
      { id: 'msg_5_13', senderId: 'user_9', text: 'Bold prediction. Last time H7 won 4-1. But okay, we\'ll see 😏', timestamp: '2026-04-08T15:16:00Z' },
      { id: 'msg_5_14', senderId: 'me', text: 'Revenge arc incoming. 5 PM at the ground. Bring the energy!', timestamp: '2026-04-08T15:17:00Z' },
    ],
  },

  // Chat 6: AI Campus Assistant
  {
    id: 'chat_6',
    participantId: 'ai_assistant',
    messages: [
      { id: 'msg_6_1', senderId: 'me', text: 'Hey, what\'s the mess menu for today?', timestamp: '2026-04-09T07:30:00Z' },
      { id: 'msg_6_2', senderId: 'ai_assistant', text: 'Good morning! Today\'s mess menu:\n\n🍳 Breakfast (7-9 AM): Aloo Paratha, Curd, Tea/Coffee\n🍛 Lunch (12-2 PM): Rice, Dal Makhani, Mix Veg, Roti, Salad\n🍽️ Dinner (7-9 PM): Chole, Rice, Roti, Gulab Jamun\n\nWant me to check anything else?', timestamp: '2026-04-09T07:30:05Z' },
      { id: 'msg_6_3', senderId: 'me', text: 'Nice, gulab jamun day! Also, when is the library open today?', timestamp: '2026-04-09T07:31:00Z' },
      { id: 'msg_6_4', senderId: 'ai_assistant', text: 'Library hours for today (Wednesday):\n📚 Main Library: 8 AM - 11 PM\n📖 Reading Room: 24/7 (always open)\n💻 Digital Library: 9 AM - 8 PM\n\nPro tip: 3rd floor is usually the quietest spot for focused study! 🤫', timestamp: '2026-04-09T07:31:05Z' },
      { id: 'msg_6_5', senderId: 'me', text: 'What events are happening this week on campus?', timestamp: '2026-04-09T07:32:00Z' },
      { id: 'msg_6_6', senderId: 'ai_assistant', text: 'Here\'s what\'s happening this week:\n\n📅 Wed (Today): Coding Club Workshop - Intro to Rust, 5 PM, CS Lab 2\n📅 Thu: Inter-hostel Football Final, 5 PM, Sports Ground\n📅 Fri: Movie Night - "12 Angry Men", 8 PM, Open Air Theatre\n📅 Sat: Startup Weekend Kickoff, 10 AM, Auditorium\n📅 Sun: Cultural Club Jamming Session, 4 PM, Music Room\n\nWant details on any of these? 🎉', timestamp: '2026-04-09T07:32:05Z' },
      { id: 'msg_6_7', senderId: 'me', text: 'The Rust workshop sounds cool! How do I register?', timestamp: '2026-04-09T07:33:00Z' },
      { id: 'msg_6_8', senderId: 'ai_assistant', text: 'For the Rust Workshop:\n\n✅ Registration: Fill the form on Coding Club\'s Instagram (@campuscodingclub)\n📍 Venue: CS Lab 2, 2nd Floor, Academic Block\n⏰ Time: 5:00 - 7:00 PM\n👥 Spots left: ~12 out of 40\n📋 Prerequisites: Basic programming knowledge (any language)\n\nI\'d suggest registering soon, these fill up fast! Shall I set a reminder for you?', timestamp: '2026-04-09T07:33:05Z' },
      { id: 'msg_6_9', senderId: 'me', text: 'Yes please, set a reminder for 4:30 PM', timestamp: '2026-04-09T07:34:00Z' },
      { id: 'msg_6_10', senderId: 'ai_assistant', text: '⏰ Reminder set for 4:30 PM today - "Rust Workshop at CS Lab 2 at 5 PM"\n\nI\'ll ping you 30 minutes before. Enjoy the workshop! 🦀', timestamp: '2026-04-09T07:34:05Z' },
      { id: 'msg_6_11', senderId: 'me', text: 'Thanks! You\'re way more helpful than the actual college website 😂', timestamp: '2026-04-09T07:35:00Z' },
      { id: 'msg_6_12', senderId: 'ai_assistant', text: 'Haha, I appreciate that! 😄 To be fair, the bar was pretty low. I\'m here 24/7 if you need anything - mess menus, event info, professor office hours, or just campus tips. Have a great day! 🎓', timestamp: '2026-04-09T07:35:05Z' },
    ],
  },
];

export default MOCK_CHATS;
