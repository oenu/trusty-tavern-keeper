CREATE TYPE ContentIntensity AS ENUM ('Neutral', 'Warning', 'Ban');
-- As ban is the last option, it will be the value returned by "max" when comparing two content intensities
CREATE TYPE TopicIntensity AS ENUM ('Fantasy', 'Adventure', 'Struggle', 'Tragedy');
CREATE TYPE ContentCategory AS ENUM (
  'Physical',
  'Objects',
  'Social',
  'Animals',
  'Death',
  'Supernatural',
  'Other'
);