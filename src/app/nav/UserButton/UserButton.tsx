import { Avatar, Button, Group, Text } from '@mantine/core';
import { TbChevronRight } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

function UserButton({
  customOnClick,
  name,
  discriminator,
  image,
  short,
}: {
  customOnClick?: () => void;
  name: string;
  discriminator: string;
  image: string;
  short?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <Button
      variant="subtle"
      h={'100%'}
      px={0}
      radius={'xl'}
      onClick={() => {
        navigate('/profile');
        if (customOnClick) {
          customOnClick(); // Close the nav
        }
      }}
    >
      <Group noWrap>
        <Avatar src={image} radius="xl" />
        {!short && (
          <>
            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500} truncate lineClamp={1}>
                {name}
              </Text>

              <Text color="dimmed" size="xs">
                {discriminator}
              </Text>
            </div>
            <TbChevronRight size={16} />
          </>
        )}
      </Group>
    </Button>
  );
}

export default UserButton;
