export interface InboxMessage {
  id: string;
  text: string;
  timestamp: string;
  direction: 'fromBrand' | 'fromCreator';
}

export const inboxThreads: Record<string, InboxMessage[]> = {
  '1': [
    {
      id: 't1m1',
      direction: 'fromCreator',
      text: 'Hey there! Thanks for reaching out.',
      timestamp: '2024-08-01T10:00:00.000Z'
    },
    {
      id: 't1m2',
      direction: 'fromBrand',
      text: 'Excited to chat about a potential collab!',
      timestamp: '2024-08-01T10:05:00.000Z'
    },
    {
      id: 't1m3',
      direction: 'fromCreator',
      text: 'Looking forward to it!',
      timestamp: '2024-08-01T10:10:00.000Z'
    }
  ],
  '2': [
    {
      id: 't2m1',
      direction: 'fromCreator',
      text: "I'd love to hear more about your campaign.",
      timestamp: '2024-08-02T11:00:00.000Z'
    },
    {
      id: 't2m2',
      direction: 'fromBrand',
      text: 'I will send the details shortly.',
      timestamp: '2024-08-02T11:02:00.000Z'
    }
  ],
  '3': [
    {
      id: 't3m1',
      direction: 'fromBrand',
      text: 'Hi! Just checking in about the product sample.',
      timestamp: '2024-08-03T09:00:00.000Z'
    },
    {
      id: 't3m2',
      direction: 'fromCreator',
      text: 'Got it! Shooting content this weekend.',
      timestamp: '2024-08-03T09:05:00.000Z'
    }
  ]
};

export default inboxThreads;
