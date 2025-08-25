export interface Message {
  id: string;
  creatorId: string;
  sender: 'brand' | 'creator';
  text: string;
  campaign: string;
  timestamp: string;
}

export const messages: Message[] = [
  {
    id: 'msg1',
    creatorId: '1',
    sender: 'brand',
    text: 'Welcome to the campaign!',
    campaign: '1',
    timestamp: '2024-05-01T12:10:00.000Z'
  },
  {
    id: 'msg2',
    creatorId: '1',
    sender: 'creator',
    text: 'Thanks, excited to work together!',
    campaign: '1',
    timestamp: '2024-05-01T12:12:00.000Z'
  }
];
export default messages;
