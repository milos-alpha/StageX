import { formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
};

export const formatFullDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};