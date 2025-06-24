export type StoredMessage = {
  sender: 'brand' | 'creator';
  content: string;
  timestamp: string;
};

const messages: Record<string, StoredMessage[]> = {
  '1': [
    { sender: 'brand', content: 'Welcome to the campaign!', timestamp: '2024-05-01T12:10:00.000Z' },
    { sender: 'creator', content: 'Thanks, excited to work together!', timestamp: '2024-05-01T12:12:00.000Z' }
  ],
  '2': [
    { sender: 'brand', content: 'Hi there, just checking in about the product sample.', timestamp: '2024-06-10T09:00:00.000Z' },
    { sender: 'creator', content: 'Got it! Shooting content this weekend.', timestamp: '2024-06-10T09:05:00.000Z' }
  ],
  '3': [
    { sender: 'creator', content: 'When does the campaign kick off?', timestamp: '2024-07-15T15:00:00.000Z' },
    { sender: 'brand', content: 'We start August 1st.', timestamp: '2024-07-15T15:02:00.000Z' }
  ]
};

export default messages;
