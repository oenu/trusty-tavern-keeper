import {
  RiParentFill,
  RiUserFill,
  RiGhost2Fill,
  RiSkull2Fill,
} from 'react-icons/ri';
import { TopicIntensity } from 'src/app/types/supabase-type-extensions';

export const topicIntensityIcons: Record<TopicIntensity, JSX.Element> = {
  [TopicIntensity.Fantasy]: <RiParentFill />,
  [TopicIntensity.Adventure]: <RiUserFill />,
  [TopicIntensity.Struggle]: <RiGhost2Fill />,
  [TopicIntensity.Tragedy]: <RiSkull2Fill />,
};

export const topicIntensityDescriptions: Record<
  TopicIntensity,
  {
    title: string;
    icon: JSX.Element;
    shortDescription: string;
    description: string;
  }
> = {
  [TopicIntensity.Fantasy]: {
    icon: topicIntensityIcons[TopicIntensity.Fantasy],
    title: 'Fantasy',
    shortDescription: 'Safe and fun, appropriate for all ages',
    description:
      'Roleplay in the game will be focused on numbers and stats, with minimal description of violence or sensitive content. This is the default intensity and is suitable for most games. If you are playing with children or are unsure of what intensity to select, this is a good place to start.',
  },
  [TopicIntensity.Adventure]: {
    icon: topicIntensityIcons[TopicIntensity.Adventure],
    title: 'Adventure',
    shortDescription: 'An engaging experience, but not too intense',
    description:
      'This intensity is suitable for most games, it focuses on the mechanics of the game but allows players to add detail to their actions.',
  },
  [TopicIntensity.Struggle]: {
    icon: topicIntensityIcons[TopicIntensity.Struggle],
    title: 'Struggle',
    shortDescription: 'An intense experience, for mature audiences',
    description:
      'This intensity is suitable for games where players will be interacting with each other in a more personal way. This intensity allows players to embellish their actions with more detail, but still keeps the focus on the mechanics of the game and avoids gratuitous violence or sensitive content.',
  },
  [TopicIntensity.Tragedy]: {
    icon: topicIntensityIcons[TopicIntensity.Tragedy],
    title: 'Tragedy',
    shortDescription: 'A dark and intense experience, potentially upsetting',
    description:
      'This is the most intense level of detail that players can select. Roleplay and combat can be expected to be more graphic and detailed. This intensity is only suitable for games with players who are mature and understand the sensitive nature of the content.',
  },
};
