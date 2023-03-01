-- Seed data for the topic table
-- name: the name of the topic (Shorthand for the topic, eg. 'Combat')
-- description: A description of the topic and how it might be used in a game of dungeons and dragons (eg. 'How do you want to play combat in your game, some players like to describe their attacks in detail, others prefer to keep it simple.')
-- fantasy_example: A fantasy example of the topic (Lowest intensity)
-- adventure_example: An adventure example of the topic (Medium intensity)
-- struggle_example: A struggle example of the topic (High intensity)
-- tragedy_example: A tragedy example of the topic (Highest intensity)
INSERT INTO public.topic (
    name,
    description,
    fantasy_example,
    adventure_example,
    struggle_example,
    tragedy_example
  )
VALUES (
    'Combat - PLACEHOLDER',
    'How do you want to play combat in your game, some players like to describe their attacks in detail, others prefer to keep it simple. PLACEHOLDER',
    'I deal 6 damage to the dragon with my sword.',
    'I strike the dragon with my sword, it pierces its scales and deals 6 damage.',
    'The dragon roars in pain as I plunge my sword between its scales dealing 6 damage.',
    'I wrench my sword from the dragon''s chest, blood spurting from the wound as I deal 6 damage.'
  );

INSERT INTO public.topic (
    name,
    description,
    fantasy_example,
    adventure_example,
    struggle_example,
    tragedy_example
  )
VALUES (
    'Magic - PLACEHOLDER',
    'How do you want to play magic in your game, some players like to describe their spells in detail, others prefer to keep it simple. PLACEHOLDER',
    'I cast fireball, dealing 6 damage to the dragon.',
    'I cast fireball, the dragon roars in pain as it takes 6 damage.',
    'I cast fireball, the dragon roars in pain as it takes 6 damage, its scales begin to melt.',
    'I cast fireball, the dragon roars in pain as it takes 6 damage, its scales begin to melt, its flesh begins to burn.'
  );