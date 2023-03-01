-- name: The name of an upsetting item/behavior/topic/thing
-- description: A description of how the item might occurr in a game of dungeons and dragons
-- category: The category of the content ('Physical','Objects','Social','Animals','Death','Supernatural','Other')
-- emoji: The emoji that represents the content
-- default_intensity: The default intensity of the content `ENUM ('Neutral', 'Warning', 'Ban')`
-- Neutral: I am not opposed to the content being present in the game
-- Warning: I am not opposed to the content being present in the game if I am warned about it and given the option to opt out
-- Ban: I am opposed to the content being present in the game (this will prevent me from joining the game)
-- Physical Sensation / Body
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Heights',
    'Being in a high place, or looking down from a high place.',
    'Physical',
    '🏔️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Imprisonment',
    'Being trapped, or being unable to escape.',
    'Physical',
    '🔒',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Water',
    'Water, oceans, lakes, and other bodies of water.',
    'Physical',
    '🌊',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Drowning',
    'Being trapped underwater, or being unable to breathe.',
    'Physical',
    '🏊',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Fire',
    'Fire, flames, and other things that burn.',
    'Physical',
    '🔥',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Darkness',
    'Darkness, shadows, and other things that are hard to see in.',
    'Physical',
    '🌑',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Gore',
    'Depictions of blood, guts, or other body parts.',
    'Physical',
    '🩸',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Disfigurement',
    'Depictions of disfigurement, such as burns, scars, or amputations.',
    'Physical',
    '🦵',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Diseases',
    'Depictions of diseases, plagues, or other illnesses.',
    'Physical',
    '🤒',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Body Modification',
    'Depictions of body modification, such as tattoos or piercings.',
    'Physical',
    '👁️',
    'Neutral'
  );


-- Objects
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Needles',
    'Either hollow or solid needles, commonly found in medical settings or in textile crafts.',
    'Objects',
    '💉',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Alcohol',
    'Alcohol, such as beer, wine, or liquor.',
    'Objects',
    '🍺',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Drugs',
    'Drugs, such as marijuana, cocaine, or heroin.',
    'Objects',
    '🌿',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Guns',
    'Guns, such as pistols, rifles, or shotguns.',
    'Objects',
    '🔫',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Knives and Blades',
    'Knives, such as kitchen knives, pocket knives, or swords.',
    'Objects',
    '🗡️',
    'Neutral'
  );


-- Social Interaction / People
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Sexism',
    'Being treated differently because of your gender.',
    'Social',
    '👩',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Homophobia',
    'Being treated differently because of your sexual orientation.',
    'Social',
    '🏳️‍🌈',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Racism',
    'Being treated differently because of your race.',
    'Social',
    '🧕',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Ageism',
    'Being treated differently because of your age.',
    'Social',
    '👴',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Transphobia',
    'Being treated differently because of your gender identity.',
    'Social',
    '👧',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Abandonment',
    'Being left alone, or being unable to find help.',
    'Social',
    '👋',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Dentists',
    'Dentists, dental hygienists, and other people who work in a dental office.',
    'Social',
    '🦷',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Clowns',
    'Clowns, circus performers, often with exaggerated features.',
    'Social',
    '🤡',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Evil Races',
    'Depictions of a specific group of people, such as goblins or orcs as being inherently evil.',
    'Social',
    '👹',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Kidnapping / Abduction',
    'Being taken against your will, or being unable to escape.',
    'Social',
    '👮',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Sexual Assault',
    'Depictions of sexual violence, such as rape or molestation.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Incest',
    'Sexual activity or intimate relationships between close family members.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Domestic Violence',
    'Depictions of violence in the home, or violence against a spouse or partner.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Violence Against Children',
    'Depictions of violence or abuse towards children.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Slavery / Forced Labor',
    'Being forced to work, or being forced to do something against your will.',
    'Social',
    '🔗',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Human Trafficking',
    'Being forced to work, or being forced to do something against your will.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Collonialism',
    'The exploitation of a country or people through political, economic, cultural or militarisic means.',
    'Social',
    '🇬🇧',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Religious Persecution',
    'The act of singling out or punishing individuals or communities based on their religious beliefs or practices.',
    'Social',
    '🛐',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Depictions of Religious Figures',
    'Depictions of human religious figures, such as prophets, saints, or religious leaders.',
    'Social',
    '🕋',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Religious Extremism',
    'The belief in and promotion of radical or fanatical interpretations of religion, often resulting in acts of violence or terrorism.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Political Violence',
    'The use of physical force or aggression in furtherance of political aims, including acts of terrorism, insurgency, civil unrest, or state-sponsored violence.',
    'Social',
    '🛑',
    'Ban'
  );


-- Animals
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Violence against animals',
    'Hunting, butchery or other depictions of violence.',
    'Animals',
    '🪺',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Insects',
    'Insects, flies, maggots or other small creatures with many legs.',
    'Animals',
    '🪲',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Spiders',
    'Spiders, arachnids, and other arachnid-like creatures.',
    'Animals',
    '🕷️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Snakes',
    'Snakes, serpents, and other reptiles with long bodies and no legs.',
    'Animals',
    '🐍',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Rats',
    'Rats, mice, and other rodents.',
    'Animals',
    '🐀',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Bats',
    'Bats, flying foxes, and other flying mammals.',
    'Animals',
    '🦇',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Dogs',
    'Dogs, wolves, coyotes, and other canines.',
    'Animals',
    '🐕',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Cats',
    'Cats, lions, tigers, and other felines.',
    'Animals',
    '🐈',
    'Neutral'
  );

-- Death
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Death',
    'Death, dying, and other things related to the end of life.',
    'Death',
    '☠️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Funerals',
    'Funerals, wakes, and other ceremonies related to death.',
    'Death',
    '⚱️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Cemeteries',
    'Cemeteries, graveyards, and other places where the dead are buried.',
    'Death',
    '🪦',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Grave robbing',
    'Grave robbing, tomb raiding, and other things related to stealing from the dead.',
    'Death',
    '⚰️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Skeletons',
    'Skeletons, bones, and other things related to the dead.',
    'Death',
    '💀',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Suicide',
    'The act of taking ones own life, or thoughts and discussions about suicide.',
    'Death',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Genocide',
    'The deliberate and systematic destruction of a racial, ethnic, or religious group',
    'Death',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Familial Death',
    'The death of family members or close relatives',
    'Death',
    '❤️‍🩹',
    'Warning'
  );


-- Supernatural
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'The Afterlife',
    'Heaven, hell, and other beliefs about what happens after death.',
    'Supernatural',
    '👼',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Possesion',
    'Possession, being taken over by an evil entity, and other related topics.',
    'Supernatural',
    '🕴️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Ghosts',
    'Ghosts, specters, spirits, and other representations of the dead.',
    'Supernatural',
    '👻',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Mummies',
    'Mummies, mummification, and other things related to the dead.',
    'Supernatural',
    '🇪🇬',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Zombies',
    'Zombies, ghouls, and other undead creatures.',
    'Supernatural',
    '🧟',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Vampires',
    'Vampires, bloodsuckers, and other creatures that feed on blood.',
    'Supernatural',
    '🧛',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Werewolves',
    'Werewolves, lycanthropes, and other creatures that transform into wolves.',
    'Supernatural',
    '🐺',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Demons',
    'Demons, devils, and other creatures that are evil and/or from hell.',
    'Supernatural',
    '👿',
    'Neutral'
  );


-- Other
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Natural Disasters',
    'Depictions of natural disasters, such as tsunamis, earthquakes, or volcanoes.',
    'Other',
    '🌋',
    'Neutral'
  );